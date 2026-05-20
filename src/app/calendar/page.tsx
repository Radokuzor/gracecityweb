import type { Metadata } from "next";
import { createBrowserClient } from "@/lib/supabase";
import { Event } from "@/types";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

async function getEvents(): Promise<Event[]> {
  const supabase = createBrowserClient();
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 30);

  const { data } = await supabase
    .from("events")
    .select("*")
    .gte("start_time", start.toISOString())
    .lte("start_time", end.toISOString())
    .order("start_time", { ascending: true });

  return data ?? [];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default async function CalendarPage() {
  const events = await getEvents();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const eventsOnDay = (day: Date) =>
    events.filter((e) => {
      const d = new Date(e.start_time);
      return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
    });

  return (
    <>
      <div className="gc-page-hero">
        <span className="gc-page-hero-eye">What&apos;s Happening</span>
        <h1 className="gc-page-hero-h1">Events Calendar</h1>
      </div>

      <section className="gc-section gc-section-white">
        <div className="gc-container">
          {/* Week header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a" }}>
              {MONTH_NAMES[weekStart.getMonth()]} {weekStart.getFullYear()}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#9a9a9a" }}>Week View</p>
          </div>

          {/* Week grid — hidden on very small screens, shown on sm+ */}
          <div className="gc-week-grid" style={{ marginBottom: "3rem" }}>
            {weekDays.map((day) => {
              const isToday = day.toDateString() === today.toDateString();
              const dayEvents = eventsOnDay(day);
              return (
                <div key={day.toISOString()} style={{ background: "#fff", minHeight: 100, padding: "0.625rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a9a9a" }}>
                      {DAY_LABELS[day.getDay()]}
                    </p>
                    <p style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: isToday ? "#fff" : "#0a0a0a",
                      background: isToday ? "#0a0a0a" : "transparent",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {day.getDate()}
                    </p>
                  </div>
                  {dayEvents.map((ev) => (
                    <div key={ev.id} style={{ background: "#0a0a0a", color: "#fff", padding: "0.2rem 0.4rem", fontSize: "0.65rem", marginBottom: "0.2rem", lineHeight: 1.4 }}>
                      <p style={{ fontWeight: 600 }}>{ev.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        {new Date(ev.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                  ))}
                  {day.getDay() === 0 && (
                    <div style={{ background: "#f7f7f7", padding: "0.2rem 0.4rem", fontSize: "0.65rem", border: "1px solid #e8e8e8", lineHeight: 1.4 }}>
                      <p style={{ fontWeight: 600, color: "#0a0a0a" }}>Service</p>
                      <p style={{ color: "#9a9a9a" }}>10 AM</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upcoming events list */}
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "1.5rem" }}>Upcoming Events</h3>
          {events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#9a9a9a", border: "1px solid #e8e8e8" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No upcoming events scheduled</p>
              <p style={{ fontSize: "0.875rem" }}>Check back soon or join us Sunday at 10am.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#e8e8e8" }}>
              {events.map((ev) => (
                <div key={ev.id} style={{ background: "#fff", padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.25rem" }}>{ev.title}</h4>
                      {ev.description && <p style={{ fontSize: "0.875rem", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "0.5rem" }}>{ev.description}</p>}
                      {ev.location && <p style={{ fontSize: "0.8rem", color: "#9a9a9a" }}>{ev.location}</p>}
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0a0a0a", whiteSpace: "nowrap" }}>
                        {formatDateTime(ev.start_time)}
                      </p>
                      {ev.end_time && (
                        <p style={{ fontSize: "0.8rem", color: "#9a9a9a", whiteSpace: "nowrap" }}>
                          ends {new Date(ev.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </p>
                      )}
                    </div>
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
