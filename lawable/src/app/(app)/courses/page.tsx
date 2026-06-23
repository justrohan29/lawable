"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, Play, CheckCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, "courses"), where("status", "==", "published"));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setCourses(data);
    } catch (error: any) {
      console.error("Failed to fetch courses", error);
      toast.error("Could not load courses.");
    }
    setLoading(false);
  };

  const enroll = (id: string) => {
    toast.success("Successfully Enrolled! Check your dashboard.");
  };

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Legal Courses</h1>
        <p className="text-slate-500">Accelerate your career with premium courses created by top legal professionals.</p>
      </div>

      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search courses..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 shadow-sm rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl">
          <BookOpen size={32} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No courses available</h3>
          <p className="text-slate-500 mt-1">Check back later for new premium legal courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-200">
                {/* Fallback image if no thumbnail */}
                <BookOpen size={40} className="text-slate-300" />
                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600">
                    <Play size={20} className="ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{course.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="font-extrabold text-slate-900">
                    {course.price > 0 ? `₹${course.price.toLocaleString()}` : "Free"}
                  </span>
                  
                  <Link 
                    href={`/courses/${course.id}/learn`}
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
