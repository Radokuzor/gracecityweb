import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { label: "Plan A Visit", href: "/next-steps" },
  { label: "About Us", href: "/about-us" },
  { label: "Staff & Leaders", href: "/staff-leaders" },
  { label: "Calendar", href: "/calendar" },
  { label: "Watch Live", href: "/livestream" },
  { label: "Get Involved", href: "/next-steps" },
];

const socials = [
  { label: "X / Twitter", href: "https://x.com/blwgracecity?s=21" },
  { label: "TikTok", href: "https://www.tiktok.com/@blwgracecity" },
  { label: "Instagram", href: "https://www.instagram.com/gracecityusa" },
  { label: "YouTube", href: "https://youtube.com/@blwgracecity" },
  { label: "Kingschat", href: "https://kingschat.online/user/blwusaregion2" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* CTA band */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "1.25rem" }}>
          Meeting at 10:00 a.m. on Sundays — we&apos;d love to see you.
        </p>
        <Link
          href="/next-steps"
          style={{
            background: "#fff",
            color: "#0a0a0a",
            padding: "0.75rem 2rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Say Hello
        </Link>
      </div>

      {/* Main footer */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {/* Brand */}
        <div>
          <Image
            src="/Grace-Black.png"
            alt="BLW Grace City"
            width={120}
            height={36}
            style={{ objectFit: "contain", filter: "invert(1)", marginBottom: "1rem" }}
          />
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            11755 West Little York Road<br />
            Suite 201<br />
            Houston, Texas 77041
          </p>
          <div style={{ marginTop: "1rem" }}>
            <a
              href="mailto:info@blwgracecity.org"
              style={{ display: "block", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", textDecoration: "none", marginBottom: "0.25rem" }}
            >
              info@blwgracecity.org
            </a>
            <a
              href="tel:17139280999"
              style={{ display: "block", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
            >
              +1 713-928-0999
            </a>
          </div>
        </div>

        {/* Nav links */}
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
            Quick Links
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {footerLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social + contact */}
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
            Connect With Us
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "1.25rem 1.5rem",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        &copy; {new Date().getFullYear()} BLW Grace City. All rights reserved.
      </div>
    </footer>
  );
}
