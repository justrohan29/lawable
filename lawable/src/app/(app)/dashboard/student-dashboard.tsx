"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  MOCK_STUDENTS, MOCK_MENTORS, MOCK_OPPORTUNITIES, MOCK_APPLICATIONS, MOCK_SESSIONS,
  SESSION_TYPE_LABELS
} from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Briefcase, Users, ArrowRight, Clock, Calendar,
  TrendingUp, MapPin, FileText, Award, Zap,
  CheckCircle, AlertCircle, Sparkles, Video, Radio,
  Play, Mic, MessageSquare, Eye, BookOpen, Star,
  Headphones, MonitorPlay, ChevronRight, Bell, Flame
} from "lucide-react";
import { format, addDays, addHours } from "date-fns";

// ─── MOCK LIVE SESSION DATA ─────────────────────────────────────────────────
const LIVE_NOW = {
  id: "live1",
  title: "Cracking Tier-1 Law Firm Interviews",
  host: "Adv. Rohan Mehta",
  hostOrg: "AZB & Partners",
  hostAvatar: "RM",
  type: "workshop" as const,
  viewers: 142,
  startedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  tags: ["Interview Prep", "Corporate Law", "Live Q&A"],
  description: "Join a live interactive workshop on how to ace interviews at India's top law firms. Covering HR rounds, technical questions, and case study exercises.",
};

const now = new Date();

const UPCOMING_LIVE_EVENTS = [
  {
    id: "ul1",
    title: "SEBI Takeover Code — Deep Dive",
    host: "Adv. Rohan Mehta",
    hostOrg: "AZB & Partners",
    hostAvatar: "RM",
    type: "masterclass" as const,
    scheduledAt: addDays(now, 1).toISOString(),
    duration: "90 min",
    attendees: 67,
    maxAttendees: 100,
    tags: ["SEBI", "Securities Law"],
    isRsvp: false,
  },
  {
    id: "ul2",
    title: "Mock Moot Court: Environmental Law",
    host: "Adv. Preethi Ramachandran",
    hostOrg: "Ramachandran & Associates",
    hostAvatar: "PR",
    type: "interactive" as const,
    scheduledAt: addDays(now, 2).toISOString(),
    duration: "120 min",
    attendees: 23,
    maxAttendees: 30,
    tags: ["Moot Court", "Environmental Law"],
    isRsvp: true,
  },
  {
    id: "ul3",
    title: "Building Your Legal Career in Tech",
    host: "Karan Jotwani",
    hostOrg: "Zomato Legal",
    hostAvatar: "KJ",
    type: "fireside" as const,
    scheduledAt: addDays(now, 3).toISOString(),
    duration: "60 min",
    attendees: 89,
    maxAttendees: 150,
    tags: ["Tech Law", "Career"],
    isRsvp: false,
  },
  {
    id: "ul4",
    title: "Drafting Arbitration Clauses — Practitioner's Workshop",
    host: "Adv. Anjali Gupta",
    hostOrg: "Delhi High Court",
    hostAvatar: "AG",
    type: "workshop" as const,
    scheduledAt: addHours(addDays(now, 4), 3).toISOString(),
    duration: "75 min",
    attendees: 41,
    maxAttendees: 60,
    tags: ["Arbitration", "Drafting"],
    isRsvp: false,
  },
];

const SESSION_REPLAYS = [
  {
    id: "r1",
    title: "Contract Negotiation Strategies for Junior Lawyers",
    host: "Adv. Rohan Mehta",
    duration: "58 min",
    views: 1247,
    rating: 4.9,
    recordedAt: addDays(now, -3).toISOString(),
    thumbnail: "corporate",
  },
  {
    id: "r2",
    title: "Supreme Court Landmark Judgments 2025 — A Roundup",
    host: "Adv. Preethi Ramachandran",
    duration: "72 min",
    views: 2103,
    rating: 4.8,
    recordedAt: addDays(now, -7).toISOString(),
    thumbnail: "litigation",
  },
  {
    id: "r3",
    title: "How to Write a Winning Research Paper",
    host: "Karan Jotwani",
    duration: "45 min",
    views: 876,
    rating: 4.7,
    recordedAt: addDays(now, -10).toISOString(),
    thumbnail: "research",
  },
];

const WEEKLY_SCHEDULE = (() => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(now, i);
    days.push({
      day: format(d, "EEE"),
      date: format(d, "d"),
      events: i === 1 ? 1 : i === 2 ? 1 : i === 3 ? 1 : i === 4 ? 1 : 0,
      isToday: i === 0,
    });
  }
  return days;
})();

const EVENT_TYPE_CONFIG = {
  workshop: { label: "Workshop", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  masterclass: { label: "Masterclass", color: "#7c3aed", bg: "#f3e8ff", border: "#c4b5fd" },
  interactive: { label: "Interactive", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
  fireside: { label: "Fireside Chat", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const student = MOCK_STUDENTS.find((s) => s.id === "s1")!;
  const applications = MOCK_APPLICATIONS.map((a) => ({
    ...a,
    opportunity: MOCK_OPPORTUNITIES.find((o) => o.id === a.opportunityId),
  }));
  const sessions = MOCK_SESSIONS.map((s) => ({
    ...s,
    mentor: MOCK_MENTORS.find((m) => m.id === s.mentorId),
  }));
  const upcomingSessions = sessions.filter(
    (s) => s.status === "confirmed" || s.status === "pending"
  );
  const recommendedOpps = MOCK_OPPORTUNITIES.filter((o) => o.isActive).slice(0, 3);

  const [rsvpState, setRsvpState] = useState<Record<string, boolean>>(
    Object.fromEntries(UPCOMING_LIVE_EVENTS.map(e => [e.id, e.isRsvp]))
  );

  const toggleRsvp = (id: string) => {
    setRsvpState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      
      {/* ── Greeting Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)", borderRadius: 20, padding: 32, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden", boxShadow: "0 12px 32px rgba(37,99,235,0.2)" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.15),transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -50, left: "20%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.1),transparent 70%)" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 12, border: "1px solid rgba(255,255,255,0.2)" }}>
            <Sparkles size={14} color="#fcd34d" />
            <span style={{ color: "#f8fafc" }}>Student Dashboard</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Good evening, {user?.name.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", maxWidth: 500, lineHeight: 1.6 }}>
            You have {applications.length} active applications and {upcomingSessions.length} upcoming mentor sessions. Let&apos;s make today count.
          </p>
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12 }}>
          <Link href="/opportunities" style={{ background: "#fff", color: "#1d4ed8", padding: "12px 24px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <Zap size={16} /> Find Opportunities
          </Link>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { icon: FileText, label: "Total Applications", value: applications.length, sub: `${applications.filter(a => a.status === "accepted").length} accepted`, color: "#3b82f6", bg: "#eff6ff" },
          { icon: Calendar, label: "Mentorship Sessions", value: sessions.length, sub: `${upcomingSessions.length} upcoming`, color: "#8b5cf6", bg: "#f3e8ff" },
          { icon: Users, label: "Network Connections", value: 12, sub: "Growing fast", color: "#10b981", bg: "#d1fae5" },
          { icon: Award, label: "Profile Score", value: `${student.profileCompletion}%`, sub: "Keep updating", color: "#f59e0b", bg: "#fef3c7" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,30,58,0.04)", borderTop: `4px solid ${stat.color}` }} className="card-hover">
            <div style={{ width: 42, height: 42, background: stat.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ── LIVE SESSIONS SECTION ──
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Live Now Banner */}
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)", borderRadius: 20, padding: 28, position: "relative", overflow: "hidden", border: "1px solid #334155" }}>
        {/* Decorative glow */}
        <div style={{ position: "absolute", top: -80, right: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(239,68,68,0.15),transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -60, left: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header with live indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", padding: "5px 12px", borderRadius: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.6)", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Now</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.08)", padding: "5px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Eye size={12} color="#94a3b8" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{LIVE_NOW.viewers} watching</span>
                </div>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.01em", marginBottom: 6 }}>
                {LIVE_NOW.title}
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, maxWidth: 600, marginBottom: 14 }}>
                {LIVE_NOW.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ background: "#8b5cf6", color: "#fff", fontWeight: 700, fontSize: 11 }}>
                      {LIVE_NOW.hostAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{LIVE_NOW.host}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{LIVE_NOW.hostOrg}</div>
                  </div>
                </div>
                <div style={{ width: 1, height: 28, background: "#334155" }} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {LIVE_NOW.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 600, background: "rgba(255,255,255,0.06)", color: "#94a3b8", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <button
              style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 20px rgba(239,68,68,0.35)", transition: "transform .15s, box-shadow .15s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(239,68,68,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(239,68,68,0.35)"; }}
            >
              <Video size={18} /> Join Session
            </button>
          </div>

          {/* Live session stats bar */}
          <div style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { icon: Mic, label: "Live Q&A Open", value: "Ask questions" },
              { icon: MessageSquare, label: "Chat Active", value: "38 messages" },
              { icon: Clock, label: "Duration", value: "22 min in" },
              { icon: Headphones, label: "Audio Mode", value: "Available" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.icon size={14} color="#64748b" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upcoming Live Events + Schedule ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>

        {/* Upcoming Live Events List */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,30,58,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
              <Radio size={18} color="#ef4444" /> Upcoming Live Events
            </h2>
            <Link href="/sessions" style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            {UPCOMING_LIVE_EVENTS.map(event => {
              const typeConf = EVENT_TYPE_CONFIG[event.type];
              const spotsLeft = event.maxAttendees - event.attendees;
              const isAlmostFull = spotsLeft <= 10;
              const isRsvpd = rsvpState[event.id];
              return (
                <div key={event.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9", transition: "border-color .15s, box-shadow .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,30,58,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Date badge */}
                  <div style={{ width: 52, height: 56, borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{format(new Date(event.scheduledAt), "MMM")}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{format(new Date(event.scheduledAt), "d")}</div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{event.host}</span>
                      <span style={{ color: "#cbd5e1" }}>•</span>
                      <span>{event.duration}</span>
                      <span style={{ color: "#cbd5e1" }}>•</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={11} /> {format(new Date(event.scheduledAt), "h:mm a")}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: typeConf.bg, color: typeConf.color, padding: "2px 8px", borderRadius: 6, border: `1px solid ${typeConf.border}` }}>{typeConf.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}>
                        <Users size={10} /> {event.attendees}/{event.maxAttendees}
                      </span>
                      {isAlmostFull && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", gap: 3 }}>
                          <Flame size={10} /> {spotsLeft} spots left!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RSVP button */}
                  <button
                    onClick={() => toggleRsvp(event.id)}
                    style={{
                      padding: "8px 18px", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all .15s", flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                      background: isRsvpd ? "#ecfdf5" : "linear-gradient(135deg,#1e3a5f,#2563eb)",
                      color: isRsvpd ? "#059669" : "#fff",
                      border: isRsvpd ? "1px solid #a7f3d0" : "none",
                      boxShadow: isRsvpd ? "none" : "0 4px 12px rgba(37,99,235,0.2)",
                    }}
                  >
                    {isRsvpd ? <><CheckCircle size={14} /> RSVP&apos;d</> : <><Bell size={14} /> RSVP</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Schedule Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Week strip */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 2px 12px rgba(15,30,58,0.04)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={16} color="#8b5cf6" /> This Week
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
              {WEEKLY_SCHEDULE.map(day => (
                <div key={day.day} style={{
                  textAlign: "center", padding: "8px 0", borderRadius: 10, cursor: "pointer", transition: "background .15s",
                  background: day.isToday ? "linear-gradient(135deg,#1e3a5f,#2563eb)" : day.events > 0 ? "#f8fafc" : "transparent",
                  border: day.isToday ? "none" : day.events > 0 ? "1px solid #e2e8f0" : "1px solid transparent",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: day.isToday ? "rgba(255,255,255,0.7)" : "#94a3b8", marginBottom: 2 }}>{day.day}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: day.isToday ? "#fff" : "#0f172a" }}>{day.date}</div>
                  {day.events > 0 && (
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: day.isToday ? "#fcd34d" : "#8b5cf6", margin: "4px auto 0" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Session Stats */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 2px 12px rgba(15,30,58,0.04)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={16} color="#10b981" /> Your Live Stats
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Sessions Attended", value: "14", icon: MonitorPlay, color: "#3b82f6" },
                { label: "Watch Hours", value: "18h", icon: Clock, color: "#8b5cf6" },
                { label: "Questions Asked", value: "7", icon: MessageSquare, color: "#10b981" },
                { label: "Replays Watched", value: "9", icon: Play, color: "#f59e0b" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <item.icon size={14} color={item.color} />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Session Replays ── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
            <MonitorPlay size={18} color="#8b5cf6" /> Session Replays
          </h2>
          <Link href="/sessions" style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            Browse library <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {SESSION_REPLAYS.map(replay => {
            const gradients: Record<string, string> = {
              corporate: "linear-gradient(135deg,#1e3a5f,#2563eb)",
              litigation: "linear-gradient(135deg,#4c1d95,#7c3aed)",
              research: "linear-gradient(135deg,#065f46,#10b981)",
            };
            return (
              <div key={replay.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(15,30,58,0.04)", cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
                className="card-hover"
              >
                {/* Thumbnail area */}
                <div style={{ height: 110, background: gradients[replay.thumbnail] || gradients.corporate, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.3)" }}>
                    <Play size={20} color="#fff" fill="#fff" />
                  </div>
                  <div style={{ position: "absolute", bottom: 8, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                    {replay.duration}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {replay.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{replay.host}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#94a3b8" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Eye size={11} /> {replay.views.toLocaleString()}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={11} color="#f59e0b" fill="#f59e0b" /> {replay.rating}</span>
                    </div>
                    <ChevronRight size={14} color="#94a3b8" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Content Grid (Applications + Right Sidebar) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Applications */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,30,58,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <Briefcase size={18} color="#3b82f6" /> Recent Applications
              </h2>
              <Link href="/applications" style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {applications.slice(0,3).map(app => (
                <div key={app.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
                  <div style={{ width: 40, height: 40, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Briefcase size={18} color="#64748b" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{app.opportunity?.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{app.opportunity?.organization}</span>
                      <span style={{ color: "#cbd5e1" }}>•</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {app.opportunity?.location}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, 
                      background: app.status === "accepted" ? "#d1fae5" : app.status === "shortlisted" ? "#dbeafe" : app.status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: app.status === "accepted" ? "#065f46" : app.status === "shortlisted" ? "#1e40af" : app.status === "rejected" ? "#991b1b" : "#92400e",
                      border: `1px solid ${app.status === "accepted" ? "#a7f3d0" : app.status === "shortlisted" ? "#bfdbfe" : app.status === "rejected" ? "#fecaca" : "#fde68a"}`,
                    }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Opportunities */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 4px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={18} color="#10b981" /> Recommended for You
              </h2>
              <Link href="/opportunities" style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                Browse <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {recommendedOpps.map(opp => (
                <div key={opp.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 2px 8px rgba(15,30,58,0.04)", display: "flex", flexDirection: "column" }} className="card-hover">
                  <div style={{ fontSize: 10, fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "3px 8px", borderRadius: 6, display: "inline-block", alignSelf: "flex-start", marginBottom: 12 }}>
                    {opp.type.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: 4 }}>{opp.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>{opp.organization}</div>
                  
                  <div style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}>
                      <MapPin size={12} /> {opp.location}
                    </div>
                    {opp.stipend && <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>{opp.stipend}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Profile Completion (Only if not 100%) */}
          {student.profileCompletion < 100 && (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 2px 12px rgba(15,30,58,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <Award size={16} color="#f59e0b" /> Complete Profile
                </h2>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#2563eb" }}>{student.profileCompletion}%</span>
              </div>
              <Progress value={student.profileCompletion} className="h-2 mb-4" />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Basic Info", done: true },
                  { label: "Profile Photo", done: false },
                  { label: "Resume Upload", done: true },
                  { label: "LinkedIn URL", done: true },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    {item.done ? <CheckCircle size={14} color="#10b981" /> : <AlertCircle size={14} color="#fcd34d" />}
                    <span style={{ color: item.done ? "#64748b" : "#0f172a", fontWeight: item.done ? 500 : 700 }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/profile" style={{ display: "block", marginTop: 16, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a", padding: "10px", borderRadius: 10, textAlign: "center", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Edit Profile
              </Link>
            </div>
          )}

          {/* Upcoming Sessions */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,30,58,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={18} color="#8b5cf6" /> Upcoming Sessions
              </h2>
            </div>
            <div style={{ padding: 24 }}>
              {upcomingSessions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Calendar size={32} color="#e2e8f0" style={{ margin: "0 auto 10px" }} />
                  <div style={{ fontSize: 13, color: "#64748b" }}>No upcoming sessions</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {upcomingSessions.map(session => (
                    <div key={session.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, background: "#f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <Avatar className="w-10 h-10">
                          <AvatarFallback style={{ background: "#8b5cf6", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                            {session.mentor?.name.split(" ").pop()?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{session.mentor?.name}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{SESSION_TYPE_LABELS[session.type]}</div>
                        </div>
                      </div>
                      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#334155", fontWeight: 600 }}>
                        <Clock size={14} color="#8b5cf6" />
                        {format(new Date(session.scheduledAt), "EEE, d MMM 'at' h:mm a")}
                      </div>
                      {session.meetLink && (
                        <a href={session.meetLink} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 12, background: "#2563eb", color: "#fff", textAlign: "center", padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                          Join Meeting
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Pulse animation for live indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
