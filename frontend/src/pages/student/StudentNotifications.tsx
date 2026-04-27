import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, User, Briefcase, FileCheck, Activity, Bell,
  CheckCircle2, Calendar, XCircle, Check,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/student/profile", icon: User },
  { label: "Available Jobs", to: "/student/jobs", icon: Briefcase },
  { label: "Applied Jobs", to: "/student/applied", icon: FileCheck },
  { label: "Application Status", to: "/student/status", icon: Activity },
  { label: "Notifications", to: "/student/notifications", icon: Bell },
];

interface Notification {
  id: number;
  type: "job" | "shortlisted" | "interview" | "rejected" | "applied";
  message: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "job", message: "New job posted: Frontend Developer at TechCorp", timestamp: "2026-03-10 09:15 AM", read: false },
  { id: 2, type: "applied", message: "Your application for Data Analyst at DataWise was submitted successfully", timestamp: "2026-03-09 03:42 PM", read: false },
  { id: 3, type: "shortlisted", message: "You've been shortlisted for Backend Engineer at CloudNine", timestamp: "2026-03-09 11:20 AM", read: false },
  { id: 4, type: "interview", message: "Interview scheduled with AI Labs on March 15, 2026 at 10:00 AM", timestamp: "2026-03-08 05:00 PM", read: false },
  { id: 5, type: "rejected", message: "Application for Product Designer at DesignHub was not selected", timestamp: "2026-03-08 02:30 PM", read: true },
  { id: 6, type: "job", message: "New job posted: ML Engineer at AI Labs", timestamp: "2026-03-07 10:00 AM", read: true },
  { id: 7, type: "job", message: "New job posted: DevOps Engineer at InfraMax", timestamp: "2026-03-06 09:00 AM", read: true },
  { id: 8, type: "applied", message: "Your application for Frontend Developer at TechCorp was submitted successfully", timestamp: "2026-03-05 04:15 PM", read: true },
];

const iconMap = {
  job: Briefcase,
  applied: FileCheck,
  shortlisted: CheckCircle2,
  interview: Calendar,
  rejected: XCircle,
};

const colorMap = {
  job: "text-primary",
  applied: "text-amber-400",
  shortlisted: "text-emerald-400",
  interview: "text-cyan-400",
  rejected: "text-destructive",
};

const labelMap = {
  job: "New Job",
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  rejected: "Rejected",
};

const badgeColorMap: Record<string, string> = {
  job: "bg-primary/10 text-primary border-primary/20",
  applied: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  shortlisted: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  interview: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

type FilterType = "all" | "job" | "applied" | "shortlisted" | "interview" | "rejected";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "New Jobs", value: "job" },
    { label: "Applied", value: "applied" },
    { label: "Shortlisted", value: "shortlisted" },
    { label: "Interviews", value: "interview" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-card border rounded-xl p-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all" ? "You're all caught up!" : `No ${filter} notifications.`}
            </p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const Icon = iconMap[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-card border rounded-xl p-4 flex items-start gap-4 transition-all duration-200 hover:shadow-md ${
                  !n.read ? "ring-1 ring-primary/20" : ""
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === "job" ? "bg-primary/10" :
                  n.type === "applied" ? "bg-amber-400/10" :
                  n.type === "shortlisted" ? "bg-emerald-400/10" :
                  n.type === "interview" ? "bg-cyan-400/10" :
                  "bg-destructive/10"
                }`}>
                  <Icon className={`h-5 w-5 ${colorMap[n.type]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-relaxed ${!n.read ? "font-medium" : "text-muted-foreground"}`}>
                      {n.message}
                    </p>
                    <Badge variant="outline" className={`shrink-0 text-[10px] ${badgeColorMap[n.type]}`}>
                      {labelMap[n.type]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-muted-foreground">{n.timestamp}</p>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Check className="h-3 w-3" /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {!n.read && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
