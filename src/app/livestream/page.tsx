"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { Livestream } from "@/types";
import { formatDateTime } from "@/lib/utils";

type StreamStatus = "live" | "upcoming" | "none";

interface StreamResponse {
  stream: Livestream | null;
  status: StreamStatus;
  past?: Livestream[];
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    const pathMatch = u.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/);
    if (pathMatch) return pathMatch[1];
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

// ── Sign in / Sign up overlay ───────────────────────────────────
function AuthGate({ onAuthed }: { onAuthed: (s: Session) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "0.7rem 0.9rem",
    fontSize: "0.9rem",
    borderRadius: 8,
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.7)",
    marginBottom: "0.375rem",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createBrowserClient();

    if (mode === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { setError(error.message); return; }
      if (data.session) onAuthed(data.session);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName, phone } },
      });
      setLoading(false);
      if (error) { setError(error.message); return; }
      if (data.session) onAuthed(data.session);
      else setError("Check your email to confirm your account before signing in.");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(10,10,10,0.6)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(20,20,20,0.85)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "2rem 1.75rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "0.5rem" }}>
          Grace City Online
        </p>
        <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: "1.5rem" }}>
          {mode === "signin" ? "Sign In to Watch" : "Create an Account to Watch"}
        </h2>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
              </div>
            </div>
          )}
          {mode === "signup" && (
            <div style={{ marginBottom: "0.9rem" }}>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
            </div>
          )}
          <div style={{ marginBottom: "0.9rem" }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          </div>

          {error && <p style={{ color: "#fca5a5", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#fff",
              color: "#0a0a0a",
              border: "none",
              borderRadius: 8,
              padding: "0.8rem",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginTop: "1.25rem" }}>
          {mode === "signin" ? (
            <>New here? <button onClick={() => { setMode("signup"); setError(""); }} style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", padding: 0 }}>Create an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode("signin"); setError(""); }} style={{ background: "none", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", padding: 0 }}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LivestreamPage() {
  const [data, setData] = useState<StreamResponse | null>(null);
  const [ytReady, setYtReady] = useState(false);

  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/livestreams")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const stream = data?.stream;
  const videoId = stream
    ? (stream.youtube_live_id ?? extractVideoId(stream.youtube_url))
    : null;
  const signedIn = !!session;

  return (
    <>
      <div className="gc-page-hero">
        <span className="gc-page-hero-eye">Grace City Online</span>
        <h1 className="gc-page-hero-h1">Watch Live</h1>
      </div>

      {/* Player area */}
      <section style={{ background: "#111", padding: "2rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.25rem" }}>
          {/* Status badge */}
          <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {data?.status === "live" && (
              <>
                <span className="pulse-dot" style={{ width: 10, height: 10, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#dc2626", letterSpacing: "0.08em", textTransform: "uppercase" }}>Live Now</span>
              </>
            )}
            {data?.status === "upcoming" && stream && (
              <>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Upcoming &mdash; {stream.scheduled_at ? formatDateTime(stream.scheduled_at) : ""}
                </span>
              </>
            )}
            {(data?.status === "none" || !data) && (
              <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>
                {!data ? "Loading..." : "No live stream scheduled right now"}
              </span>
            )}
          </div>

          {/* YouTube embed */}
          <div style={{ position: "relative" }}>
            {videoId ? (
              <>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    background: "#000",
                    filter: signedIn ? "none" : "blur(6px)",
                    transform: signedIn ? "none" : "scale(1.03)",
                    transition: "filter 0.3s ease",
                  }}
                >
                  <div id="yt-player" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
                </div>
                <Script
                  src="https://www.youtube.com/iframe_api"
                  strategy="lazyOnload"
                  onReady={() => setYtReady(true)}
                />
                {ytReady && (
                  <Script id="yt-init" strategy="lazyOnload">{`
                    new YT.Player('yt-player', {
                      videoId: '${videoId}',
                      playerVars: { autoplay: 1, mute: 1, rel: 0, modestbranding: 1 }
                    });
                  `}</Script>
                )}
              </>
            ) : (
              <div style={{
                aspectRatio: "16/9",
                background: "#1a1a1a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                filter: signedIn ? "none" : "blur(6px)",
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7L8 5z" fill="rgba(255,255,255,0.5)" />
                  </svg>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>No live stream right now</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>Join us in person — Sundays at 10am</p>
              </div>
            )}

            {session === undefined ? null : !signedIn && (
              <AuthGate onAuthed={setSession} />
            )}
          </div>

          {/* Stream info */}
          {stream && (
            <div style={{ marginTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                {stream.title}
              </h2>
              {stream.description && (
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  {stream.description}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Past streams */}
      {data?.past && data.past.length > 0 && (
        <section className="gc-section gc-section-white">
          <div className="gc-container" style={{ maxWidth: 900 }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "2rem" }}>Past Streams</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: "1.25rem" }}>
              {data.past.map((s) => {
                const vid = s.youtube_live_id ?? extractVideoId(s.youtube_url);
                return (
                  <a
                    key={s.id}
                    href={s.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", border: "1px solid #e8e8e8", overflow: "hidden", display: "block" }}
                  >
                    {vid && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
                        alt={s.title}
                        style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
                      />
                    )}
                    <div style={{ padding: "1rem" }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0a0a0a", marginBottom: "0.25rem" }}>{s.title}</p>
                      <p style={{ fontSize: "0.8rem", color: "#9a9a9a" }}>{formatDateTime(s.created_at)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Join in person CTA */}
      <section className="gc-section gc-section-off" style={{ textAlign: "center" }}>
        <div className="gc-container">
          <h2 className="gc-section-h2">Better In Person</h2>
          <p className="gc-section-body" style={{ maxWidth: 500, margin: "0 auto 2rem" }}>
            Nothing replaces the experience of being together. Join us this Sunday at 10am.
          </p>
          <Link href="/next-steps" className="gc-btn-dark">Plan a Visit</Link>
        </div>
      </section>
    </>
  );
}
