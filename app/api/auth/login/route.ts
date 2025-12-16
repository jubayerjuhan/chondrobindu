import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { dbConnect } from '../../../../lib/db';
import User from '../../../../models/User';
import { createSession } from '../../../../lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await createSession(user._id.toString());

  return NextResponse.json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      demoBalance: user.demoBalance,
      isSupporter: user.isSupporter,
      supporterTheme: user.supporterTheme,
    },
  });
}
