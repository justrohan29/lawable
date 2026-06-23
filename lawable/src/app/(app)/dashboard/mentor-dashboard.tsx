"use client";

import { useAuth } from "@/lib/auth-context";
import { MOCK_SESSIONS, MOCK_STUDENTS, SESSION_TYPE_LABELS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Calendar, Star, Users, Clock, CheckCircle, Video } from "lucide-react";
import { format } from "date-fns";

export default function MentorDashboard() {
  const { user } = useAuth();
  const sessions = MOCK_SESSIONS.map((s) => ({
    ...s,
    student: MOCK_STUDENTS.find((st) => st.id === s.studentId),
  }));
  const upcoming = sessions.filter((s) => s.status === "confirmed" || s.status === "pending");
  const completed = sessions.filter((s) => s.status === "completed");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Link href="/mentor/profile">
          <Button className="gradient-brand text-white border-0">Edit Profile</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Sessions", value: "47", color: "text-purple-600 bg-purple-50" },
          { icon: Star, label: "Rating", value: "4.9 / 5", color: "text-yellow-600 bg-yellow-50" },
          { icon: Calendar, label: "Upcoming", value: upcoming.length, color: "text-blue-600 bg-blue-50" },
          { icon: CheckCircle, label: "Completed", value: completed.length, color: "text-emerald-600 bg-emerald-50" },
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
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" /> Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No upcoming sessions</p>
          ) : (
            upcoming.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
                    {session.student?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{session.student?.name}</div>
                  <div className="text-sm text-purple-700">{SESSION_TYPE_LABELS[session.type]}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {format(new Date(session.scheduledAt), "EEE, d MMM 'at' h:mm a")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge className={`text-xs border ${session.status === "confirmed" ? "status-confirmed" : "status-pending"}`}>
                    {session.status}
                  </Badge>
                  {session.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200">Decline</Button>
                      <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0">Confirm</Button>
                    </div>
                  )}
                  {session.meetLink && session.status === "confirmed" && (
                    <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 gap-1">
                      <Video className="w-3 h-3" /> Join
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
