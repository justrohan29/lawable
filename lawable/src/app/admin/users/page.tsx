"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Mail, User as UserIcon } from "lucide-react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/lib/firebase";

type UserRole = "student" | "mentor" | "recruiter" | "admin";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "mentor", label: "Mentor" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
];

function normalizeRole(role: unknown): UserRole {
  return role === "mentor" || role === "recruiter" || role === "admin" ? role : "student";
}

function getDisplayName(user: AdminUser) {
  return user.name.trim() || user.email.split("@")[0] || "Unknown";
}

function getRoleClass(role: UserRole) {
  if (role === "admin") return "bg-purple-50 text-purple-700 border-purple-200";
  if (role === "mentor") return "bg-orange-50 text-orange-700 border-orange-200";
  if (role === "recruiter") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(usersQuery);
      const data = querySnapshot.docs.map((userDoc) => {
        const raw = userDoc.data();

        return {
          id: userDoc.id,
          name: String(raw.name ?? raw.fullName ?? ""),
          email: String(raw.email ?? ""),
          role: normalizeRole(raw.role),
        };
      });

      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const queryText = search.trim().toLowerCase();
    if (!queryText) return users;

    return users.filter((user) => {
      return (
        getDisplayName(user).toLowerCase().includes(queryText) ||
        user.email.toLowerCase().includes(queryText) ||
        user.role.toLowerCase().includes(queryText)
      );
    });
  }, [search, users]);

  const updateRole = async (userId: string, newRole: UserRole) => {
    const existingUser = users.find((user) => user.id === userId);
    if (!existingUser || existingUser.role === newRole) return;

    setUpdatingId(userId);

    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((current) => current.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Failed to update role", error);
      toast.error("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUserRecord = async (user: AdminUser) => {
    const confirmed = window.confirm(`Delete the user record for ${getDisplayName(user)}? This will not delete their Firebase Auth account.`);
    if (!confirmed) return;

    setDeletingId(user.id);

    try {
      await deleteDoc(doc(db, "users", user.id));
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success("User record deleted.");
    } catch (error) {
      console.error("Failed to delete user record", error);
      toast.error("Failed to delete user record.");
    } finally {
      setDeletingId(null);
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
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : filteredUsers.length === 0 ? (
          <EmptyState title="No users match your search" />
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{getDisplayName(user)}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{user.email || "-"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id || deletingId === user.id}
                        onChange={(event) => updateRole(user.id, event.target.value as UserRole)}
                        className={`text-xs font-bold px-2 py-1 rounded-md outline-none border cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${getRoleClass(user.role)}`}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={user.email ? `mailto:${user.email}` : undefined}
                        aria-disabled={!user.email}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors mr-2 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                        title="Email user"
                      >
                        <Mail size={16} />
                      </a>
                      <button
                        type="button"
                        disabled={deletingId === user.id || updatingId === user.id}
                        onClick={() => deleteUserRecord(user)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        title="Delete user record"
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

function EmptyState({ title }: { title: string }) {
  return (
    <div className="p-16 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <UserIcon size={28} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    </div>
  );
}
