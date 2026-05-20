import Image from "next/image";
import Link from "next/link";

const contentBlocks = [
  {
    title: "Plan a Visit",
    description: "We would love to meet you. Come join us any Sunday at 10am.",
    href: "/next-steps",
    image: "/images/2500w-164-roc09050-jpg.jpg",
  },
  {
    title: "Our Staff",
    description: "Meet the leaders and team who serve our community.",
    href: "/staff-leaders",
    image: "/images/2500w-184-roc09140-jpg.jpg",
  },
  {
    title: "Events Calendar",
    description: "Stay up to date with everything happening at Grace City.",
    href: "/calendar",
    image: "/images/2500w-200-roc09255-jpg.jpg",
  },
  {
    title: "Get Involved",
    description: "Discover ministries and ways to make a difference.",
    href: "/next-steps",
    image: "/images/2500w-202-roc09264-jpg.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", height: "92vh", minHeight: 520, overflow: "hidden" }}>
        <Image
          src="/images/2500w-31-roc08610-jpg.jpg"
          alt="BLW Grace City community"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "1.25rem",
            }}
          >
            BLW Grace City &middot; Houston, TX
          </p>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              maxWidth: 820,
              marginBottom: "1.5rem",
            }}
          >
            Reaching and Equipping Tomorrow&apos;s Leaders
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(255,255,255,0.85)",
              maxWidth: 560,
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            A community inspiring and equipping young people to know and express God&apos;s love.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/next-steps"
              style={{
                background: "#fff",
                color: "#0a0a0a",
                padding: "0.875rem 2rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Plan a Visit
            </Link>
            <Link
              href="/next-steps"
              style={{
                border: "2px solid rgba(255,255,255,0.8)",
                color: "#fff",
                padding: "0.875rem 2rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* Service Info Band */}
      <section style={{ background: "#0a0a0a", padding: "2rem 1.5rem" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem 4rem",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
              Service Time
            </p>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Sundays at 10:00 a.m.</p>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
              Location
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 500, color: "#fff" }}>11755 West Little York Rd, Suite 201</p>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Houston, Texas 77041</p>
          </div>
          <Link
            href="/next-steps"
            style={{
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            Let us know you&apos;re coming &rarr;
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: "5rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a9a9a", marginBottom: "1.5rem" }}>
            Our Mission
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, lineHeight: 1.25, color: "#0a0a0a", marginBottom: "1.5rem" }}>
            Raising a Generation for Jesus
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#4a4a4a", lineHeight: 1.8, maxWidth: 680, margin: "0 auto" }}>
            We exist to inspire and equip young people to know and express God&apos;s love within their communities through discipleship, mentorship, and service. As part of the Believers&apos; LoveWorld Nation, we are reaching the nations and demonstrating the character of the Spirit.
          </p>
        </div>
      </section>

      {/* 2x2 Content Blocks */}
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {contentBlocks.map((block) => (
            <Link
              key={block.title}
              href={block.href}
              style={{ position: "relative", display: "block", overflow: "hidden", aspectRatio: "4/3", textDecoration: "none" }}
            >
              <Image
                src={block.image}
                alt={block.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem" }}>
                <h3 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>{block.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{block.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Prayer CTA */}
      <section style={{ padding: "5rem 1.5rem", background: "#0a0a0a", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          Prayer Hub
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
          We&apos;re Believing With You
        </h2>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Submit a prayer request and our team will stand in agreement with you.
        </p>
        <Link
          href="/next-steps"
          style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff", padding: "0.875rem 2rem", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          Submit a Prayer Request
        </Link>
      </section>
    </>
  );
}
