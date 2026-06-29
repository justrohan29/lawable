"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, RefreshCw, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { getLeads, updateLeadStatus } from "@/lib/crm";
import { Lead, LEAD_STATUSES, LeadStatus } from "@/types/lead";

function formatDate(value: unknown) {
  if (!value) return "-";

  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toLocaleDateString();
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-slate-50 text-slate-700 border-slate-200",
  interested: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminCrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast.error("Could not load leads.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLeads();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.message.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [leads, search, statusFilter]);

  const statusCounts = useMemo(() => {
    return LEAD_STATUSES.reduce<Record<LeadStatus, number>>(
      (counts, status) => ({ ...counts, [status.value]: leads.filter((lead) => lead.status === status.value).length }),
      { new: 0, contacted: 0, interested: 0, converted: 0, closed: 0 }
    );
  }, [leads]);

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    setUpdatingId(leadId);

    try {
      await updateLeadStatus(leadId, status);
      setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
      toast.success("Lead status updated.");
    } catch (error) {
      console.error("Failed to update lead status:", error);
      toast.error("Could not update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-8">Loading CRM...</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Lead CRM</h1>
          <p className="mt-1 text-sm text-slate-500">Track contact form inquiries from first touch to conversion.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadLeads();
          }}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} /> {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {LEAD_STATUSES.map((status) => (
          <button
            key={status.value}
            type="button"
            onClick={() => setStatusFilter(statusFilter === status.value ? "all" : status.value)}
            className={`rounded-lg border p-4 text-left transition ${
              statusFilter === status.value ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="text-xs font-semibold uppercase text-slate-500">{status.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-950">{statusCounts[status.value]}</div>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search leads by name, email, or message"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as LeadStatus | "all")}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center text-slate-500">
            <Users className="mb-3 text-slate-300" size={36} />
            No leads match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 text-left font-semibold">Lead</th>
                  <th className="p-3 text-left font-semibold">Message</th>
                  <th className="p-3 text-left font-semibold">Source</th>
                  <th className="p-3 text-left font-semibold">Created</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-100 align-top">
                    <td className="p-3">
                      <div className="font-semibold text-slate-950">{lead.name}</div>
                      <a href={`mailto:${lead.email}`} className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                        <Mail size={12} /> {lead.email}
                      </a>
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Phone size={12} /> {lead.phone}
                        </a>
                      ) : null}
                    </td>
                    <td className="max-w-md p-3 text-slate-700">{lead.message}</td>
                    <td className="p-3 text-slate-600">{lead.source}</td>
                    <td className="p-3 text-slate-600">{formatDate(lead.createdAt)}</td>
                    <td className="p-3">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(event) => handleStatusChange(lead.id, event.target.value as LeadStatus)}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[lead.status]}`}
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}