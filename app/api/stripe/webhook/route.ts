import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { dbConnect } from '../../../../lib/db';
import SupportPurchase from '../../../../models/SupportPurchase';
import User from '../../../../models/User';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecret || !webhookSecret) {
  throw new Error('Stripe secrets missing');
}

const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig || '', webhookSecret!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      await dbConnect();
      await SupportPurchase.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          userId,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'paid',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await User.findByIdAndUpdate(userId, { isSupporter: true });
    }
  }

  return NextResponse.json({ received: true });
}
