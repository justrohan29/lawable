"use client";

import { useState } from "react";
import { MOCK_OPPORTUNITIES, MOCK_APPLICATIONS, MOCK_STUDENTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Briefcase, Plus, MapPin, Clock, Users, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG = {
  pending: { color: "status-pending", label: "Pending" },
  shortlisted: { color: "status-shortlisted", label: "Shortlisted" },
  accepted: { color: "status-accepted", label: "Accepted" },
  rejected: { color: "status-rejected", label: "Rejected" },
};

export default function RecruiterApplicationsPage() {
  const allApplications = MOCK_APPLICATIONS.map(a => ({
    ...a,
    opportunity: MOCK_OPPORTUNITIES.find(o => o.id === a.opportunityId),
    student: MOCK_STUDENTS.find(s => s.id === a.studentId),
  }));

  const [applications, setApplications] = useState(allApplications);

  const updateStatus = (id: string, status: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
    toast.success(`Application ${status}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{applications.length} total applications received</p>
        </div>
        <Link href="/recruiter/opportunities/new">
          <Button className="gradient-brand text-white border-0 gap-2">
            <Plus className="w-4 h-4" /> Post Opportunity
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          {["all", "pending", "shortlisted", "accepted"].map(tab => (
            <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>
          ))}
        </TabsList>
        {["all", "pending", "shortlisted", "accepted"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-5 space-y-4">
            {applications
              .filter(a => tab === "all" || a.status === tab)
              .map(app => (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">
                        {app.student?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">{app.student?.name}</div>
                          <div className="text-sm text-gray-500">{app.student?.college} · Year {app.student?.year}</div>
                        </div>
                        <Badge className={`text-xs border ${STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG].color}`}>
                          {STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG].label}
                        </Badge>
                      </div>
                      <div className="text-sm text-indigo-600 font-medium mt-1">{app.opportunity?.title}</div>
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3 italic">
                        &ldquo;{app.coverNote}&rdquo;
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {app.student?.skills.slice(0, 4).map(s => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 justify-end">
                    <Button size="sm" variant="outline" className="text-xs h-8">View Profile</Button>
                    {app.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="text-xs h-8 text-blue-600 border-blue-200"
                          onClick={() => updateStatus(app.id, "shortlisted")}>
                          Shortlist
                        </Button>
                        <Button size="sm" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                          onClick={() => updateStatus(app.id, "accepted")}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-8 text-red-600 border-red-200"
                          onClick={() => updateStatus(app.id, "rejected")}>
                          <X className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
