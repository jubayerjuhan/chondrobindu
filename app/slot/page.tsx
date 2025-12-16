import { redirect } from 'next/navigation';
import SlotClient, { SlotUser } from './SlotClient';
import { getUserIdFromSession } from '../../lib/auth';
import { dbConnect } from '../../lib/db';
import User from '../../models/User';

export default async function SlotPage() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    redirect('/auth/login?next=/slot');
  }

  await dbConnect();
  const user = await User.findById(userId).lean();
  if (!user) {
    redirect('/auth/login?next=/slot');
  }

  const safeUser: SlotUser = {
    _id: user._id.toString(),
    email: user.email,
    name: user.name || undefined,
    demoBalance: user.demoBalance,
    isSupporter: user.isSupporter,
    supporterTheme: user.supporterTheme,
  };

  return <SlotClient user={safeUser} />;
}
