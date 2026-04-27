import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, User, Briefcase, FileCheck, Activity, Bell,
  MapPin, IndianRupee, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useJobApplications, type Job } from "@/context/JobApplicationContext";

const navItems = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/student/profile", icon: User },
  { label: "Available Jobs", to: "/student/jobs", icon: Briefcase },
  { label: "Applied Jobs", to: "/student/applied", icon: FileCheck },
  { label: "Application Status", to: "/student/status", icon: Activity },
  { label: "Notifications", to: "/student/notifications", icon: Bell },
];

const mockJobs: Job[] = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", location: "Bangalore", salary: "8-12 LPA", skills: ["React", "TypeScript", "Tailwind"], posted: "2 days ago" },
  { id: 2, title: "Data Analyst", company: "DataWise", location: "Mumbai", salary: "6-10 LPA", skills: ["Python", "SQL", "Tableau"], posted: "3 days ago" },
  { id: 3, title: "Backend Engineer", company: "CloudNine", location: "Hyderabad", salary: "10-15 LPA", skills: ["Node.js", "PostgreSQL", "AWS"], posted: "1 day ago" },
  { id: 4, title: "Product Designer", company: "DesignHub", location: "Remote", salary: "7-11 LPA", skills: ["Figma", "UI/UX", "Prototyping"], posted: "5 days ago" },
  { id: 5, title: "ML Engineer", company: "AI Labs", location: "Pune", salary: "12-18 LPA", skills: ["Python", "TensorFlow", "MLOps"], posted: "1 day ago" },
  { id: 6, title: "DevOps Engineer", company: "InfraMax", location: "Delhi", salary: "9-14 LPA", skills: ["Docker", "Kubernetes", "CI/CD"], posted: "4 days ago" },
];

export default function AvailableJobs() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { appliedIds, applyToJob } = useJobApplications();

  const filtered = mockJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApply = (job: Job) => {
    const success = applyToJob(job);
    if (success) {
      setExpandedId(null);
      toast.success(`Application submitted successfully to ${job.company}!`);
    } else {
      toast.error("You have already applied to this job.");
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Available Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} jobs found</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search jobs, skills..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((job) => {
          const isApplied = appliedIds.has(job.id);
          const isExpanded = expandedId === job.id;

          return (
            <motion.div key={job.id} layout className="bg-card border rounded-xl p-5 flex flex-col hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {isApplied && <Badge variant="secondary" className="bg-emerald-400/10 text-emerald-400">Applied</Badge>}
                  <span className="text-xs text-muted-foreground">{job.posted}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {job.salary}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs font-normal">{s}</Badge>
                ))}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-body text-muted-foreground">
                        Your profile and resume will be sent to <span className="font-semibold text-foreground">{job.company}</span>. Confirm application?
                      </p>
                      <div className="flex gap-3 mt-3">
                        <Button size="sm" onClick={() => handleApply(job)}>Confirm Application</Button>
                        <Button size="sm" variant="ghost" onClick={() => setExpandedId(null)}>Cancel</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isApplied && !isExpanded && (
                <Button size="sm" className="mt-auto self-start" onClick={() => setExpandedId(job.id)}>Apply Now</Button>
              )}
              {isApplied && !isExpanded && (
                <Button size="sm" className="mt-auto self-start" variant="secondary" disabled>✓ Applied</Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
