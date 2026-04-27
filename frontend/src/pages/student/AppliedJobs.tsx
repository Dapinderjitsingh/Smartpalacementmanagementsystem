import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, User, Briefcase, FileCheck, Activity, Bell,
  MapPin, IndianRupee, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useJobApplications, type Application, type ApplicationStatus } from "@/context/JobApplicationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/student/profile", icon: User },
  { label: "Available Jobs", to: "/student/jobs", icon: Briefcase },
  { label: "Applied Jobs", to: "/student/applied", icon: FileCheck },
  { label: "Application Status", to: "/student/status", icon: Activity },
  { label: "Notifications", to: "/student/notifications", icon: Bell },
];

const statusColor: Record<ApplicationStatus, string> = {
  Pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Shortlisted: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  "Interview Scheduled": "bg-primary/10 text-primary border-primary/20",
};

const statusFilters: ApplicationStatus[] = ["Pending", "Shortlisted", "Rejected", "Interview Scheduled"];

export default function AppliedJobs() {
  const { applications } = useJobApplications();
  const [filter, setFilter] = useState<ApplicationStatus | "All">("All");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filtered = filter === "All" ? applications : applications.filter((a) => a.status === filter);

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <h1 className="text-2xl font-bold mb-1">Applied Jobs</h1>
      <p className="text-sm text-muted-foreground mb-6">Track the status of your applications</p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          size="sm"
          variant={filter === "All" ? "default" : "outline"}
          onClick={() => setFilter("All")}
        >
          All ({applications.length})
        </Button>
        {statusFilters.map((s) => {
          const count = applications.filter((a) => a.status === s).length;
          return (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
              {s} ({count})
            </Button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold mb-1">No applications yet</h3>
          <p className="text-sm text-muted-foreground">
            {filter === "All"
              ? "Start by browsing available jobs and applying!"
              : `No applications with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((app, i) => (
            <motion.div
              key={app.job.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border rounded-xl p-5 flex flex-col cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              onClick={() => setSelectedApp(app)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{app.job.title}</h3>
                  <p className="text-sm text-muted-foreground">{app.job.company}</p>
                </div>
                <Badge variant="outline" className={statusColor[app.status]}>
                  {app.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.job.location}</span>
                <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {app.job.salary}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {app.job.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs font-normal">{s}</Badge>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-auto">Applied on {app.appliedDate}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedApp.job.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{selectedApp.job.company}</p>
                  <Badge variant="outline" className={statusColor[selectedApp.status]}>
                    {selectedApp.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Location</p>
                    <p className="font-medium">{selectedApp.job.location}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Salary</p>
                    <p className="font-medium">{selectedApp.job.salary}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Applied On</p>
                    <p className="font-medium">{selectedApp.appliedDate}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Posted</p>
                    <p className="font-medium">{selectedApp.job.posted}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.job.skills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
