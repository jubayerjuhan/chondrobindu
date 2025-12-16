import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import User from '../../../models/User';
import { getUserIdFromSession } from '../../../lib/auth';

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ user: null });
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      demoBalance: user.demoBalance,
      isSupporter: user.isSupporter,
      supporterTheme: user.supporterTheme,
      createdAt: user.createdAt,
    },
  });
}
