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

  const userData = user as any;
  const safeUser: SlotUser = {
    _id: userData._id.toString(),
    email: userData.email,
    name: userData.name || undefined,
    demoBalance: userData.demoBalance,
    isSupporter: userData.isSupporter,
    supporterTheme: userData.supporterTheme,
  };

  return <SlotClient user={safeUser} />;
}
