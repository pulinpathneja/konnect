import { NextRequest, NextResponse } from 'next/server';

// POST /api/payments - Create a payment order
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', userId } = await request.json();

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Minimum amount is ₹10' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // In production, create order via Razorpay/Stripe
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency, receipt: `rcpt_${Date.now()}` });

    const order = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency,
      status: 'created',
      receipt: `rcpt_${Date.now()}`,
    };

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}

// GET /api/payments - Get payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
  }

  // In production, verify payment with Razorpay/Stripe
  return NextResponse.json({
    id: paymentId,
    status: 'captured',
    amount: 50000,
    currency: 'INR',
  });
}
