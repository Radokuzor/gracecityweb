"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Plan a Visit", href: "/next-steps" },
  { label: "Get Involved", href: "/next-steps" },
  { label: "About Us", href: "/about-us" },
  { label: "Staff & Leaders", href: "/staff-leaders" },
  { label: "Calendar", href: "/calendar" },
  { label: "Watch Live", href: "/livestream" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/Grace-Black.png"
            alt="BLW Grace City"
            width={140}
            height={40}
            style={{ objectFit: "contain", height: 36, width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav
          style={{ display: "flex", gap: "2rem", alignItems: "center" }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#0a0a0a",
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/next-steps"
            style={{
              background: "#0a0a0a",
              color: "#fff",
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Say Hello
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #e8e8e8",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "#0a0a0a",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/next-steps"
            onClick={() => setOpen(false)}
            style={{
              background: "#0a0a0a",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Say Hello
          </Link>
        </div>
      )}
    </header>
  );
}
