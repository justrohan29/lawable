"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, ArrowRight, ArrowLeft, Mail, Lock, User, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string; email: string; password: string; role: "student" | "mentor" | "recruiter" | "admin"; college: string;
  }>({
    name: "", email: "", password: "", role: "student", college: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    
    if (res.success) {
      toast.success("Account created successfully! Welcome to Lawable.");
      router.push("/dashboard");
    } else {
      toast.error(res.error || "Failed to create account.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* ── Left panel — dark navy ── */}
      <div style={{
        background: "linear-gradient(150deg,#060e1f 0%,#0f1e3a 60%,#162844 100%)",
        padding: "48px 56px", display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(59,130,246,0.08) 1px,transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.12),transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 9, marginBottom: "auto" }}>
          <img src="/logo.png" alt="Lawable" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9", letterSpacing: "-0.03em" }}>Lawable</span>
        </div>

        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
            Join the network of top{" "}
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>law talent</span>
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 40 }}>
            Create your free account today and start connecting with opportunities and mentors.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>Free</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>For Law Students</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>1,200+</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Active Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{ background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 56px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= 1 ? "#2563eb" : "#e2e8f0", color: step >= 1 ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>1</div>
              <div style={{ height: 2, flex: 1, background: step >= 2 ? "#2563eb" : "#e2e8f0" }} />
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= 2 ? "#2563eb" : "#e2e8f0", color: step >= 2 ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>2</div>
            </div>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 }}>
            {step === 1 ? "Create your account" : "Complete profile"}
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32 }}>
            {step === 1 ? "Start your legal career journey today." : "Tell us a bit more about yourself."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {step === 1 && (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                      placeholder="John Doe"
                      style={{ width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                      onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required
                      placeholder="you@example.com"
                      style={{ width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                      onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                    <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength={6}
                      placeholder="••••••••"
                      style={{ width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                      onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>I am a...</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { id: "student", label: "Law Student" },
                      { id: "mentor", label: "Legal Professional" }
                    ].map(role => (
                      <div key={role.id} onClick={() => setFormData({ ...formData, role: role.id })}
                        style={{ border: `1px solid ${formData.role === role.id ? "#3b82f6" : "#e2e8f0"}`, background: formData.role === role.id ? "#eff6ff" : "#fff", padding: "12px", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .15s" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${formData.role === role.id ? "#3b82f6" : "#cbd5e1"}`, padding: 2 }}>
                          {formData.role === role.id && <div style={{ width: "100%", height: "100%", background: "#3b82f6", borderRadius: "50%" }} />}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: formData.role === role.id ? 700 : 500, color: formData.role === role.id ? "#1e40af" : "#475569" }}>{role.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>Institution / Organization</label>
                  <div style={{ position: "relative" }}>
                    <GraduationCap style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                    <input type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} required
                      placeholder={formData.role === "student" ? "e.g., NLSIU" : "e.g., AZB & Partners"}
                      style={{ width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                      onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px", background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <ArrowLeft size={18} />
                </button>
              )}
              <button type="submit" disabled={loading}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: loading ? "#94a3b8" : "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", border: "none", borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)", transition: "transform .15s, box-shadow .15s" }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.3)"; }}>
                {loading ? "Creating account..." : (step === 1 ? <>Continue <ArrowRight size={16} /></> : "Create Account")}
              </button>
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
