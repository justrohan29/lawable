"use client";

import { useState, useEffect } from "react";
import { Video, Calendar, Clock, ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const q = query(collection(db, "sessions"), orderBy("startTime", "asc"));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setSessions(data);
    } catch (error: any) {
      console.error("Failed to fetch sessions", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Live Sessions</h1>
        <p className="text-slate-500">Join upcoming masterclasses and mentorship Q&A sessions.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-slate-100 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl">
          <Video size={32} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No upcoming sessions</h3>
          <p className="text-slate-500 mt-1">Check back later for newly scheduled live events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const date = new Date(session.startTime);
            return (
              <div key={session.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Video size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{session.title}</h3>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Calendar size={18} className="text-slate-400" />
                      {date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Clock size={18} className="text-slate-400" />
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <a 
                    href={session.googleMeetLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20"
                  >
                    Join Google Meet <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
