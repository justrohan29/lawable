"use client";

import { useState } from "react";
import { MOCK_RESOURCES } from "@/lib/mock-data";
import { Search, Download, FileText, File, Video, Briefcase, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = MOCK_RESOURCES.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || res.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (title: string) => {
    toast.success(`Downloading: ${title}`, {
      description: "Check your downloads folder in a moment.",
    });
  };

  const getIconForType = (type: string, color: string) => {
    if (type === "pdf") return <FileText size={20} color={color} />;
    if (type === "video") return <Video size={20} color={color} />;
    return <File size={20} color={color} />;
  };

  const categories = [
    { id: "all", label: "All Resources", icon: "📚", color: "#3b82f6", bg: "#eff6ff" },
    { id: "drafting", label: "Drafting", icon: "✍️", color: "#8b5cf6", bg: "#f3e8ff" },
    { id: "interview_prep", label: "Interview Prep", icon: "🎤", color: "#10b981", bg: "#ecfdf5" },
    { id: "guides", label: "Guides", icon: "🧭", color: "#f59e0b", bg: "#fef3c7" },
  ];

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>Resource Library</h1>
        <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600 }}>
          Download premium legal drafts, interview guides, and industry reports curated by experts.
        </p>
      </div>

      {/* ── Categories Row ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, overflowX: "auto", paddingBottom: 8 }}>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, border: `1px solid ${category === c.id ? c.color : "#e2e8f0"}`, background: category === c.id ? c.bg : "#fff", minWidth: "max-content", cursor: "pointer", transition: "all .15s", boxShadow: category === c.id ? "0 4px 12px rgba(0,0,0,0.05)" : "none" }}>
            <span style={{ fontSize: 18 }}>{c.icon}</span>
            <span style={{ fontSize: 14, fontWeight: category === c.id ? 800 : 600, color: category === c.id ? c.color : "#475569" }}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 32, position: "relative", maxWidth: 400 }}>
        <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
        <input type="text" placeholder="Search templates, guides..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", fontSize: 15, outline: "none", transition: "border .15s", boxShadow: "0 2px 8px rgba(15,30,58,0.03)" }}
          onFocus={e => e.target.style.borderColor = "#3b82f6"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        />
      </div>

      {/* ── Popular / Featured ── */}
      {category === "all" && search === "" && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TrendingUp size={20} color="#ef4444" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Trending This Week</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {MOCK_RESOURCES.slice(0, 2).map((res) => (
              <div key={`feat-${res.id}`} style={{ background: "linear-gradient(135deg,#060e1f,#1e3a5f)", borderRadius: 20, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(15,30,58,0.2)" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.15)", color: "#93c5fd", padding: "4px 8px", borderRadius: 6, display: "inline-block", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                    {res.category}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 8, maxWidth: 300 }}>{res.title}</h3>
                  <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 }}>
                    <Briefcase size={14} /> By Lawable Experts
                  </div>
                </div>
                <button onClick={() => handleDownload(res.title)}
                  style={{ background: "#3b82f6", color: "#fff", width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.4)", transition: "transform .15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map((res) => {
          let color = "#3b82f6", bg = "#eff6ff", border = "#bfdbfe";
          if (res.fileType === "pdf") { color = "#ef4444"; bg = "#fef2f2"; border = "#fecaca"; }
          if (res.fileType === "video") { color = "#8b5cf6"; bg = "#f3e8ff"; border = "#ddd6fe"; }

          return (
            <div key={res.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 2px 8px rgba(15,30,58,0.03)" }} className="card-hover">
              <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, background: bg, borderRadius: 12, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getIconForType(res.fileType, color)}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, textTransform: "uppercase" }}>
                    {res.fileType}
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.4, marginBottom: 8 }}>{res.title}</h3>
                <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                  <Briefcase size={12} /> Lawable Experts
                </div>
              </div>
              <div style={{ padding: 16, borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
                <button onClick={() => handleDownload(res.title)}
                  style={{ width: "100%", padding: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, color: "#0f172a", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <Download size={16} color="#3b82f6" /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
