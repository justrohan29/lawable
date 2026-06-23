"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);
    
    if (res.success) {
      setSent(true);
      toast.success("Reset email sent!");
    } else {
      toast.error(res.error || "Failed to send reset email.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", padding: 24, fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: "100%", maxWidth: 440, boxShadow: "0 12px 40px rgba(15,30,58,0.08)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, justifyContent: "center" }}>
          <img src="/logo.png" alt="Lawable" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.03em" }}>Lawable</span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 64, height: 64, background: "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} color="#059669" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>Check your email</h2>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
              We sent a password reset link to <strong style={{ color: "#0f172a" }}>{email}</strong>
            </p>
            <Link href="/auth/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", background: "#fff", color: "#334155", border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 6, textAlign: "center" }}>Forgot password?</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, textAlign: "center" }}>Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com"
                    style={{ width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                    onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", background: loading ? "#94a3b8" : "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)", transition: "transform .15s, box-shadow .15s", marginTop: 4 }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)"; }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Link href="/auth/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "#0f172a"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
