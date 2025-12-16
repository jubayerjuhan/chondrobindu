import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '../../../../lib/db';
import { getUserIdFromSession } from '../../../../lib/auth';
import User from '../../../../models/User';

const schema = z.object({ theme: z.string().min(1) });

export async function POST(req: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });

  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!user.isSupporter) return NextResponse.json({ error: 'Supporter only' }, { status: 403 });

  user.supporterTheme = parsed.data.theme;
  await user.save();

  return NextResponse.json({ supporterTheme: user.supporterTheme });
}
