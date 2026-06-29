"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Scale, Eye, EyeOff, ArrowRight, Zap, CheckCircle, Users, Briefcase } from "lucide-react";
import { toast } from "sonner";

const DEMO_ROLES = [
  { label: "Student", email: "priya@nls.ac.in", color: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
  { label: "Mentor", email: "adv.mehta@lawchambers.in", color: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
  { label: "Recruiter", email: "hr@luthra.com", color: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  { label: "Admin", email: "admin@lawable.in", color: "#fef3c7", text: "#92400e", border: "#fde68a" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    
    if (res.success) {
      toast.success("Welcome back! 👋");
      router.push("/admin");
    } else {
      toast.error(res.error || "Invalid credentials.");
    }
    
  };

  const fillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("demo123");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* ── Left panel — dark navy ── */}
      <div style={{
        background: "linear-gradient(150deg,#060e1f 0%,#0f1e3a 60%,#162844 100%)",
        padding: "48px 56px", display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(59,130,246,0.08) 1px,transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", left: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.15),transparent 70%)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 9, marginBottom: "auto" }}>
          <img src="/logo.png" alt="Lawable" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9", letterSpacing: "-0.03em" }}>Lawable</span>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
            India's legal career{" "}
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>platform</span>
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 40 }}>
            Internships, mentorship, resources and a community built for the next generation of legal professionals.
          </p>

          {/* Floating mini cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: Briefcase, color: "#dbeafe", iconC: "#2563eb", title: "237+ Opportunities", sub: "Internships & research roles" },
              { icon: Users, color: "#ede9fe", iconC: "#7c3aed", title: "96 Verified Mentors", sub: "From AZB, Cyril, Trilegal & more" },
              { icon: CheckCircle, color: "#d1fae5", iconC: "#059669", title: "1,284 Students", sub: "Already accelerating their careers" },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ width: 38, height: 38, background: item.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={18} color={item.iconC} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 56px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>Sign in to continue your legal journey</p>

          {/* Demo panel */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 18px", marginBottom: 28, boxShadow: "0 1px 4px rgba(15,30,58,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <Zap size={13} color="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e", letterSpacing: "0.04em", textTransform: "uppercase" }}>Demo — click to auto-fill</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {DEMO_ROLES.map(r => (
                <button key={r.label} onClick={() => fillDemo(r.email)}
                  style={{ background: r.color, border: `1px solid ${r.border}`, color: r.text, borderRadius: 8, padding: "8px 10px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "transform .12s, box-shadow .12s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Password</label>
                <Link href="/auth/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                  onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: loading ? "#94a3b8" : "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", border: "none", borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)", transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)"; }}>
              {loading ? "Signing in..." : (<>Sign in <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" }}>
            Don't have an account?{" "}
            <Link href="/auth/register" style={{ fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
