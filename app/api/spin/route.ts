import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { dbConnect } from '../../../lib/db';
import { getUserIdFromSession } from '../../../lib/auth';
import User from '../../../models/User';
import Spin from '../../../models/Spin';
import { rateLimit } from '../../../lib/rateLimit';
import { RTP_TARGET, serverSpinWithRTP } from '../../../lib/slot';

const schema = z.object({ bet: z.enum(['10', '50', '100', '200']).transform((v) => Number(v)) });

export async function POST(req: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse({ bet: String(body?.bet) });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid bet' }, { status: 400 });
  const bet = parsed.data.bet;

  const ip = req.headers.get('x-forwarded-for') || 'ip:unknown';
  const limiterKey = `${userId}:${ip}`;
  const limitResult = rateLimit(limiterKey, 8, 10_000); // TODO: swap for Redis-backed limiter in production.
  if (!limitResult.allowed) {
    return NextResponse.json({ error: 'Too many spins, slow down' }, { status: 429 });
  }

  await dbConnect();
  const session = await mongoose.startSession();
  let balance = 0;
  let result: string[] = [];
  let win = 0;
  let multiplier = 0;

  const runCore = async (sessionOpt?: mongoose.ClientSession) => {
    const userQuery = User.findById(userId);
    if (sessionOpt) userQuery.session(sessionOpt);
    const user = await userQuery;
    if (!user) throw new Error('Not found');
    if (user.demoBalance < bet) {
      throw new Error('Insufficient balance');
    }

    const outcome = serverSpinWithRTP(bet);
    result = outcome.reels.map((r) => r.key);
    multiplier = outcome.payout.multiplier;
    win = outcome.payout.win;

    user.demoBalance = user.demoBalance - bet + win;
    balance = user.demoBalance;

    const spinDoc = {
      userId: user._id,
      bet,
      result: result.join('|'),
      multiplier,
      win,
    };

    if (sessionOpt) {
      await user.save({ session: sessionOpt });
      await Spin.create([spinDoc], { session: sessionOpt });
    } else {
      await user.save();
      await Spin.create(spinDoc);
    }
  };

  try {
    await session.withTransaction(async () => {
      await runCore(session);
    });
  } catch (err: any) {
    await session.endSession();
    const msg = err?.message || 'Spin failed';
    if (msg.includes('Transaction numbers are only allowed')) {
      // Fallback for standalone MongoDB without replica set.
      try {
        await runCore();
      } catch (inner: any) {
        const innerMsg = inner?.message || 'Spin failed';
        const status = innerMsg === 'Insufficient balance' ? 400 : 500;
        return NextResponse.json({ error: innerMsg }, { status });
      }
    } else {
      const status = msg === 'Insufficient balance' ? 400 : 500;
      return NextResponse.json({ error: msg }, { status });
    }
  }

  await session.endSession();

  return NextResponse.json({
    balance,
    reels: result,
    win,
    multiplier,
    rtpTarget: RTP_TARGET,
  });
}
