import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import { getUserIdFromSession } from '../../../lib/auth';
import User from '../../../models/User';
import Spin from '../../../models/Spin';

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const spins = await Spin.find({ userId }).sort({ createdAt: -1 }).limit(50);

  return NextResponse.json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      demoBalance: user.demoBalance,
      isSupporter: user.isSupporter,
      supporterTheme: user.supporterTheme,
    },
    spins,
  });
}
