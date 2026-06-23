"use client";

import { useAuth } from "@/lib/auth-context";
import { BookOpen, PlayCircle, Award, Trophy, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Welcome back, {user?.name || "Student"}! 👋
        </h1>
        <p className="text-slate-500">Track your progress and pick up where you left off.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Enrolled Courses</p>
          <h3 className="text-3xl font-extrabold text-slate-900">0</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <PlayCircle size={24} />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Lessons Completed</p>
          <h3 className="text-3xl font-extrabold text-slate-900">0</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Hours Learned</p>
          <h3 className="text-3xl font-extrabold text-slate-900">0</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Certificates</p>
          <h3 className="text-3xl font-extrabold text-slate-900">0</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <BookOpen size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No active courses</h3>
            <p className="text-sm text-slate-500 mb-6">You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors">
              Browse Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Column - Upcoming Schedule */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Schedule</h2>
            <Link href="/sessions" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8 text-center">
            <p className="text-slate-500 font-medium">No upcoming sessions scheduled.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
