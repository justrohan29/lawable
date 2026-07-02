import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* Navbar (Same as landing page) */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/logo.png" alt="Lawable" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
              <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.03em" }}>Lawable</span>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div className="hidden gap-6 md:flex">
              <Link href="/courses" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Courses</Link>
              <Link href="/blog" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Blog</Link>
              <Link href="/about" style={{ fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>About</Link>
              <Link href="/contact" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Contact</Link>
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

      {/* Hero */}
      <section className="bg-slate-900 pt-40 pb-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Democratizing Legal Education in India.</h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Lawable bridges the gap between traditional law school curriculum and the practical, high-stakes reality of modern corporate law practice.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 leading-relaxed">
              We believe that every ambitious law student, regardless of their university tier, deserves access to world-class practical training. By partnering with leading practitioners from top-tier firms, we decode the unspoken rules of the legal profession.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <BookOpen size={32} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Practical Curriculum</h3>
              <p className="text-slate-600">We don&apos;t teach theory. Our courses are built around real-world transactions, actual contract drafts, and the soft skills required to thrive in a high-pressure environment.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <Users size={32} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Mentorship</h3>
              <p className="text-slate-600">Learn directly from partners and senior associates who have executed some of the largest M&A and restructuring deals in the country.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            &copy; {new Date().getFullYear()} Lawable Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
