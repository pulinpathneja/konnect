import { NextRequest, NextResponse } from 'next/server';

// POST /api/webhooks - Handle payment webhooks from Razorpay/Stripe
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || request.headers.get('stripe-signature');

    // In production, verify the webhook signature
    // const isValid = verifySignature(body, signature, process.env.WEBHOOK_SECRET);
    // if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    const event = JSON.parse(body);

    switch (event.event) {
      case 'payment.captured':
      case 'payment_intent.succeeded': {
        // Credit wallet
        // const { userId, amount } = event.payload;
        // await updateDoc(doc(db, 'wallets', userId), { balance: increment(amount / 100) });
        // await addDoc(collection(db, 'transactions'), { ... });
        console.log('Payment captured:', event);
        break;
      }

      case 'payment.failed':
      case 'payment_intent.payment_failed': {
        // Handle failed payment
        console.log('Payment failed:', event);
        break;
      }

      case 'refund.created': {
        // Handle refund
        console.log('Refund created:', event);
        break;
      }

      default:
        console.log('Unhandled webhook event:', event.event || signature);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
