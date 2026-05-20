import type { Metadata } from "next";
import { beliefs } from "@/data/beliefs";
import { values } from "@/data/values";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section style={{ background: "#0a0a0a", padding: "5rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          Who We Are
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>
          About BLW Grace City
        </h1>
      </section>

      {/* Vision & Mission */}
      <section style={{ padding: "5rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "1rem" }}>
              Our Vision
            </p>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "1.25rem", lineHeight: 1.3 }}>
              A City Set Upon a Hill
            </h2>
            <p style={{ fontSize: "1rem", color: "#4a4a4a", lineHeight: 1.8 }}>
              To take God&apos;s divine presence to the nations and peoples of the world and to demonstrate the character of the Spirit. We are a divine vision, a movement of the Spirit, and a city set upon a hill.
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "1rem" }}>
              Our Mission
            </p>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "1.25rem", lineHeight: 1.3 }}>
              Developing Generations
            </h2>
            <p style={{ fontSize: "1rem", color: "#4a4a4a", lineHeight: 1.8 }}>
              To develop generations of men and women who will fulfill God&apos;s purposes — raising a generation for Jesus across 23 US states and beyond, through discipleship, mentorship, and mission.
            </p>
          </div>
        </div>
      </section>

      {/* Reach stat */}
      <section style={{ background: "#f7f7f7", padding: "3rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800, color: "#0a0a0a", lineHeight: 1 }}>23</p>
        <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "#4a4a4a", marginTop: "0.5rem" }}>US States Reached</p>
        <p style={{ fontSize: "0.95rem", color: "#9a9a9a", marginTop: "0.5rem" }}>
          From Washington to Florida — one Spirit, one mission.
        </p>
      </section>

      {/* Core Beliefs */}
      <section style={{ padding: "5rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "0.75rem" }}>
              What We Believe
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#0a0a0a" }}>
              Our Core Beliefs
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {beliefs.map((belief, i) => (
              <div
                key={belief.number}
                style={{
                  padding: "1.75rem 0",
                  borderBottom: i < beliefs.length - 1 ? "1px solid #e8e8e8" : "none",
                  display: "grid",
                  gridTemplateColumns: "2.5rem 1fr",
                  gap: "1.25rem",
                  alignItems: "start",
                }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#0a0a0a", paddingTop: "0.125rem" }}>
                  {String(belief.number).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ fontSize: "1rem", color: "#0a0a0a", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                    {belief.text}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#9a9a9a", fontStyle: "italic", lineHeight: 1.6 }}>
                    &ldquo;{belief.scripture}&rdquo;{" "}
                    <span style={{ fontStyle: "normal", fontWeight: 600, color: "#4a4a4a" }}>— {belief.reference}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ padding: "5rem 1.5rem", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>
              How We Live
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#fff" }}>
              Our Values
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {values.map((value) => (
              <div
                key={value.name}
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "1.75rem",
                }}
              >
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fff", marginBottom: "0.625rem" }}>
                  {value.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
