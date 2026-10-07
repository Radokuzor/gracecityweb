import { NextRequest, NextResponse } from "next/server";
import { getStripe, GIVE_MIN_CENTS, GIVE_MAX_CENTS } from "@/lib/stripe";

// Creates a PaymentIntent for a love offering and returns its client secret
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!Number.isInteger(amount) || amount < GIVE_MIN_CENTS || amount > GIVE_MAX_CENTS) {
      return NextResponse.json({ error: "Please enter an amount between $1 and $50,000." }, { status: 400 });
    }
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
    }

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      description: "Love Offering — BLW Grace City",
      receipt_email: email,
      metadata: { type: "love_offering", name, email, phone },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("give error:", err);
    return NextResponse.json({ error: "We couldn't start your gift. Please try again." }, { status: 500 });
  }
}
