"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Plan a Visit", href: "/next-steps" },
  { label: "About Us", href: "/about-us" },
  { label: "Staff & Leaders", href: "/staff-leaders" },
  { label: "Calendar", href: "/calendar" },
  { label: "Watch Live", href: "/livestream" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" onClick={close} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image
              src="/Grace-Black.png"
              alt="BLW Grace City"
              width={130}
              height={38}
              style={{ objectFit: "contain", height: 34, width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ gap: "1.75rem", alignItems: "center" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                style={{ fontSize: "0.85rem", fontWeight: 500, color: "#0a0a0a", textDecoration: "none", letterSpacing: "0.01em", whiteSpace: "nowrap" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/next-steps"
              className="gc-btn-dark"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", minHeight: 40 }}
            >
              Say Hello
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}
          >
            {open ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu overlay */}
      {open && (
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            top: 64,
            background: "#fff",
            zIndex: 39,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Nav links */}
          <nav style={{ flex: 1 }}>
            {navLinks.map((link, i) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={close}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.125rem 1.5rem",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#0a0a0a",
                  textDecoration: "none",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {link.label}
                <span style={{ color: "#9a9a9a", fontSize: "1.25rem" }}>&rsaquo;</span>
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div style={{ padding: "1.5rem", borderTop: "1px solid #e8e8e8" }}>
            <Link
              href="/next-steps"
              onClick={close}
              style={{
                display: "block",
                background: "#0a0a0a",
                color: "#fff",
                padding: "1rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: "8px",
              }}
            >
              Say Hello
            </Link>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.25rem" }}>
              <a href="tel:17139280999" style={{ fontSize: "0.85rem", color: "#9a9a9a", textDecoration: "none" }}>+1 713-928-0999</a>
              <span style={{ color: "#e8e8e8" }}>&middot;</span>
              <a href="mailto:info@blwgracecity.org" style={{ fontSize: "0.85rem", color: "#9a9a9a", textDecoration: "none" }}>Email Us</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
