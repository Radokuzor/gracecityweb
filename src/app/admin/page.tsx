"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createBrowserClient } from "@/lib/supabase";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import type { FormSubmission, Livestream, Event } from "@/types";
import { formatDateTime } from "@/lib/utils";

// Lazy singleton — only created after first user interaction, never at module evaluation time
let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!_client) _client = createBrowserClient();
  return _client;
}
// Named alias used throughout this file
const supabase = { get auth() { return getClient().auth; }, from: (t: string) => getClient().from(t) } as unknown as SupabaseClient;

// ── Auth ──────────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.session) onLogin(data.session);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f7" }}>
      <div style={{ background: "#fff", padding: "2.5rem", width: "100%", maxWidth: 420, border: "1px solid #e8e8e8" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Image src="/Grace-Black.png" alt="Grace City" width={120} height={36} style={{ objectFit: "contain" }} />
          <p style={{ fontSize: "0.8rem", color: "#9a9a9a", marginTop: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin Portal</p>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#4a4a4a", marginBottom: "0.5rem" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="gc-input"
              placeholder="admin@blwgracecity.org"
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#4a4a4a", marginBottom: "0.5rem" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="gc-input"
            />
          </div>
          {error && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#0a0a0a", color: "#fff", padding: "0.875rem", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Shared table styles ───────────────────────────────────────
const th: React.CSSProperties = { textAlign: "left", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a9a9a", padding: "0.75rem 1rem", background: "#f7f7f7", borderBottom: "1px solid #e8e8e8" };
const td: React.CSSProperties = { padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#0a0a0a", borderBottom: "1px solid #f0f0f0", verticalAlign: "top" };

// ── Submissions tab ───────────────────────────────────────────
type SubmissionTab = "plan_a_visit" | "connect_cards" | "prayer_requests" | "contact_submissions";

const submissionTabs: { key: SubmissionTab; label: string }[] = [
  { key: "plan_a_visit", label: "Plan a Visit" },
  { key: "connect_cards", label: "Connect Cards" },
  { key: "prayer_requests", label: "Prayer Requests" },
  { key: "contact_submissions", label: "Contact" },
];

function SubmissionsPanel() {
  const [activeTab, setActiveTab] = useState<SubmissionTab>("plan_a_visit");
  const [rows, setRows] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from(activeTab)
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as FormSubmission[]) ?? []);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const markRead = async (id: string) => {
    await supabase.from(activeTab).update({ is_read: true }).eq("id", id);
    setRows((r) => r.map((row) => row.id === id ? { ...row, is_read: true } : row));
  };

  const unread = rows.filter((r) => !r.is_read).length;

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e8e8e8", marginBottom: "1.5rem", overflowX: "auto" }}>
        {submissionTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              background: "none",
              border: "none",
              borderBottom: activeTab === t.key ? "2px solid #0a0a0a" : "2px solid transparent",
              color: activeTab === t.key ? "#0a0a0a" : "#9a9a9a",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#9a9a9a", textAlign: "center", padding: "2rem" }}>Loading...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: "#9a9a9a", textAlign: "center", padding: "3rem" }}>No submissions yet.</p>
      ) : (
        <>
          {unread > 0 && (
            <p style={{ fontSize: "0.8rem", color: "#4a4a4a", marginBottom: "1rem" }}>
              <strong>{unread}</strong> unread submission{unread !== 1 ? "s" : ""}
            </p>
          )}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e8e8e8" }}>
              <thead>
                <tr>
                  <th style={th}>Status</th>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Details</th>
                  <th style={th}>Date</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ background: row.is_read ? "#fff" : "#fffbeb" }}>
                    <td style={td}>
                      <span style={{
                        display: "inline-block",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        background: row.is_read ? "#f0f0f0" : "#0a0a0a",
                        color: row.is_read ? "#9a9a9a" : "#fff",
                      }}>
                        {row.is_read ? "Read" : "New"}
                      </span>
                    </td>
                    <td style={td}><strong>{row.name}</strong></td>
                    <td style={td}>{row.email}</td>
                    <td style={{ ...td, maxWidth: 280, wordBreak: "break-word" }}>
                      {/* Show relevant fields per table */}
                      {activeTab === "plan_a_visit" && (
                        <span style={{ color: "#4a4a4a" }}>
                          {row.visit_date ? `Visit: ${row.visit_date}` : ""}
                          {row.hear_about_us ? ` · ${row.hear_about_us}` : ""}
                          {row.phone ? ` · ${row.phone}` : ""}
                        </span>
                      )}
                      {activeTab === "connect_cards" && (
                        <span style={{ color: "#4a4a4a" }}>
                          {row.decision ? `Decision: ${row.decision}` : ""}
                          {row.groups_interest ? ` · Interests: ${Array.isArray(row.groups_interest) ? row.groups_interest.join(", ") : row.groups_interest}` : ""}
                        </span>
                      )}
                      {activeTab === "prayer_requests" && (
                        <span style={{ color: "#4a4a4a" }}>
                          {row.is_private ? "[Private] " : ""}{String(row.request ?? "").slice(0, 120)}{String(row.request ?? "").length > 120 ? "..." : ""}
                        </span>
                      )}
                      {activeTab === "contact_submissions" && (
                        <span style={{ color: "#4a4a4a" }}>
                          {String(row.message ?? "").slice(0, 120)}{String(row.message ?? "").length > 120 ? "..." : ""}
                          {row.phone ? ` · ${row.phone}` : ""}
                        </span>
                      )}
                    </td>
                    <td style={{ ...td, whiteSpace: "nowrap", color: "#9a9a9a" }}>
                      {formatDateTime(String(row.created_at))}
                    </td>
                    <td style={td}>
                      {!row.is_read && (
                        <button
                          onClick={() => markRead(row.id)}
                          style={{ background: "none", border: "1px solid #e8e8e8", padding: "0.375rem 0.75rem", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600, color: "#4a4a4a" }}
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── Livestreams tab ───────────────────────────────────────────
function LivestreamsPanel() {
  const [streams, setStreams] = useState<Livestream[]>([]);
  const [form, setForm] = useState({ title: "", youtube_url: "", youtube_live_id: "", description: "", scheduled_at: "", is_live: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchStreams = useCallback(async () => {
    const { data } = await supabase.from("livestreams").select("*").order("created_at", { ascending: false });
    setStreams((data as Livestream[]) ?? []);
  }, []);

  useEffect(() => { fetchStreams(); }, [fetchStreams]);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const addStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const { error } = await supabase.from("livestreams").insert({
      title: form.title,
      youtube_url: form.youtube_url,
      youtube_live_id: form.youtube_live_id || null,
      description: form.description || null,
      scheduled_at: form.scheduled_at || null,
      is_live: form.is_live,
    });
    if (error) { setMsg("Error: " + error.message); }
    else {
      setMsg("Stream added!");
      setForm({ title: "", youtube_url: "", youtube_live_id: "", description: "", scheduled_at: "", is_live: false });
      fetchStreams();
    }
    setSaving(false);
  };

  const toggleLive = async (id: string, current: boolean) => {
    await supabase.from("livestreams").update({ is_live: !current }).eq("id", id);
    setStreams((s) => s.map((st) => st.id === id ? { ...st, is_live: !current } : st));
  };

  const deleteStream = async (id: string) => {
    if (!confirm("Delete this stream?")) return;
    await supabase.from("livestreams").delete().eq("id", id);
    setStreams((s) => s.filter((st) => st.id !== id));
  };

  const inputStyle: React.CSSProperties = { width: "100%", border: "1px solid #e8e8e8", padding: "0.625rem 0.875rem", fontSize: "0.875rem", outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a4a4a", marginBottom: "0.375rem" };

  return (
    <div>
      {/* Add stream form */}
      <div style={{ background: "#f7f7f7", padding: "1.5rem", marginBottom: "2rem", border: "1px solid #e8e8e8" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Add Livestream</h3>
        <form onSubmit={addStream}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={set} required style={inputStyle} placeholder="Sunday Service — May 25" />
            </div>
            <div>
              <label style={labelStyle}>YouTube URL *</label>
              <input name="youtube_url" value={form.youtube_url} onChange={set} required style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <label style={labelStyle}>YouTube Video ID (optional)</label>
              <input name="youtube_live_id" value={form.youtube_live_id} onChange={set} style={inputStyle} placeholder="dQw4w9WgXcQ" />
            </div>
            <div>
              <label style={labelStyle}>Scheduled Date & Time</label>
              <input name="scheduled_at" type="datetime-local" value={form.scheduled_at} onChange={set} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={set} style={{ ...inputStyle, resize: "vertical" }} rows={2} placeholder="Brief description of this stream..." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <input type="checkbox" id="is_live" name="is_live" checked={form.is_live} onChange={set} style={{ width: 16, height: 16 }} />
            <label htmlFor="is_live" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0a0a0a", cursor: "pointer" }}>
              Mark as Live Now (shows on the Watch Live page immediately)
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button type="submit" disabled={saving} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "0.625rem 1.5rem", fontWeight: 700, fontSize: "0.875rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Add Stream"}
            </button>
            {msg && <span style={{ fontSize: "0.875rem", color: msg.startsWith("Error") ? "#dc2626" : "#16a34a" }}>{msg}</span>}
          </div>
        </form>
      </div>

      {/* Streams list */}
      {streams.length === 0 ? (
        <p style={{ color: "#9a9a9a", textAlign: "center", padding: "2rem" }}>No streams added yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#e8e8e8" }}>
          {streams.map((s) => (
            <div key={s.id} style={{ background: "#fff", padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
                  {s.is_live && (
                    <span style={{ background: "#dc2626", color: "#fff", padding: "0.15rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE</span>
                  )}
                  <strong style={{ fontSize: "0.95rem" }}>{s.title}</strong>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#9a9a9a" }}>
                  {s.youtube_url}
                  {s.scheduled_at ? ` · Scheduled: ${formatDateTime(s.scheduled_at)}` : ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.625rem", flexShrink: 0 }}>
                <button
                  onClick={() => toggleLive(s.id, s.is_live)}
                  style={{ background: s.is_live ? "#fee2e2" : "#dcfce7", color: s.is_live ? "#dc2626" : "#16a34a", border: "none", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  {s.is_live ? "End Live" : "Go Live"}
                </button>
                <button
                  onClick={() => deleteStream(s.id)}
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Events tab ────────────────────────────────────────────────
function EventsPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({ title: "", description: "", start_time: "", end_time: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase.from("events").select("*").order("start_time", { ascending: true });
    setEvents((data as Event[]) ?? []);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const { error } = await supabase.from("events").insert({
      title: form.title,
      description: form.description || null,
      start_time: form.start_time,
      end_time: form.end_time || null,
      location: form.location || null,
    });
    if (error) { setMsg("Error: " + error.message); }
    else {
      setMsg("Event added!");
      setForm({ title: "", description: "", start_time: "", end_time: "", location: "" });
      fetchEvents();
    }
    setSaving(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    setEvents((ev) => ev.filter((e) => e.id !== id));
  };

  const inputStyle: React.CSSProperties = { width: "100%", border: "1px solid #e8e8e8", padding: "0.625rem 0.875rem", fontSize: "0.875rem", outline: "none" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a4a4a", marginBottom: "0.375rem" };

  return (
    <div>
      <div style={{ background: "#f7f7f7", padding: "1.5rem", marginBottom: "2rem", border: "1px solid #e8e8e8" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Add Event</h3>
        <form onSubmit={addEvent}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={set} required style={inputStyle} placeholder="Youth Night" />
            </div>
            <div>
              <label style={labelStyle}>Start Date & Time *</label>
              <input name="start_time" type="datetime-local" value={form.start_time} onChange={set} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>End Date & Time</label>
              <input name="end_time" type="datetime-local" value={form.end_time} onChange={set} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input name="location" value={form.location} onChange={set} style={inputStyle} placeholder="11755 West Little York Rd" />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={set} style={{ ...inputStyle, resize: "vertical" }} rows={2} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button type="submit" disabled={saving} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "0.625rem 1.5rem", fontWeight: 700, fontSize: "0.875rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Add Event"}
            </button>
            {msg && <span style={{ fontSize: "0.875rem", color: msg.startsWith("Error") ? "#dc2626" : "#16a34a" }}>{msg}</span>}
          </div>
        </form>
      </div>

      {events.length === 0 ? (
        <p style={{ color: "#9a9a9a", textAlign: "center", padding: "2rem" }}>No events yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#e8e8e8" }}>
          {events.map((ev) => (
            <div key={ev.id} style={{ background: "#fff", padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: "0.95rem" }}>{ev.title}</strong>
                <p style={{ fontSize: "0.8rem", color: "#9a9a9a", marginTop: "0.25rem" }}>
                  {formatDateTime(ev.start_time)}
                  {ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>
              <button
                onClick={() => deleteEvent(ev.id)}
                style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
type DashTab = "submissions" | "livestreams" | "events";

function Dashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [tab, setTab] = useState<DashTab>("submissions");

  const tabBtn = (t: DashTab, label: string) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      style={{
        padding: "0.75rem 1.5rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        background: tab === t ? "#0a0a0a" : "transparent",
        color: tab === t ? "#fff" : "#4a4a4a",
        border: "none",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
      {/* Top bar */}
      <div style={{ background: "#0a0a0a", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Image src="/Grace-Black.png" alt="Grace City" width={100} height={28} style={{ objectFit: "contain", filter: "invert(1)" }} />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "30vw" }}>{session.user.email}</span>
          <button
            onClick={onLogout}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "0.375rem 0.875rem", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", display: "flex", gap: 0, overflowX: "auto" }}>
        {tabBtn("submissions", "Form Submissions")}
        {tabBtn("livestreams", "Livestreams")}
        {tabBtn("events", "Events")}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ background: "#fff", padding: "1.25rem", border: "1px solid #e8e8e8" }}>
          {tab === "submissions" && <SubmissionsPanel />}
          {tab === "livestreams" && <LivestreamsPanel />}
          {tab === "events" && <EventsPanel />}
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (session === undefined) return null;
  if (!session) return <LoginForm onLogin={setSession} />;
  return <Dashboard session={session} onLogout={logout} />;
}
