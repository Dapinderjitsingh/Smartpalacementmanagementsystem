import { useState } from "react";
import { Bell, Check, Briefcase, CheckCircle2, Calendar, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: number;
  type: "job" | "shortlisted" | "interview" | "rejected";
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "job", message: "New job posted: Frontend Developer at TechCorp", time: "2 min ago", read: false },
  { id: 2, type: "shortlisted", message: "You've been shortlisted for Data Analyst at DataWise", time: "1 hour ago", read: false },
  { id: 3, type: "interview", message: "Interview scheduled with CloudNine on Mar 15", time: "3 hours ago", read: false },
  { id: 4, type: "rejected", message: "Application for Designer at DesignHub was not selected", time: "1 day ago", read: true },
  { id: 5, type: "job", message: "New job posted: ML Engineer at AI Labs", time: "2 days ago", read: true },
];

const iconMap = {
  job: Briefcase,
  shortlisted: CheckCircle2,
  interview: Calendar,
  rejected: XCircle,
};

const colorMap = {
  job: "text-primary",
  shortlisted: "text-emerald-400",
  interview: "text-amber-400",
  rejected: "text-destructive",
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.slice(0, 4).map((n) => {
            const Icon = iconMap[n.type];
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors hover:bg-accent/50 ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorMap[n.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${!n.read ? "font-medium" : "text-muted-foreground"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="shrink-0 p-1 rounded hover:bg-accent"
                    title="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="border-t px-4 py-2">
          <Link
            to="/student/notifications"
            className="text-xs text-primary hover:underline block text-center"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
