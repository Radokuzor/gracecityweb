import type { Metadata } from "next";
import Image from "next/image";
import { staff } from "@/data/staff";

export const metadata: Metadata = { title: "Staff & Leaders" };

export default function StaffPage() {
  return (
    <>
      <section style={{ background: "#0a0a0a", padding: "5rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          Our Team
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>
          Staff &amp; Leaders
        </h1>
      </section>

      <section style={{ padding: "5rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
            {staff.map((member) => (
              <div key={member.id} style={{ border: "1px solid #e8e8e8" }}>
                {/* Photo */}
                <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f7f7f7" }}>
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "2rem", color: "#9a9a9a" }}>{member.name[0]}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.25rem" }}>{member.name}</h3>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "0.875rem" }}>
                    {member.title}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#4a4a4a", lineHeight: 1.7 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          {staff.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#9a9a9a" }}>
              <p>Staff profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
