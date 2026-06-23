"use client";

import { PLATFORM_STATS, MOCK_STUDENTS, MOCK_MENTORS, MOCK_OPPORTUNITIES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Users, Briefcase, Calendar, TrendingUp, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const pendingMentors = MOCK_MENTORS.filter((m) => !m.isApproved);
  const recentStudents = MOCK_STUDENTS.slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Platform overview and management</p>
        </div>
        <Badge className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5">
          <Shield className="w-3 h-3 mr-1.5" /> Admin Access
        </Badge>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Total Students", value: PLATFORM_STATS.students.toLocaleString(), change: "+124 this month", color: "text-blue-600 bg-blue-50" },
          { icon: Shield, label: "Active Mentors", value: PLATFORM_STATS.mentors, change: `${pendingMentors.length} pending approval`, color: "text-purple-600 bg-purple-50" },
          { icon: Briefcase, label: "Opportunities", value: PLATFORM_STATS.opportunities, change: "12 active this week", color: "text-emerald-600 bg-emerald-50" },
          { icon: CheckCircle, label: "Applications", value: PLATFORM_STATS.applications.toLocaleString(), change: "+89 this week", color: "text-amber-600 bg-amber-50" },
          { icon: Calendar, label: "Sessions Held", value: PLATFORM_STATS.sessions, change: "All time", color: "text-rose-600 bg-rose-50" },
          { icon: TrendingUp, label: "Organizations", value: PLATFORM_STATS.organizations, change: "Registered", color: "text-cyan-600 bg-cyan-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Mentor Approvals */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Approvals
              </CardTitle>
              <Link href="/admin/mentors">
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingMentors.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No pending approvals</p>
            ) : (
              pendingMentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-amber-600 text-white text-xs font-bold">
                      {mentor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{mentor.name}</div>
                    <div className="text-xs text-gray-500">{mentor.designation} · {mentor.organization}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200">Reject</Button>
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0">Approve</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" /> Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/users", label: "Manage Users", icon: Users, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
              { href: "/admin/mentors", label: "Mentor Approvals", icon: Shield, color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
              { href: "/admin/opportunities", label: "Opportunities", icon: Briefcase, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
              { href: "/admin/analytics", label: "Analytics", icon: TrendingUp, color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`p-4 rounded-xl border ${link.color} transition-colors cursor-pointer`}>
                  <link.icon className="w-5 h-5 mb-2" />
                  <div className="text-sm font-medium">{link.label}</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
