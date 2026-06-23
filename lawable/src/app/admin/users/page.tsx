"use client";

import { useState, useEffect } from "react";
import { Search, Shield, User as UserIcon, Trash2, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Could not load users.");
    }
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const deleteUserRecord = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user record? (This will not delete their Auth account)")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      toast.success("User record deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user record");
    }
  };

  return (
    <div className="p-8 pb-24 font-[family-name:var(--font-jakarta)] max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">User Management</h1>
          <p className="text-slate-500">Manage roles and permissions for all Lawable users.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <UserIcon size={28} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No users found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {u.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-md outline-none border border-slate-200 cursor-pointer ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          u.role === 'mentor' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          u.role === 'recruiter' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors mr-2">
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => deleteUserRecord(u.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
