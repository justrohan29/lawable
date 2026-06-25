"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User, Search } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, where, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface BlogPost {
  id: string;
  title: string;
  summary?: string;
  author: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
  status?: string;
}

export default function PublicBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, "blog"), 
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data: BlogPost[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        data.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setPosts(data);
    } catch (error) {
      console.warn("Failed to fetch public blog posts. Mocking data.");
      setPosts([
        { 
          id: "mock1", 
          title: "How to Draft a Bulletproof Term Sheet", 
          summary: "Learn the crucial clauses every VC and founder should look out for in 2026.",
          author: "Varun Mehta", 
          createdAt: new Date(),
          status: "published"
        },
        { 
          id: "mock2", 
          title: "5 Skills Every Corporate Lawyer Needs", 
          summary: "Beyond reading contracts, here is what tier-1 firms actually test you on during internships.",
          author: "Priya Sharma", 
          createdAt: new Date(Date.now() - 86400000),
          status: "published"
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* Navbar */}
      <nav style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.png" alt="Lawable" style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", letterSpacing: "-0.03em" }}>Lawable</span>
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: "#334155", textDecoration: "none", padding: "8px 16px", borderRadius: 8 }}>Sign in</Link>
            <Link href="/auth/register" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: 9, background: "linear-gradient(135deg,#1e3a5f,#2563eb)", boxShadow: "0 2px 8px rgba(37,99,235,0.28)" }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-slate-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">The Lawable Blog</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">Insights, strategies, and practical advice for navigating the modern legal landscape in India.</p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-8">
            {[1, 2].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
            <p className="text-slate-500">Check back soon for our latest publications.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post: BlogPost) => (
              <article key={post.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} /> 
                    {new Date(
                      typeof post.createdAt === 'object' && 'seconds' in post.createdAt 
                        ? post.createdAt.seconds * 1000 
                        : post.createdAt
                    ).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5"><User size={14} /> {post.author}</div>
                </div>
                
                <h2 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {post.summary || "Read this comprehensive guide to understand the nuances of this legal topic and how it applies to modern practice."}
                </p>
                
                <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                  Read Article <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
