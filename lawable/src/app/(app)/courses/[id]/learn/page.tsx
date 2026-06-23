"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PlayCircle, CheckCircle, ChevronDown, ChevronRight, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function CoursePlayerPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, boolean>>({}); // lessonId -> completed

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCourse(data);
          if (data.modules && data.modules.length > 0) {
            setModules(data.modules);
            if (data.modules[0].lessons && data.modules[0].lessons.length > 0) {
              setActiveLesson(data.modules[0].lessons[0]);
              setExpandedModules({ [data.modules[0].id]: true });
            }
          }
        } else {
          toast.error("Course not found");
        }
      } catch (error) {
        console.error("Failed to fetch course", error);
        toast.error("Could not load course.");
      }
    };
    
    if (id) fetchCourse();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const markLessonComplete = async () => {
    if (!activeLesson || !user) return;
    
    setProgress(prev => ({ ...prev, [activeLesson.id]: true }));
    toast.success("Lesson completed!");

    try {
      // In production, save progress to Firestore
      // await setDoc(doc(db, "progress", `${user.id}_${course.id}`), { ... })
    } catch (e) {
      console.warn("Failed to save progress to Firebase");
    }
  };

  if (!course) return <div className="p-8 text-center animate-pulse">Loading Course Player...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 font-[family-name:var(--font-jakarta)] overflow-hidden">
      
      {/* LEFT PANEL: Video Player */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/courses" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-slate-900 truncate max-w-xl">{course.title}</h1>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-8 flex flex-col max-w-5xl mx-auto w-full">
          {/* Video Placeholder */}
          <div className="w-full aspect-video bg-slate-900 rounded-2xl shadow-lg relative flex items-center justify-center overflow-hidden mb-8 border border-slate-800">
            {activeLesson?.videoUrl ? (
              <video src={activeLesson.videoUrl} controls className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <PlayCircle size={64} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Video Player Placeholder</p>
                <p className="text-slate-600 text-sm mt-2">{activeLesson?.title}</p>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{activeLesson?.title}</h2>
              <p className="text-slate-500 font-medium">Duration: {activeLesson?.duration} minutes</p>
            </div>
            <button 
              onClick={markLessonComplete}
              disabled={progress[activeLesson?.id]}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                progress[activeLesson?.id] 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              }`}
            >
              <CheckCircle size={18} />
              {progress[activeLesson?.id] ? "Completed" : "Mark as Complete"}
            </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Lesson Resources</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Slides & Notes</p>
                  <p className="text-xs text-slate-500">PDF Document</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Curriculum Sidebar */}
      <div className="w-80 border-l border-slate-200 bg-white flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-900">Course Content</h2>
          <div className="mt-2 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: "25%" }} />
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">25% Completed</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {modules.map((mod, index) => (
            <div key={mod.id} className="border-b border-slate-100">
              <button 
                onClick={() => toggleModule(mod.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1">MODULE {index + 1}</p>
                  <h3 className="font-bold text-slate-800 text-sm">{mod.title}</h3>
                </div>
                {expandedModules[mod.id] ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
              </button>
              
              {expandedModules[mod.id] && (
                <div className="bg-slate-50 py-2">
                  {mod.lessons.map((lesson: any, lIndex: number) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const isCompleted = progress[lesson.id];
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left px-4 py-3 flex gap-3 transition-colors ${
                          isActive ? "bg-blue-50 border-l-2 border-blue-600" : "hover:bg-slate-100 border-l-2 border-transparent"
                        }`}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle size={16} className="text-emerald-500" />
                          ) : (
                            <PlayCircle size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold leading-tight ${isActive ? "text-blue-900" : "text-slate-700"}`}>
                            {lIndex + 1}. {lesson.title}
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-1">{lesson.duration} min</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
