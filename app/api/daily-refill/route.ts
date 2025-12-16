import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import { getUserIdFromSession } from '../../../lib/auth';
import User from '../../../models/User';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST() {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const now = Date.now();
  const last = user.lastRefillAt?.getTime() || 0;
  if (now - last < DAY_MS) {
    const next = new Date(last + DAY_MS).toISOString();
    return NextResponse.json({ error: 'Too soon', nextAvailableAt: next }, { status: 400 });
  }

  if (user.demoBalance < 10000) {
    user.demoBalance = 10000;
  }
  user.lastRefillAt = new Date(now);
  await user.save();

  return NextResponse.json({ balance: user.demoBalance, nextAvailableAt: new Date(now + DAY_MS).toISOString() });
}
