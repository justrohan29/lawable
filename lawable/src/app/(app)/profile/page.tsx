"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { User, Save, Upload, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [profile, setProfile] = useState({
    fullName: "",
    university: "",
    graduationYear: "",
    currentRole: "",
    linkedInUrl: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "profiles", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error: any) {
        console.error("Failed to fetch profile", error);
        toast.error("Could not load profile data.");
      }
      setFetching(false);
    };
    
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (user && user.id) {
        await updateDoc(doc(db, "profiles", user.id), profile);
      }
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Save error", error);
      toast.error("Failed to update profile.");
    }
    setLoading(false);
  };

  if (fetching) return <div className="p-8 animate-pulse text-slate-500">Loading profile...</div>;

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Profile</h1>
          <p className="text-slate-500">Manage your academic and professional information.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">LinkedIn URL</label>
                <input 
                  type="url" 
                  value={profile.linkedInUrl}
                  onChange={e => setProfile({ ...profile, linkedInUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Academic & Professional</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">University / College</label>
                <input 
                  type="text" 
                  value={profile.university}
                  onChange={e => setProfile({ ...profile, university: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Graduation Year</label>
                <input 
                  type="text" 
                  value={profile.graduationYear}
                  onChange={e => setProfile({ ...profile, graduationYear: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Current Role (e.g. 3rd Year Law Student)</label>
                <input 
                  type="text" 
                  value={profile.currentRole}
                  onChange={e => setProfile({ ...profile, currentRole: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Resume</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">Upload your latest resume to apply for exclusive opportunities directly through the platform.</p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload size={24} className="mx-auto text-slate-400 mb-3" />
              <span className="text-sm font-bold text-blue-600 block mb-1">Click to upload</span>
              <span className="text-xs font-medium text-slate-500">PDF, max 5MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
