"use client";

import { useAuth } from "@/lib/auth-context";
import { MOCK_OPPORTUNITIES, MOCK_STUDENTS, PLATFORM_STATS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Users, TrendingUp, Plus, Eye, MapPin, Clock } from "lucide-react";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const myOpps = MOCK_OPPORTUNITIES.filter((o) => o.type === "internship").slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Hub</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user?.name} — {user?.email}</p>
        </div>
        <Link href="/recruiter/opportunities/new">
          <Button className="gradient-brand text-white border-0 gap-2">
            <Plus className="w-4 h-4" /> Post Opportunity
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: "Active Listings", value: myOpps.length, color: "text-blue-600 bg-blue-50" },
          { icon: Users, label: "Total Applicants", value: myOpps.reduce((a, o) => a + o.applicants, 0), color: "text-purple-600 bg-purple-50" },
          { icon: TrendingUp, label: "Shortlisted", value: 14, color: "text-emerald-600 bg-emerald-50" },
          { icon: Eye, label: "Profile Views", value: 287, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" /> My Listings
            </CardTitle>
            <Link href="/recruiter/opportunities">
              <Button variant="ghost" size="sm">Manage All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {myOpps.map((opp) => (
            <div key={opp.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{opp.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {opp.duration}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{opp.applicants} applicants</div>
                <Badge className={opp.isActive ? "bg-emerald-50 text-emerald-700 text-xs" : "bg-gray-100 text-gray-500 text-xs"}>
                  {opp.isActive ? "Active" : "Closed"}
                </Badge>
              </div>
              <Link href={`/recruiter/applications?opp=${opp.id}`}>
                <Button size="sm" variant="outline" className="text-xs">Review</Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
