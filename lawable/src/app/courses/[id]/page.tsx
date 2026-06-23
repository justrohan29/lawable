"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Video, Clock, Award, Shield } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() });
        } else {
          throw new Error("Not found");
        }
      } catch (error: any) {
        console.error("Failed to fetch course details", error);
        toast.error("Could not load course details.");
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to enroll in this course.");
      router.push("/auth/login");
      return;
    }
    // Mock enrollment logic
    toast.success("Successfully enrolled! Redirecting to course player...");
    setTimeout(() => {
      router.push(`/courses/${id}/learn`);
    }, 1500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.png" alt="Lawable" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.03em" }}>Lawable</span>
          </Link>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <Link href="/courses" style={{ fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>Courses</Link>
            {isAuthenticated ? (
              <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: 9, background: "#0f172a" }}>
                Dashboard
              </Link>
            ) : (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: "#334155", textDecoration: "none" }}>Sign in</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 text-white relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <Award size={14} /> Premium Course
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-slate-300">
                <Video size={18} className="text-blue-500" />
                <span className="font-medium">{course.lessonsCount || 12} Video Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={18} className="text-blue-500" />
                <span className="font-medium">{course.durationHours || 4} Hours of Content</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={handleEnroll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                Enroll Now — ₹{course.price} <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* Fake Video Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer border border-white/20">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen size={24} className="text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">What you will learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {(course.outcomes || ["Draft complex agreements", "Negotiate commercial terms", "Identify liabilities", "Master contract law"]).map((outcome: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium">{outcome}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Course Curriculum</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((mod) => (
              <div key={mod} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Module {mod}: Core Concepts</h3>
                  <span className="text-sm font-semibold text-slate-500">4 Lessons</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Video size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">Introduction & Overview</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Video size={16} className="text-slate-400" />
                    <span className="text-sm font-medium">Deep Dive into Theory</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-blue-600">Practical Case Study (PDF)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Instructor</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                <img src="/logo.png" alt="Instructor" className="w-10 h-10 object-contain opacity-50" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{course.instructor || "Industry Expert"}</p>
                <p className="text-sm text-slate-500">Tier-1 Law Firm Partner</p>
              </div>
            </div>
            
            <hr className="border-slate-100 mb-6" />
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-600">
                <Shield size={18} className="text-slate-400" />
                <span className="text-sm font-medium">Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <BookOpen size={18} className="text-slate-400" />
                <span className="text-sm font-medium">Lifetime Access to Materials</span>
              </div>
            </div>

            <button 
              onClick={handleEnroll}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
            >
              Enroll Now — ₹{course.price}
            </button>
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
