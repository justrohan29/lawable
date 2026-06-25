"use client";

import { useAuth } from "@/lib/auth-context";
import AdminDashboard from "./admin-dashboard";
import MentorDashboard from "./mentor-dashboard";
import RecruiterDashboard from "./recruiter-dashboard";
import StudentDashboard from "./student-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  switch (user?.role) {
    case "mentor":
      return <MentorDashboard />;
    case "recruiter":
      return <RecruiterDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "student":
    default:
      return <StudentDashboard />;
  }
}