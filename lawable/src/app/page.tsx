"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Video, Users, CheckCircle, ChevronRight, Shield, Award } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, limit, where } from "firebase/firestore";

export default function LandingPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const q = query(collection(db, "courses"), where("status", "==", "published"), limit(3));
        const querySnapshot = await getDocs(q);
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setCourses(data);
      } catch (error) {
        setCourses([
          { id: "mock1", title: "Corporate Law Masterclass", price: 2999, description: "Master the fundamentals of corporate law and structuring." },
          { id: "mock2", title: "Commercial Contracts", price: 1500, description: "Draft bulletproof commercial contracts for top tier firms." }
        ]);
      }
    };
    fetchFeaturedCourses();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Lawable" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.03em" }}>Lawable</span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 24, display: "none", "@media (min-width: 768px)": { display: "flex" } } as any}>
              <Link href="/courses" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Courses</Link>
              <Link href="/blog" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Blog</Link>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: "#334155", textDecoration: "none", padding: "8px 16px", borderRadius: 8 }}>Sign in</Link>
              <Link href="/auth/register" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: 9, background: "linear-gradient(135deg,#1e3a5f,#2563eb)", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(37,99,235,0.28)" }}>
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(150deg,#060e1f 0%,#0f1e3a 55%,#162844 100%)", paddingTop: 140, paddingBottom: 100, paddingLeft: 24, paddingRight: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(59,130,246,0.07) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 999, padding: "6px 14px", marginBottom: 28 }}>
              <Zap size={13} color="#60a5fa" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#93c5fd" }}>India's Premium Legal Academy</span>
            </div>
            <h1 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: 800, color: "#f8fafc", lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: 20 }}>
              Master the Law. <span style={{ display: "inline-block", background: "linear-gradient(135deg,#2563eb,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Accelerate Your Career.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
              Premium courses created by top-tier legal professionals, live masterclasses, and an elite network of ambitious law students.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff", textDecoration: "none", padding: "13px 26px", borderRadius: 11, fontWeight: 700, fontSize: 15, boxShadow: "0 4px 18px rgba(37,99,235,0.38)" }}>
                Start Learning Free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
          <div style={{ position: "relative", height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <div style={{ width: "100%", maxWidth: 400, background: "white", borderRadius: 20, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
               <div style={{ width: 48, height: 48, background: "#eff6ff", color: "#2563eb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                 <BookOpen size={24} />
               </div>
               <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Drafting Commercial Contracts</h3>
               <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Learn the secret frameworks used by tier-1 law firms to draft bulletproof commercial agreements.</p>
               <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
                 <div style={{ width: "40%", height: "100%", background: "#2563eb" }} />
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>MODULE 2/5</span>
                 <button style={{ background: "#0f172a", color: "white", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Continue →</button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ─── DYNAMIC COURSES ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 16 }}>Featured Courses</h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600, margin: "0 auto" }}>Level up your practical skills with high-impact video courses designed by industry experts.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {courses.map(course => (
              <div key={course.id} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ width: 48, height: 48, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Video size={24} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8, lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, lineHeight: 1.6, minHeight: 45 }}>{course.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>₹{course.price}</span>
                  <Link href={`/courses`} style={{ fontSize: 14, fontWeight: 700, color: "#2563eb", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                    View Course <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer style={{ background: "#060e1f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <img src="/logo.png" alt="Lawable" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: 20, color: "#f8fafc", letterSpacing: "-0.02em" }}>Lawable</span>
          </div>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 400, margin: "0 auto 40px" }}>
            The premier platform for law students to learn practical skills and build successful legal careers.
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 32, fontSize: 13, color: "#475569" }}>
            © {new Date().getFullYear()} Lawable Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
