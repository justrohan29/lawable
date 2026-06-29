"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Briefcase, Users, BookOpen, MessageSquare,
  FileText, Calendar, LogOut, ChevronDown, Bell, Video,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ROLE_COLORS: Record<string, string> = {
  student: "bg-blue-500",
  mentor: "bg-purple-500",
  recruiter: "bg-emerald-500",
  admin: "bg-amber-500",
};

const ROLE_LABELS: Record<string, string> = {
  student: "Law Student",
  mentor: "Mentor",
  recruiter: "Recruiter",
  admin: "Administrator",
};

type NavGroup = {
  label: string;
  items: { icon: LucideIcon; label: string; href: string }[];
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  let navGroups: NavGroup[] = [];

  if (user.role === "student") {
    navGroups = [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: BookOpen, label: "Courses", href: "/courses" },
          { icon: Video, label: "Live Sessions", href: "/sessions" },
        ],
      },
      {
        label: "Tools & Community",
        items: [
          { icon: BookOpen, label: "Resource Library", href: "/resources" },
          { icon: MessageSquare, label: "Community", href: "/community" },
        ],
      },
    ];
  } else if (user.role === "mentor") {
    navGroups = [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: Calendar, label: "Sessions", href: "/mentor/sessions" },
        ],
      },
      {
        label: "Tools & Community",
        items: [
          { icon: BookOpen, label: "Resource Library", href: "/resources" },
          { icon: MessageSquare, label: "Community", href: "/community" },
        ],
      },
    ];
  } else if (user.role === "recruiter") {
    navGroups = [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: Briefcase, label: "Opportunities", href: "/recruiter/opportunities" },
          { icon: FileText, label: "Applications", href: "/recruiter/applications" },
        ],
      },
      {
        label: "Tools & Community",
        items: [
          { icon: BookOpen, label: "Resource Library", href: "/resources" },
          { icon: MessageSquare, label: "Community", href: "/community" },
        ],
      },
    ];
  } else if (user.role === "admin") {
    navGroups = [
      {
        label: "Admin Panel",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
          { icon: BookOpen, label: "Course Management", href: "/admin/courses" },
          { icon: Video, label: "Live Sessions", href: "/admin/sessions" },
        ],
      },
      {
        label: "Operations",
        items: [
          { icon: Users, label: "User Directory", href: "/admin/users" },
          { icon: FileText, label: "Blog Editor", href: "/admin/blogs" },
          { icon: Briefcase, label: "Lead CRM", href: "/admin/crm" },
        ],
      },
    ];
  }


  return (
    <div style={{ width: 260, background: "linear-gradient(180deg,#060e1f 0%,#0f1e3a 100%)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100vh", fontFamily: "var(--font-jakarta, system-ui, sans-serif)" }}>
      {/* Brand */}
      <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.png" alt="Lawable" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 8 }} />
        <span style={{ fontWeight: 800, fontSize: 18, color: "#f8fafc", letterSpacing: "-0.02em" }}>Lawable</span>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: "0 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {navGroups.map((group, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 12 }}>
              {group.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {group.items.map(item => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 14, fontWeight: isActive ? 700 : 500, transition: "all .15s", position: "relative", color: isActive ? "#93c5fd" : "#94a3b8", background: isActive ? "rgba(59,130,246,0.15)" : "transparent", borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent" }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#f8fafc"; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; } }}>
                      <item.icon size={18} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Notifications summary (fake) */}
      <div style={{ padding: "0 16px", marginBottom: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", transition: "background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
          <Bell size={16} color="#94a3b8" />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1", flex: 1 }}>Notifications</span>
          <span style={{ background: "#f59e0b", color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 6px", borderRadius: 10 }}>3</span>
        </div>
      </div>

      {/* User profile dropdown */}
      <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <DropdownMenu>
          <DropdownMenuTrigger style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, padding: 8, borderRadius: 10, cursor: "pointer", transition: "background .15s", border: "none", background: "transparent", outline: "none" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <Avatar className="w-9 h-9" style={{ border: "2px solid rgba(255,255,255,0.1)" }}>
              <AvatarFallback className={`text-white text-xs font-bold ${ROLE_COLORS[user.role]}`}>
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{ROLE_LABELS[user.role]}</div>
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={user.role === "student" ? "/profile" : "/mentor/profile"} className="w-full cursor-pointer">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
