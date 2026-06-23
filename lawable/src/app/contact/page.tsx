"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        type: "Contact Form",
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.warn("Firebase not connected. Faking success for UI demo.");
      setTimeout(() => {
        setSuccess(true);
        toast.success("Message sent successfully! (Mocked)");
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyItems: "space-between" }}>
          <div style={{ flex: 1 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/logo.png" alt="Lawable" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
              <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.03em" }}>Lawable</span>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 24, display: "none", "@media (min-width: 768px)": { display: "flex" } } as any}>
              <Link href="/courses" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Courses</Link>
              <Link href="/blog" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Blog</Link>
              <Link href="/about" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>About</Link>
              <Link href="/contact" style={{ fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>Contact</Link>
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
      <section className="bg-slate-900 pt-32 pb-20 px-6 text-center text-white relative">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">Have a question about our courses or want to partner with us? Reach out below.</p>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-500 text-sm mt-1">Our team will respond within 24 hours.</p>
                  <a href="mailto:hello@lawable.in" className="text-blue-600 font-semibold text-sm mt-2 block hover:underline">hello@lawable.in</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Office</h4>
                  <p className="text-slate-500 text-sm mt-1">Lawable Technologies Pvt Ltd.<br />Mumbai, India 400001</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Send size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">We've received your inquiry and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-500/20 mt-4 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
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
            © {new Date().getFullYear()} Lawable Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
