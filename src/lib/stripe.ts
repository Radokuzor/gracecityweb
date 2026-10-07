import Stripe from "stripe";

// Server-only Stripe client — created lazily so builds don't fail without the key
let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export const GIVE_MIN_CENTS = 100; // $1
export const GIVE_MAX_CENTS = 5_000_000; // $50,000
