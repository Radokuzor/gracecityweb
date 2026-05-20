import type { Metadata } from "next";
import Image from "next/image";
import { staff } from "@/data/staff";

export const metadata: Metadata = { title: "Staff & Leaders" };

export default function StaffPage() {
  return (
    <>
      <div className="gc-page-hero">
        <span className="gc-page-hero-eye">Our Team</span>
        <h1 className="gc-page-hero-h1">Staff &amp; Leaders</h1>
      </div>

      <section className="gc-section gc-section-white">
        <div className="gc-container">
          {staff.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#9a9a9a" }}>
              <p>Staff profiles coming soon.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
              gap: "1.5rem",
            }}>
              {staff.map((member) => (
                <div key={member.id} style={{ border: "1px solid #e8e8e8", overflow: "hidden" }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#f7f7f7" }}>
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 100vw, 300px" />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "2rem", color: "#9a9a9a" }}>{member.name[0]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.375rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.25rem" }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "0.875rem" }}>
                      {member.title}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#4a4a4a", lineHeight: 1.7 }}>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
