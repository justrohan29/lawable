"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Plus, ArrowLeft, Trash2, Video, FileText } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";

export default function CourseBuilderPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [course, setCourse] = useState<any>({
    title: "",
    description: "",
    price: 0,
    modules: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const docRef = doc(db, "courses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Init empty
        setCourse({ id, title: "New Course", description: "", price: 0, modules: [] });
      }
    } catch (error) {
      console.error("Failed to fetch course", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "courses", id), course);
      toast.success("Course saved successfully!");
    } catch (error) {
      console.error("Save Error", error);
      toast.error("Failed to save course.");
    }
    setSaving(false);
  };

  const addModule = () => {
    const newModule = {
      id: `m_${Date.now()}`,
      title: "New Module",
      lessons: []
    };
    setCourse({ ...course, modules: [...(course.modules || []), newModule] });
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson = {
      id: `l_${Date.now()}`,
      title: "New Lesson",
      duration: 10,
      videoUrl: "",
      pdfUrl: ""
    };
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].lessons.push(newLesson);
    setCourse({ ...course, modules: updatedModules });
  };

  const updateModuleTitle = (index: number, title: string) => {
    const updatedModules = [...course.modules];
    updatedModules[index].title = title;
    setCourse({ ...course, modules: updatedModules });
  };

  const updateLesson = (mIndex: number, lIndex: number, field: string, value: any) => {
    const updatedModules = [...course.modules];
    updatedModules[mIndex].lessons[lIndex][field] = value;
    setCourse({ ...course, modules: updatedModules });
  };

  if (loading) return <div className="p-10 animate-pulse">Loading builder...</div>;

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Course Builder</h1>
            <p className="text-slate-500">Add modules, video URLs, and PDF resources.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Course"}
        </button>
      </div>

      {/* Course Meta */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Course Title</label>
          <input 
            type="text" 
            value={course.title}
            onChange={e => setCourse({...course, title: e.target.value})}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (₹)</label>
          <input 
            type="number" 
            value={course.price}
            onChange={e => setCourse({...course, price: Number(e.target.value)})}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {(course.modules || []).map((mod: any, mIndex: number) => (
          <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
              <span className="font-bold text-slate-400">Module {mIndex + 1}</span>
              <input 
                type="text" 
                value={mod.title}
                onChange={e => updateModuleTitle(mIndex, e.target.value)}
                className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="p-4 space-y-4">
              {mod.lessons.map((lesson: any, lIndex: number) => (
                <div key={lesson.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={e => updateLesson(mIndex, lIndex, "title", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-bold"
                      />
                      <input 
                        type="number" 
                        placeholder="Duration (mins)"
                        value={lesson.duration}
                        onChange={e => updateLesson(mIndex, lIndex, "duration", Number(e.target.value))}
                        className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Video size={16} className="text-slate-400" />
                      <input 
                        type="url" 
                        placeholder="Video URL (e.g. YouTube/Vimeo)"
                        value={lesson.videoUrl || ""}
                        onChange={e => updateLesson(mIndex, lIndex, "videoUrl", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-400" />
                      <input 
                        type="url" 
                        placeholder="PDF Resource URL (e.g. Google Drive Link)"
                        value={lesson.pdfUrl || ""}
                        onChange={e => updateLesson(mIndex, lIndex, "pdfUrl", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => addLesson(mIndex)}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Lesson
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addModule}
        className="mt-8 w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        <Plus size={20} /> Add New Module
      </button>

    </div>
  );
}
