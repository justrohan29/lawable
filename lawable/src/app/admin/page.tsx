"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Briefcase, FileText, RefreshCw, Users } from "lucide-react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/lib/firebase";
import { getBlogs } from "@/lib/blog";
import { getLeads } from "@/lib/crm";
import { Blog } from "@/types/blog";
import { Lead } from "@/types/lead";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Activity = {
  id: string;
  label: string;
  meta: string;
  href: string;
};

function getDisplayName(data: Record<string, unknown>) {
  return String(data.name ?? data.fullName ?? data.email ?? "Unknown");
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const [userSnapshot, blogData, leadData] = await Promise.all([
        getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(6))),
        getBlogs(),
        getLeads(),
      ]);

      setUsers(
        userSnapshot.docs.map((userDoc) => {
          const data = userDoc.data();
          return {
            id: userDoc.id,
            name: getDisplayName(data),
            email: String(data.email ?? ""),
            role: String(data.role ?? "student"),
          };
        })
      );
      setBlogs(blogData as Blog[]);
      setLeads(leadData);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
      toast.error("Could not load dashboard metrics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const activities = useMemo<Activity[]>(() => {
    const recentBlogs = blogs.slice(0, 3).map((blog) => ({
      id: `blog-${blog.id}`,
      label: blog.title,
      meta: `Blog ${blog.status}`,
      href: `/admin/blogs/edit/${blog.id}`,
    }));

    const recentLeads = leads.slice(0, 3).map((lead) => ({
      id: `lead-${lead.id}`,
      label: lead.name,
      meta: `Lead ${lead.status}`,
      href: "/admin/crm",
    }));

    return [...recentLeads, ...recentBlogs].slice(0, 5);
  }, [blogs, leads]);

  const publishedBlogs = blogs.filter((blog) => blog.status === "published").length;
  const openLeads = leads.filter((lead) => lead.status !== "closed" && lead.status !== "converted").length;
  const convertedLeads = leads.filter((lead) => lead.status === "converted").length;

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Operational overview for users, content, and CRM.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadDashboard();
          }}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} /> {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Users} label="Total Users" value={users.length} href="/admin/users" />
        <MetricCard icon={BookOpen} label="Total Blogs" value={blogs.length} href="/admin/blogs" helper={`${publishedBlogs} published`} />
        <MetricCard icon={Briefcase} label="Total Leads" value={leads.length} href="/admin/crm" helper={`${openLeads} open`} />
        <MetricCard icon={FileText} label="Converted Leads" value={convertedLeads} href="/admin/crm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-950">Recent Activity</h2>
            <Link href="/admin/crm" className="text-sm font-semibold text-blue-600">View CRM</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">No recent activity yet.</div>
            ) : (
              activities.map((activity) => (
                <Link key={activity.id} href={activity.href} className="block p-4 hover:bg-slate-50">
                  <div className="font-medium text-slate-950">{activity.label}</div>
                  <div className="text-sm text-slate-500">{activity.meta}</div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-950">User Management</h2>
            <Link href="/admin/users" className="text-sm font-semibold text-blue-600">Manage Users</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">No users found.</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium text-slate-950">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700">{user.role}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  href,
  helper,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  href: string;
  helper?: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-50">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={20} />
        </div>
        <span className="text-2xl font-bold text-slate-950">{value}</span>
      </div>
      <div className="mt-4 text-sm font-semibold text-slate-700">{label}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </Link>
  );
}