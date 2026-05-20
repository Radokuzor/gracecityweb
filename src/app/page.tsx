import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="gc-hero">
        <Image
          src="/images/2500w-31-roc08610-jpg.jpg"
          alt="BLW Grace City community"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        <div className="gc-hero-overlay" />
        <div className="gc-hero-content">
          <h1 className="gc-hero-h1">
            Welcome to<br />BLW Grace City
          </h1>
          <p className="gc-hero-sub">
            Reaching and Equipping Tomorrow&apos;s Leaders
          </p>
          <div className="gc-hero-btns">
            <Link href="/next-steps" className="gc-btn-primary">Plan a Visit</Link>
            <Link href="/next-steps" className="gc-btn-outline-white">Get Involved</Link>
          </div>
        </div>
      </section>

      {/* ── Service Info Band ── */}
      <section className="gc-service-band">
        <div className="gc-service-band-inner">
          <div className="gc-service-item">
            <span className="gc-label">Service Time</span>
            <span className="gc-service-value">Sundays at 10:00 a.m.</span>
          </div>
          <div className="gc-service-divider" />
          <div className="gc-service-item">
            <span className="gc-label">Location</span>
            <span className="gc-service-value">11755 West Little York Rd, Suite 201</span>
            <span className="gc-service-sub">Houston, Texas 77041</span>
          </div>
          <div className="gc-service-divider" />
          <Link href="/next-steps" className="gc-btn-outline-dim">
            Plan A Visit &rarr;
          </Link>
        </div>
      </section>

      {/* ── Mission / Welcome ── */}
      <section className="gc-section gc-section-white">
        <div className="gc-container gc-text-center">
          <p className="gc-eyebrow">Welcome</p>
          <h2 className="gc-section-h2">Making a Difference in Houston</h2>
          <p className="gc-section-body" style={{ maxWidth: 680, margin: "0 auto 2.5rem" }}>
            We exist to inspire and equip young people to know and express God&apos;s love within
            their communities — through discipleship, mentorship, and service.
            As part of the Believers&apos; LoveWorld Nation, we are reaching the nations
            and demonstrating the character of the Spirit.
          </p>
          <div className="gc-btn-row">
            <Link href="/next-steps" className="gc-btn-dark">Plan a Visit</Link>
            <Link href="/next-steps" className="gc-btn-outline-dark">Get Involved</Link>
          </div>
        </div>
      </section>

      {/* ── 4 Content Blocks ── */}
      <section className="gc-blocks-grid">
        {/* Plan Your Visit */}
        <Link href="/next-steps" className="gc-block">
          <Image
            src="/images/2500w-164-roc09050-jpg.jpg"
            alt="Plan Your Visit"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="gc-block-overlay" />
          <div className="gc-block-content">
            <h3 className="gc-block-title">Plan Your Visit</h3>
            <p className="gc-block-desc">
              Come experience the warmth of our community. We meet every Sunday at 10am.
            </p>
            <span className="gc-block-cta">Plan A Visit &rarr;</span>
          </div>
        </Link>

        {/* Meet Our Team */}
        <Link href="/staff-leaders" className="gc-block">
          <Image
            src="/images/2500w-184-roc09140-jpg.jpg"
            alt="Staff and Leaders"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="gc-block-overlay" />
          <div className="gc-block-content">
            <h3 className="gc-block-title">Meet Our Team</h3>
            <p className="gc-block-desc">
              Get to know the leaders and team dedicated to serving this community.
            </p>
            <span className="gc-block-cta">Our Staff &amp; Leaders &rarr;</span>
          </div>
        </Link>

        {/* Our Calendar */}
        <Link href="/calendar" className="gc-block">
          <Image
            src="/images/2500w-200-roc09255-jpg.jpg"
            alt="Events Calendar"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="gc-block-overlay" />
          <div className="gc-block-content">
            <h3 className="gc-block-title">Our Calendar</h3>
            <p className="gc-block-desc">
              See what&apos;s happening — weekly services, special events, and community activities.
            </p>
            <span className="gc-block-cta">See What&apos;s Happening &rarr;</span>
          </div>
        </Link>

        {/* Get Involved */}
        <Link href="/next-steps" className="gc-block">
          <Image
            src="/images/2500w-202-roc09264-jpg.jpg"
            alt="Get Involved"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="gc-block-overlay" />
          <div className="gc-block-content">
            <h3 className="gc-block-title">Get Involved</h3>
            <p className="gc-block-desc">
              Everyone has something to offer. Discover ministries designed to help you grow.
            </p>
            <span className="gc-block-cta">Take Your Next Step &rarr;</span>
          </div>
        </Link>
      </section>

      {/* ── Say Hello / Contact ── */}
      <section className="gc-section gc-section-dark gc-text-center">
        <div className="gc-container">
          <p className="gc-eyebrow gc-eyebrow-dim">Connect With Us</p>
          <h2 className="gc-section-h2 gc-white">We&apos;d Love to Hear From You</h2>
          <p className="gc-section-body gc-dim" style={{ maxWidth: 520, margin: "0 auto 2.5rem" }}>
            Whether you have questions, need prayer, or just want to say hello —
            reach out and our team will get back to you.
          </p>
          <div className="gc-contact-info">
            <a href="tel:17139280999" className="gc-contact-link">+1 713-928-0999</a>
            <span className="gc-contact-sep">&middot;</span>
            <a href="mailto:info@blwgracecity.org" className="gc-contact-link">info@blwgracecity.org</a>
          </div>
          <div className="gc-btn-row" style={{ justifyContent: "center", marginTop: "2rem" }}>
            <Link href="/next-steps" className="gc-btn-white">Say Hello</Link>
            <Link href="/next-steps" className="gc-btn-outline-white">Get Prayer</Link>
          </div>
        </div>
      </section>
    </>
  );
}
