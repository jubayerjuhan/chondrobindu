import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { dbConnect } from '../../../../lib/db';
import { getUserIdFromSession } from '../../../../lib/auth';
import User from '../../../../models/User';

const schema = z.object({
  theme: z.string().optional(),
});

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  await dbConnect();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    metadata: { userId, theme: parsed.data.theme || user.supporterTheme || 'default' },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Supporter Pack (Cosmetic Only)',
            description: 'Unlock cabinet theme cosmetics. No coins, no payouts, no gameplay edge.',
          },
          unit_amount: 500,
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/profile?support=success`,
    cancel_url: `${appUrl}/support?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
