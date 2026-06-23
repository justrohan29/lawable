"use client";

import { useAuth } from "@/lib/auth-context";
import { MOCK_APPLICATIONS, MOCK_OPPORTUNITIES } from "@/lib/mock-data";
import { Briefcase, MapPin, ExternalLink, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ApplicationsPage() {
  const { user } = useAuth();

  const applications = MOCK_APPLICATIONS.map((app) => ({
    ...app,
    opportunity: MOCK_OPPORTUNITIES.find((o) => o.id === app.opportunityId),
  }));

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending": return { color: "#f59e0b", bg: "#fef3c7", border: "#fde68a", icon: Clock, label: "Under Review" };
      case "shortlisted": return { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: AlertCircle, label: "Shortlisted" };
      case "accepted": return { color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", icon: CheckCircle, label: "Offer Received" };
      case "rejected": return { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: XCircle, label: "Not Selected" };
      default: return { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0", icon: Clock, label: status };
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1000, margin: "0 auto", fontFamily: "var(--font-jakarta,system-ui,sans-serif)" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 8 }}>My Applications</h1>
        <p style={{ fontSize: 16, color: "#64748b", maxWidth: 600 }}>
          Track the status of your internship and job applications.
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,30,58,0.03)", overflow: "hidden" }}>
        {applications.length === 0 ? (
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <Briefcase size={48} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>No applications yet</h3>
            <p style={{ color: "#64748b", marginBottom: 24 }}>You haven't applied to any opportunities yet.</p>
            <Link href="/opportunities" style={{ display: "inline-flex", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Find Opportunities
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {applications.map((app, i) => {
              const status = getStatusInfo(app.status);
              const SIcon = status.icon;
              
              return (
                <div key={app.id} style={{ padding: 24, display: "flex", alignItems: "center", gap: 20, borderBottom: i === applications.length - 1 ? "none" : "1px solid #f1f5f9", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  
                  <div style={{ width: 48, height: 48, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                    <Briefcase size={20} color="#64748b" />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <Link href={`/opportunities/${app.opportunityId}`} style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", textDecoration: "none" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
                        onMouseLeave={e => e.currentTarget.style.color = "#0f172a"}>
                        {app.opportunity?.title}
                      </Link>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: status.bg, border: `1px solid ${status.border}`, color: status.color, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                        <SIcon size={12} /> {status.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 600, color: "#475569" }}>{app.opportunity?.organization}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {app.opportunity?.location}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> Applied {format(new Date(app.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>

                  <Link href={`/opportunities/${app.opportunityId}`} style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#475569"; }}>
                    <ExternalLink size={18} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
