"use client";

import { useEffect, useState } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { X, Check, Lock } from "lucide-react";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const PRESETS = [25, 50, 100, 250, 500, 1000];
const MIN = 1;
const MAX = 50_000;

// Match the Stripe card form to the site's black/white, square-edged inputs
const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0a0a0a",
    colorText: "#0a0a0a",
    colorTextSecondary: "#4a4a4a",
    colorTextPlaceholder: "#9a9a9a",
    colorDanger: "#dc2626",
    colorBackground: "#ffffff",
    fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
    fontSizeBase: "16px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid #e8e8e8", boxShadow: "none", padding: "14px 16px" },
    ".Input:focus": { border: "1px solid #0a0a0a", boxShadow: "none" },
    ".Label": { fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#4a4a4a" },
    ".Tab": { border: "1px solid #e8e8e8", boxShadow: "none" },
    ".Tab:hover": { border: "1px solid #0a0a0a" },
    ".Tab--selected, .Tab--selected:focus": { border: "2px solid #0a0a0a", boxShadow: "none" },
  },
};

const fmt = (dollars: number) =>
  dollars.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: dollars % 1 ? 2 : 0 });

type Details = { name: string; email: string; phone: string };

// ── Payment step (must live inside <Elements>) ────────────────
function PaymentStep({
  amount,
  details,
  onBack,
  onSuccess,
}: {
  amount: number;
  details: Details;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setError(null);

    try {
      // Validate the card form before creating the PaymentIntent
      const { error: submitError } = await elements.submit();
      if (submitError) throw new Error(submitError.message);

      const res = await fetch("/api/give", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount * 100), ...details }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/next-steps?give=complete`,
          payment_method_data: {
            billing_details: { name: details.name, email: details.email, phone: details.phone || undefined },
          },
        },
        redirect: "if_required",
      });
      if (confirmError) throw new Error(confirmError.message);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong — please try again.");
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="gc-wizard-body" style={{ justifyContent: "flex-start" }}>
        <p className="gc-wizard-step-num">Step 3 of 3</p>
        <h2 className="gc-wizard-question">Payment details</h2>
        <p className="gc-wizard-hint">
          Giving <strong style={{ color: "#0a0a0a" }}>{fmt(amount)}</strong> as a love offering.
        </p>

        <PaymentElement
          onReady={() => setReady(true)}
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "never", email: "never", phone: "never" } },
          }}
        />
        {!ready && <p style={{ color: "#9a9a9a", fontSize: "0.875rem" }}>Loading secure payment form…</p>}

        {error && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "1rem" }}>{error}</p>}

        <p className="gc-give-secure">
          <Lock size={13} /> Secure payment processed by Stripe
        </p>
      </div>

      <div className="gc-wizard-footer">
        <button className="gc-wizard-back" onClick={onBack} disabled={processing}>
          Back
        </button>
        <button className="gc-wizard-next" onClick={pay} disabled={!stripe || !ready || processing}>
          {processing ? "Processing..." : `Give ${fmt(amount)}`}
        </button>
      </div>
    </>
  );
}

// ── Give modal ────────────────────────────────────────────────
export default function GiveModal({ onClose, initialSuccess = false }: { onClose: () => void; initialSuccess?: boolean }) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [amountInput, setAmountInput] = useState("");
  const [details, setDetails] = useState<Details>({ name: "", email: "", phone: "" });
  const [done, setDone] = useState(initialSuccess);

  // Lock page scroll behind the overlay
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const amount = Number(amountInput);
  const amountValid = Number.isFinite(amount) && amount >= MIN && amount <= MAX && /^\d+(\.\d{1,2})?$/.test(amountInput);
  const detailsValid = details.name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(details.email.trim());
  const progress = (step / 3) * 100;

  const header = (
    <div className="gc-wizard-header">
      <span className="gc-wizard-title">Give</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex" }} aria-label="Close">
        <X size={20} />
      </button>
    </div>
  );

  if (done) {
    return (
      <div className="gc-wizard-overlay" role="dialog" aria-modal="true" aria-label="Give">
        {header}
        <div className="gc-wizard-success">
          <div className="gc-success-icon">
            <Check size={28} color="#fff" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 800, marginBottom: "0.75rem" }}>Thank you for giving!</h2>
          <p style={{ color: "#4a4a4a", fontSize: "1rem", lineHeight: 1.7, maxWidth: 380 }}>
            Your love offering has been received. A receipt is on its way to your email. God bless you!
          </p>
          <button onClick={onClose} className="gc-btn-dark" style={{ marginTop: "2rem" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="gc-wizard-overlay" role="dialog" aria-modal="true" aria-label="Give">
        {header}
        <div className="gc-wizard-success">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>Online giving is unavailable</h2>
          <p style={{ color: "#4a4a4a", maxWidth: 380, lineHeight: 1.7 }}>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gc-wizard-overlay" role="dialog" aria-modal="true" aria-label="Give">
      {header}
      <div className="gc-wizard-progress">
        <div className="gc-wizard-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {step === 0 && (
        <>
          <div className="gc-wizard-body">
            <p className="gc-wizard-step-num">Step 1 of 3</p>
            <h2 className="gc-wizard-question">How much would you like to give?</h2>
            <p className="gc-wizard-hint">Your love offering supports the vision and mission of BLW Grace City.</p>

            <div className="gc-give-presets" role="radiogroup" aria-label="Preset amounts">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  className={`gc-choice-btn gc-give-preset${amountInput === String(p) ? " selected" : ""}`}
                  onClick={() => setAmountInput(String(p))}
                  role="radio"
                  aria-checked={amountInput === String(p)}
                >
                  {fmt(p)}
                </button>
              ))}
            </div>

            <label className="gc-give-custom">
              <span className="gc-give-currency">$</span>
              <input
                className="gc-input"
                inputMode="decimal"
                placeholder="Other amount"
                aria-label="Other amount"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value.replace(/[^\d.]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && amountValid && setStep(1)}
                style={{ paddingLeft: "2.25rem", fontSize: "1.125rem", fontWeight: 600 }}
              />
            </label>
            {amountInput && !amountValid && (
              <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.75rem" }}>
                Please enter an amount between {fmt(MIN)} and {fmt(MAX)}.
              </p>
            )}
          </div>
          <div className="gc-wizard-footer">
            <button className="gc-wizard-back" onClick={onClose}>Cancel</button>
            <button className="gc-wizard-next" onClick={() => setStep(1)} disabled={!amountValid}>
              {amountValid ? `Continue with ${fmt(amount)}` : "Choose an amount"}
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="gc-wizard-body">
            <p className="gc-wizard-step-num">Step 2 of 3</p>
            <h2 className="gc-wizard-question">Your details</h2>
            <p className="gc-wizard-hint">We&apos;ll email your receipt here.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                className="gc-input"
                placeholder="Full name"
                autoComplete="name"
                value={details.name}
                onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                autoFocus
              />
              <input
                className="gc-input"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                value={details.email}
                onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
              />
              <input
                className="gc-input"
                type="tel"
                placeholder="Phone (optional)"
                autoComplete="tel"
                value={details.phone}
                onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && detailsValid && setStep(2)}
              />
            </div>
          </div>
          <div className="gc-wizard-footer">
            <button className="gc-wizard-back" onClick={() => setStep(0)}>Back</button>
            <button className="gc-wizard-next" onClick={() => setStep(2)} disabled={!detailsValid}>
              Continue
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: Math.round(amount * 100),
            currency: "usd",
            appearance,
            fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" }],
          }}
        >
          <PaymentStep amount={amount} details={details} onBack={() => setStep(1)} onSuccess={() => setDone(true)} />
        </Elements>
      )}
    </div>
  );
}
