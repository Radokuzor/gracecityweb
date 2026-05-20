import type { Metadata } from "next";
import { beliefs } from "@/data/beliefs";
import { values } from "@/data/values";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <div className="gc-page-hero">
        <span className="gc-page-hero-eye">Who We Are</span>
        <h1 className="gc-page-hero-h1">About BLW Grace City</h1>
      </div>

      {/* Vision & Mission */}
      <section className="gc-section gc-section-white">
        <div className="gc-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
            <div>
              <span className="gc-eyebrow">Our Vision</span>
              <h2 className="gc-section-h2" style={{ marginBottom: "1rem" }}>A City Set Upon a Hill</h2>
              <p className="gc-section-body" style={{ margin: 0 }}>
                To take God&apos;s divine presence to the nations and peoples of the world and to demonstrate
                the character of the Spirit. We are a divine vision, a movement of the Spirit, and a city set upon a hill.
              </p>
            </div>
            <div>
              <span className="gc-eyebrow">Our Mission</span>
              <h2 className="gc-section-h2" style={{ marginBottom: "1rem" }}>Developing Generations</h2>
              <p className="gc-section-body" style={{ margin: 0 }}>
                To develop generations of men and women who will fulfill God&apos;s purposes — raising a generation for Jesus
                across 23 US states and beyond, through discipleship, mentorship, and mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reach stat */}
      <section className="gc-section gc-section-off" style={{ textAlign: "center" }}>
        <div className="gc-container">
          <p style={{ fontSize: "clamp(4rem, 12vw, 7rem)", fontWeight: 800, color: "#0a0a0a", lineHeight: 1, margin: 0 }}>23</p>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "#4a4a4a", marginTop: "0.5rem" }}>US States Reached</p>
          <p style={{ fontSize: "0.95rem", color: "#9a9a9a", marginTop: "0.5rem" }}>From Washington to Florida — one Spirit, one mission.</p>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="gc-section gc-section-white">
        <div className="gc-container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="gc-eyebrow">What We Believe</span>
            <h2 className="gc-section-h2">Our Core Beliefs</h2>
          </div>
          <div>
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
      <section className="gc-section gc-section-dark">
        <div className="gc-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="gc-eyebrow gc-eyebrow-dim">How We Live</span>
            <h2 className="gc-section-h2 gc-white">Our Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            {values.map((value) => (
              <div
                key={value.name}
                style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "1.75rem" }}
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
