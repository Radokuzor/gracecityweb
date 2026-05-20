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
  start.setDate(now.getDate() - now.getDay()); // Sunday
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
      <section style={{ background: "#0a0a0a", padding: "5rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          What&apos;s Happening
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>
          Events Calendar
        </h1>
      </section>

      <section style={{ padding: "3rem 1.5rem", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Week header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a" }}>
              {MONTH_NAMES[weekStart.getMonth()]} {weekStart.getFullYear()}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#9a9a9a" }}>Week View</p>
          </div>

          {/* Week grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: "#e8e8e8", border: "1px solid #e8e8e8", marginBottom: "3rem" }}>
            {weekDays.map((day) => {
              const isToday = day.toDateString() === today.toDateString();
              const dayEvents = eventsOnDay(day);
              return (
                <div key={day.toISOString()} style={{ background: "#fff", minHeight: 120, padding: "0.75rem" }}>
                  <div style={{ marginBottom: "0.625rem" }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a9a9a" }}>
                      {DAY_LABELS[day.getDay()]}
                    </p>
                    <p style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: isToday ? "#fff" : "#0a0a0a",
                      background: isToday ? "#0a0a0a" : "transparent",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {day.getDate()}
                    </p>
                  </div>
                  {dayEvents.map((ev) => (
                    <div key={ev.id} style={{ background: "#0a0a0a", color: "#fff", padding: "0.25rem 0.5rem", fontSize: "0.7rem", marginBottom: "0.25rem", lineHeight: 1.4 }}>
                      <p style={{ fontWeight: 600 }}>{ev.title}</p>
                      <p style={{ color: "rgba(255,255,255,0.7)" }}>
                        {new Date(ev.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </p>
                    </div>
                  ))}
                  {/* Recurring Sunday service */}
                  {day.getDay() === 0 && (
                    <div style={{ background: "#f7f7f7", padding: "0.25rem 0.5rem", fontSize: "0.7rem", border: "1px solid #e8e8e8", lineHeight: 1.4 }}>
                      <p style={{ fontWeight: 600, color: "#0a0a0a" }}>Sunday Service</p>
                      <p style={{ color: "#9a9a9a" }}>10:00 AM</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upcoming events list */}
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "1.5rem" }}>Upcoming Events</h3>
          {events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "#9a9a9a", border: "1px solid #e8e8e8" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>No upcoming events scheduled</p>
              <p style={{ fontSize: "0.875rem" }}>Check back soon or join us Sunday at 10am.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#e8e8e8" }}>
              {events.map((ev) => (
                <div key={ev.id} style={{ background: "#fff", padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0a0a0a", marginBottom: "0.25rem" }}>{ev.title}</h4>
                    {ev.description && <p style={{ fontSize: "0.875rem", color: "#4a4a4a", lineHeight: 1.6, marginBottom: "0.5rem" }}>{ev.description}</p>}
                    {ev.location && <p style={{ fontSize: "0.8rem", color: "#9a9a9a" }}>{ev.location}</p>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0a0a0a", whiteSpace: "nowrap" }}>
                      {formatDateTime(ev.start_time)}
                    </p>
                    {ev.end_time && (
                      <p style={{ fontSize: "0.8rem", color: "#9a9a9a" }}>
                        ends {new Date(ev.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                      </p>
                    )}
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
