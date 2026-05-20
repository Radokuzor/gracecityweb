"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check } from "lucide-react";

// ── Wizard Engine ─────────────────────────────────────────────
interface Step {
  question: string;
  hint?: string;
  field: string;
  type: "text" | "email" | "tel" | "date" | "textarea" | "choice";
  placeholder?: string;
  required?: boolean;
  choices?: string[];
}

interface WizardProps {
  title: string;
  steps: Step[];
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  successTitle: string;
  successMsg: string;
}

function Wizard({ title, steps, onClose, onSubmit, successTitle, successMsg }: WizardProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const step = steps[current];
  const value = answers[step.field] ?? "";
  const progress = ((current) / steps.length) * 100;
  const isLast = current === steps.length - 1;
  const canNext = !step.required || value.trim().length > 0;

  const set = (val: string) => setAnswers((a) => ({ ...a, [step.field]: val }));

  const next = async () => {
    if (!canNext) return;
    if (isLast) {
      setStatus("submitting");
      try {
        await onSubmit(answers);
        setStatus("success");
      } catch {
        setStatus("error");
      }
      return;
    }
    setCurrent((c) => c + 1);
  };

  const back = () => {
    if (current === 0) { onClose(); return; }
    setCurrent((c) => c - 1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step.type !== "textarea") next();
  };

  if (status === "success") {
    return (
      <div className="gc-wizard-overlay">
        <div className="gc-wizard-header">
          <span className="gc-wizard-title">{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex" }} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="gc-wizard-success">
          <div className="gc-success-icon">
            <Check size={28} color="#fff" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 800, marginBottom: "0.75rem" }}>{successTitle}</h2>
          <p style={{ color: "#4a4a4a", fontSize: "1rem", lineHeight: 1.7, maxWidth: 380 }}>{successMsg}</p>
          <button
            onClick={onClose}
            className="gc-btn-dark"
            style={{ marginTop: "2rem" }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gc-wizard-overlay" role="dialog" aria-modal="true" aria-label={title}>
      {/* Header */}
      <div className="gc-wizard-header">
        <span className="gc-wizard-title">{title}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex" }} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="gc-wizard-progress">
        <div className="gc-wizard-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Body */}
      <div className="gc-wizard-body">
        <p className="gc-wizard-step-num">Step {current + 1} of {steps.length}</p>
        <h2 className="gc-wizard-question">{step.question}</h2>
        {step.hint && <p className="gc-wizard-hint">{step.hint}</p>}

        {step.type === "choice" ? (
          <div className="gc-choice-list" role="radiogroup">
            {step.choices?.map((choice) => (
              <button
                key={choice}
                className={`gc-choice-btn${value === choice ? " selected" : ""}`}
                onClick={() => { set(choice); }}
                role="radio"
                aria-checked={value === choice}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : step.type === "textarea" ? (
          <textarea
            className="gc-input"
            placeholder={step.placeholder}
            value={value}
            onChange={(e) => set(e.target.value)}
            rows={5}
            autoFocus
            style={{ fontSize: "1rem" }}
          />
        ) : (
          <input
            className="gc-input"
            type={step.type}
            placeholder={step.placeholder}
            value={value}
            onChange={(e) => set(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            style={{ fontSize: "1rem" }}
          />
        )}

        {status === "error" && (
          <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "1rem" }}>
            Something went wrong — please try again.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="gc-wizard-footer">
        <button className="gc-wizard-back" onClick={back}>
          {current === 0 ? "Cancel" : "Back"}
        </button>
        <button
          className="gc-wizard-next"
          onClick={next}
          disabled={!canNext || status === "submitting"}
        >
          {status === "submitting"
            ? "Submitting..."
            : isLast
            ? "Submit"
            : step.type === "choice" && !value
            ? "Select an option"
            : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ── Plan a Visit ──────────────────────────────────────────────
const planVisitSteps: Step[] = [
  { question: "What is your name?", field: "name", type: "text", placeholder: "Your full name", required: true },
  { question: "What is your email?", hint: "We'll send you helpful info before your visit.", field: "email", type: "email", placeholder: "you@email.com", required: true },
  { question: "What is your phone number?", hint: "Optional — only if you'd like a call.", field: "phone", type: "tel", placeholder: "+1 (000) 000-0000" },
  { question: "When are you planning to visit?", field: "visit_date", type: "date" },
  { question: "How did you hear about us?", field: "hear_about_us", type: "choice", choices: ["Social Media", "Friend or Family", "Google Search", "Flyer / Event", "I attended before", "Other"] },
  { question: "Who are you coming with?", field: "attending_with", type: "choice", choices: ["Just me", "My partner", "My family", "A friend", "A small group"] },
];

// ── Connect Card ──────────────────────────────────────────────
const connectSteps: Step[] = [
  { question: "What is your name?", field: "name", type: "text", placeholder: "Your full name", required: true },
  { question: "What is your email?", field: "email", type: "email", placeholder: "you@email.com", required: true },
  { question: "What is your phone number?", field: "phone", type: "tel", placeholder: "+1 (000) 000-0000" },
  { question: "Where are you from?", hint: "City and state is fine.", field: "address", type: "text", placeholder: "Houston, TX" },
  { question: "I made a decision today...", field: "decision", type: "choice", choices: ["First time giving my life to Christ", "Recommitting my life to Christ", "I want to be baptized", "Joining the church family", "Just visiting"] },
  { question: "What area are you interested in?", field: "groups_interest", type: "choice", choices: ["Youth Ministry", "Worship Team", "Children's Ministry", "Community Outreach", "Cell Group", "Media & Creative"] },
];

// ── Prayer Request ────────────────────────────────────────────
const prayerSteps: Step[] = [
  { question: "What is your name?", field: "name", type: "text", placeholder: "Your name", required: true },
  { question: "What is your email?", hint: "Optional — we'll follow up if you'd like.", field: "email", type: "email", placeholder: "you@email.com" },
  { question: "Share your prayer request.", hint: "Our team reads every request and prays with you.", field: "request", type: "textarea", placeholder: "Write your prayer request here...", required: true },
  { question: "Keep this private?", hint: "Private requests are only seen by our prayer team.", field: "is_private", type: "choice", choices: ["Yes, keep it private", "No, it can be shared"] },
];

// ── Contact ───────────────────────────────────────────────────
const contactSteps: Step[] = [
  { question: "What is your name?", field: "name", type: "text", placeholder: "Your full name", required: true },
  { question: "What is your email?", field: "email", type: "email", placeholder: "you@email.com", required: true },
  { question: "What is your phone number?", hint: "Optional.", field: "phone", type: "tel", placeholder: "+1 (000) 000-0000" },
  { question: "How can we help you?", field: "message", type: "textarea", placeholder: "Write your message here...", required: true },
];

// ── Submit helpers ────────────────────────────────────────────
async function post(path: string, data: Record<string, string>) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Submit failed");
}

// ── Action Cards ──────────────────────────────────────────────
type FormKey = "plan-visit" | "connect" | "prayer" | "contact";

const cards = [
  { id: "connect" as FormKey, title: "Connect Card", description: "Fill out a connect card to let us know who you are and how we can serve you.", cta: "Fill Out", image: "/images/2500w-164-roc09050-jpg.jpg" },
  { id: "prayer" as FormKey, title: "Get Prayer", description: "Our team is standing in agreement with you. Submit your prayer request here.", cta: "Request Prayer", image: "/images/2500w-184-roc09140-jpg.jpg" },
  { id: "contact" as FormKey, title: "Contact Us", description: "Have a question or want to get in touch? We would love to hear from you.", cta: "Get In Touch", image: "/images/2500w-200-roc09255-jpg.jpg" },
  { id: null, title: "Give", description: "Support the vision and mission of BLW Grace City through your generous giving.", cta: "Give Now", href: "https://give.tithe.ly/?formId=9a00ab69-6865-11ee-90fc-1260ab546d11", image: "/images/2500w-202-roc09264-jpg.jpg" },
];

// ── Page ──────────────────────────────────────────────────────
export default function NextStepsPage() {
  const [activeForm, setActiveForm] = useState<FormKey | null>(null);

  const closeForm = () => setActiveForm(null);

  return (
    <>
      {/* ── Page Hero ── */}
      <div className="gc-page-hero">
        <span className="gc-page-hero-eye">Next Steps</span>
        <h1 className="gc-page-hero-h1">Take Your Next Step</h1>
        <p className="gc-page-hero-sub">
          We believe everyone has something unique to offer. Explore how you can grow, connect, and make a difference.
        </p>
      </div>

      {/* ── Photo strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", height: "clamp(100px, 20vw, 200px)", overflow: "hidden" }}>
        {["/images/2500w-31-roc08610-jpg.jpg", "/images/2500w-164-roc09050-jpg.jpg", "/images/2500w-184-roc09140-jpg.jpg", "/images/2500w-200-roc09255-jpg.jpg"].map((src, i) => (
          <div key={i} style={{ position: "relative", overflow: "hidden" }}>
            <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="25vw" />
          </div>
        ))}
      </div>

      {/* ── Sunday Service Invite ── */}
      <section className="gc-section gc-section-off" style={{ textAlign: "center" }}>
        <div className="gc-container">
          <span className="gc-eyebrow">Join Us</span>
          <h2 className="gc-section-h2">Come This Sunday</h2>
          <p className="gc-section-body" style={{ maxWidth: 600, margin: "0 auto 2rem" }}>
            Come experience the warmth of community and the power of God&apos;s presence.
            We meet every Sunday at 10:00 a.m. at 11755 West Little York Road, Suite 201, Houston, TX.
            Transportation assistance is available — just let us know.
          </p>
          <button
            onClick={() => setActiveForm("plan-visit")}
            className="gc-btn-dark"
          >
            Let Us Know You&apos;re Coming
          </button>
        </div>
      </section>

      {/* ── 4 Action Cards ── */}
      <section className="gc-section gc-section-white">
        <div className="gc-container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="gc-eyebrow">Get Involved</span>
            <h2 className="gc-section-h2">How Can We Serve You?</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "1.25rem",
          }}>
            {cards.map((card) => (
              <div key={card.title} style={{ border: "1px solid #e8e8e8", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", flexShrink: 0 }}>
                  <Image src={card.image} alt={card.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 100vw, 300px" />
                </div>
                <div style={{ padding: "1.375rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.625rem" }}>{card.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "1.25rem", flex: 1 }}>{card.description}</p>
                  {card.href ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gc-btn-dark"
                      style={{ alignSelf: "flex-start" }}
                    >
                      {card.cta}
                    </a>
                  ) : (
                    <button
                      onClick={() => card.id && setActiveForm(card.id)}
                      className="gc-btn-dark"
                      style={{ alignSelf: "flex-start" }}
                    >
                      {card.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wizards ── */}
      {activeForm === "plan-visit" && (
        <Wizard
          title="Plan a Visit"
          steps={planVisitSteps}
          onClose={closeForm}
          onSubmit={(data) => post("/api/forms/plan-a-visit", data)}
          successTitle="We'll see you soon!"
          successMsg="Thanks for letting us know you're coming. We can't wait to meet you this Sunday at 10am."
        />
      )}
      {activeForm === "connect" && (
        <Wizard
          title="Connect Card"
          steps={connectSteps}
          onClose={closeForm}
          onSubmit={(data) => post("/api/forms/connect-card", { ...data, groups_interest: data.groups_interest ? JSON.stringify([data.groups_interest]) : "[]" })}
          successTitle="Welcome to the family!"
          successMsg="Your connect card has been received. A member of our team will be in touch with you soon."
        />
      )}
      {activeForm === "prayer" && (
        <Wizard
          title="Prayer Request"
          steps={prayerSteps}
          onClose={closeForm}
          onSubmit={(data) => post("/api/forms/prayer-request", { ...data, is_private: data.is_private?.startsWith("Yes") ? "true" : "false" })}
          successTitle="We're praying with you."
          successMsg="Your prayer request has been received. Our team is believing with you in faith."
        />
      )}
      {activeForm === "contact" && (
        <Wizard
          title="Contact Us"
          steps={contactSteps}
          onClose={closeForm}
          onSubmit={(data) => post("/api/forms/contact", data)}
          successTitle="Message received!"
          successMsg="Thank you for reaching out. We'll get back to you as soon as possible."
        />
      )}
    </>
  );
}
