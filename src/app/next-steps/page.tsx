"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type ModalType = "plan-visit" | "connect" | "prayer" | "contact" | null;

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  as?: "textarea" | "select";
  options?: string[];
  rows?: number;
}

function Field({ label, name, type = "text", required, placeholder, value, onChange, as, options, rows }: FieldProps) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4a4a4a", marginBottom: "0.5rem" }}>
        {label}{required && <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows || 4}
          className="gc-input"
          style={{ resize: "vertical" }}
        />
      ) : as === "select" ? (
        <select name={name} value={value} onChange={onChange} className="gc-input">
          <option value="">Select one</option>
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="gc-input"
        />
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        background: "#0a0a0a",
        color: "#fff",
        padding: "0.875rem",
        fontWeight: 700,
        fontSize: "0.9rem",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginTop: "0.5rem",
      }}
    >
      {loading ? "Submitting..." : label}
    </button>
  );
}

// ── Plan a Visit Form ─────────────────────────────────────────
function PlanVisitForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", visit_date: "", hear_about_us: "", attending_with: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/forms/plan-a-visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>We&apos;ll see you soon!</p>
      <p style={{ color: "#4a4a4a" }}>Thanks for letting us know. We&apos;re excited to meet you this Sunday at 10am.</p>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <Field label="Full Name" name="name" required placeholder="Your name" value={form.name} onChange={set} />
      <Field label="Email" name="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set} />
      <Field label="Phone" name="phone" type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={set} />
      <Field label="Planned Visit Date" name="visit_date" type="date" value={form.visit_date} onChange={set} />
      <Field label="How did you hear about us?" name="hear_about_us" as="select" value={form.hear_about_us} onChange={set}
        options={["Social Media", "Friend or Family", "Google Search", "Flyer / Event", "Other"]} />
      <Field label="I&apos;m attending with" name="attending_with" as="select" value={form.attending_with} onChange={set}
        options={["Just me", "My family", "A friend", "A group"]} />
      {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "0.75rem" }}>Something went wrong. Please try again.</p>}
      <SubmitBtn loading={status === "loading"} label="Let Us Know" />
    </form>
  );
}

// ── Connect Card Form ─────────────────────────────────────────
function ConnectCardForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", decision: "", groups_interest: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const payload = { ...form, groups_interest: form.groups_interest ? [form.groups_interest] : [] };
    const res = await fetch("/api/forms/connect-card", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>Welcome to the family!</p>
      <p style={{ color: "#4a4a4a" }}>Your connect card has been received. Someone from our team will be in touch.</p>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <Field label="Full Name" name="name" required placeholder="Your name" value={form.name} onChange={set} />
      <Field label="Email" name="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set} />
      <Field label="Phone" name="phone" type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={set} />
      <Field label="Address" name="address" placeholder="City, State" value={form.address} onChange={set} />
      <Field label="I made a decision today" name="decision" as="select" value={form.decision} onChange={set}
        options={["First time giving my life to Christ", "Recommitting my life to Christ", "Being baptized", "Joining the church"]} />
      <Field label="I am interested in" name="groups_interest" as="select" value={form.groups_interest} onChange={set}
        options={["Youth Ministry", "Worship Team", "Children's Ministry", "Outreach", "Cell Group", "Media & Creative"]} />
      {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "0.75rem" }}>Something went wrong. Please try again.</p>}
      <SubmitBtn loading={status === "loading"} label="Submit Connect Card" />
    </form>
  );
}

// ── Prayer Request Form ───────────────────────────────────────
function PrayerForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", request: "", is_private: "false" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/forms/prayer-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, is_private: form.is_private === "true" }),
    });
    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>We&apos;re praying with you.</p>
      <p style={{ color: "#4a4a4a" }}>Your request has been received. Our team is believing with you.</p>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <Field label="Your Name" name="name" required placeholder="Your name" value={form.name} onChange={set} />
      <Field label="Email (optional)" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={set} />
      <Field label="Prayer Request" name="request" required as="textarea" placeholder="Share your prayer need..." value={form.request} onChange={set} rows={5} />
      <Field label="Keep this private?" name="is_private" as="select" value={form.is_private} onChange={set}
        options={["false", "true"]} />
      {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "0.75rem" }}>Something went wrong. Please try again.</p>}
      <SubmitBtn loading={status === "loading"} label="Submit Prayer Request" />
    </form>
  );
}

// ── Contact Form ──────────────────────────────────────────────
function ContactForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/forms/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>Message received!</p>
      <p style={{ color: "#4a4a4a" }}>We&apos;ll get back to you as soon as possible.</p>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <Field label="Full Name" name="name" required placeholder="Your name" value={form.name} onChange={set} />
      <Field label="Email" name="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set} />
      <Field label="Phone" name="phone" type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={set} />
      <Field label="Message" name="message" required as="textarea" placeholder="How can we help?" value={form.message} onChange={set} rows={5} />
      {status === "error" && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "0.75rem" }}>Something went wrong. Please try again.</p>}
      <SubmitBtn loading={status === "loading"} label="Send Message" />
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────
const cards = [
  { id: "connect" as ModalType, title: "Connect Card", description: "Fill out a connect card to let us know who you are and how we can serve you.", cta: "Fill Out", image: "/images/2500w-164-roc09050-jpg.jpg" },
  { id: "prayer" as ModalType, title: "Get Prayer", description: "Our team is standing in agreement with you. Submit your request and we will pray.", cta: "Click Here", image: "/images/2500w-184-roc09140-jpg.jpg" },
  { id: "contact" as ModalType, title: "Contact Us", description: "Have a question or want to get in touch? We would love to hear from you.", cta: "Get In Touch", image: "/images/2500w-200-roc09255-jpg.jpg" },
  { id: null, title: "Give", description: "Support the vision and mission of BLW Grace City through your generous giving.", cta: "Give Now", href: "https://give.tithe.ly/?formId=9a00ab69-6865-11ee-90fc-1260ab546d11", image: "/images/2500w-202-roc09264-jpg.jpg" },
];

export default function NextStepsPage() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <>
      {/* Page Hero */}
      <section style={{ background: "#0a0a0a", padding: "5rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          Next Steps
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: "1.25rem" }}>
          Take Your Next Step
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          We believe that everyone has something unique to offer. Explore ministries and programs designed to help you grow in your faith.
        </p>
      </section>

      {/* Photo strip */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", height: 180, overflow: "hidden" }}>
        {["/images/2500w-31-roc08610-jpg.jpg", "/images/2500w-164-roc09050-jpg.jpg", "/images/2500w-184-roc09140-jpg.jpg", "/images/2500w-200-roc09255-jpg.jpg"].map((src, i) => (
          <div key={i} style={{ position: "relative", overflow: "hidden" }}>
            <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="25vw" />
          </div>
        ))}
      </section>

      {/* Sunday Service Invite */}
      <section style={{ padding: "4rem 1.5rem", background: "#f7f7f7", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "#0a0a0a", marginBottom: "1rem" }}>
          Join Us This Sunday
        </h2>
        <p style={{ fontSize: "1rem", color: "#4a4a4a", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.8 }}>
          Come experience the warmth of community and the power of God&apos;s presence. We meet every Sunday at 10:00 a.m. at 11755 West Little York Road, Suite 201, Houston, TX.
        </p>
        <button
          onClick={() => setModal("plan-visit")}
          style={{
            background: "#0a0a0a",
            color: "#fff",
            border: "none",
            padding: "0.875rem 2rem",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Let Us Know You&apos;re Coming
        </button>
      </section>

      {/* 4 Action Cards */}
      <section style={{ padding: "5rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "0.75rem" }}>
              Get Involved
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#0a0a0a" }}>How Can We Serve You?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {cards.map((card) => (
              <div
                key={card.title}
                style={{ border: "1px solid #e8e8e8", overflow: "hidden" }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                  <Image src={card.image} alt={card.title} fill style={{ objectFit: "cover" }} sizes="300px" />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.625rem" }}>{card.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4a4a4a", lineHeight: 1.7, marginBottom: "1.25rem" }}>{card.description}</p>
                  {card.href ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        background: "#0a0a0a",
                        color: "#fff",
                        padding: "0.625rem 1.25rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.cta}
                    </a>
                  ) : (
                    <button
                      onClick={() => card.id && setModal(card.id)}
                      style={{
                        background: "#0a0a0a",
                        color: "#fff",
                        border: "none",
                        padding: "0.625rem 1.25rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
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

      {/* Modals */}
      {modal === "plan-visit" && (
        <Modal title="Plan a Visit" onClose={() => setModal(null)}>
          <PlanVisitForm onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "connect" && (
        <Modal title="Connect Card" onClose={() => setModal(null)}>
          <ConnectCardForm onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "prayer" && (
        <Modal title="Prayer Request" onClose={() => setModal(null)}>
          <PrayerForm onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "contact" && (
        <Modal title="Contact Us" onClose={() => setModal(null)}>
          <ContactForm onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}
