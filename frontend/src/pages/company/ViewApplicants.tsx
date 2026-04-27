import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, PlusCircle, FolderOpen, Users, Building2, FileText,
  Search, Calendar, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/company/dashboard", icon: LayoutDashboard },
  { label: "Post Job", to: "/company/post-job", icon: PlusCircle },
  { label: "Manage Jobs", to: "/company/manage-jobs", icon: FolderOpen },
  { label: "View Applicants", to: "/company/applicants", icon: Users },
  { label: "Company Profile", to: "/company/profile", icon: Building2 },
];

type Status = "Pending" | "Shortlisted" | "Interview Scheduled" | "Rejected" | "Offered";

interface Applicant {
  id: number;
  name: string;
  email: string;
  university: string;
  branch: string;
  skills: string[];
  job: string;
  status: Status;
  cgpa: string;
  appliedDate: string;
  interviewDate?: string;
}

const initialApplicants: Applicant[] = [
  { id: 1, name: "Priya Sharma", email: "priya@iitd.ac.in", university: "IIT Delhi", branch: "Computer Science", skills: ["React", "Node.js", "TypeScript"], job: "Frontend Developer", status: "Pending", cgpa: "9.2", appliedDate: "2026-03-08" },
  { id: 2, name: "Rahul Gupta", email: "rahul@nitt.edu", university: "NIT Trichy", branch: "Electronics", skills: ["Python", "SQL", "Tableau"], job: "Data Analyst", status: "Pending", cgpa: "8.7", appliedDate: "2026-03-07" },
  { id: 3, name: "Ananya Patel", email: "ananya@bits.ac.in", university: "BITS Pilani", branch: "AI & Data Science", skills: ["Java", "Spring Boot", "Kafka"], job: "Backend Engineer", status: "Shortlisted", cgpa: "8.9", appliedDate: "2026-03-06" },
  { id: 4, name: "Vikram Singh", email: "vikram@iitb.ac.in", university: "IIT Bombay", branch: "Mechanical", skills: ["ML", "TensorFlow", "Python"], job: "Data Analyst", status: "Interview Scheduled", cgpa: "9.5", appliedDate: "2026-03-05", interviewDate: "2026-03-15" },
  { id: 5, name: "Sneha Reddy", email: "sneha@iiith.ac.in", university: "IIIT Hyderabad", branch: "Information Technology", skills: ["React", "GraphQL", "AWS"], job: "Frontend Developer", status: "Offered", cgpa: "9.0", appliedDate: "2026-03-04" },
  { id: 6, name: "Arjun Mehta", email: "arjun@vit.ac.in", university: "VIT Vellore", branch: "Computer Science", skills: ["Node.js", "Docker", "PostgreSQL"], job: "Backend Engineer", status: "Rejected", cgpa: "7.8", appliedDate: "2026-03-03" },
];

const statusColors: Record<Status, string> = {
  Pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Shortlisted: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  "Interview Scheduled": "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Offered: "bg-primary/10 text-primary border-primary/20",
};

const allJobs = ["All Jobs", "Frontend Developer", "Data Analyst", "Backend Engineer"];
const allStatuses: Array<Status | "All"> = ["All", "Pending", "Shortlisted", "Interview Scheduled", "Offered", "Rejected"];

export default function ViewApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
  const [scheduleApp, setScheduleApp] = useState<Applicant | null>(null);
  const [interviewDate, setInterviewDate] = useState("");

  const filtered = applicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.university.toLowerCase().includes(search.toLowerCase()) ||
      a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchJob = jobFilter === "All Jobs" || a.job === jobFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchJob && matchStatus;
  });

  const updateStatus = (id: number, status: Status, extra?: Partial<Applicant>) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, ...extra } : a))
    );
    toast.success(`Status updated to "${status}"`);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleApp || !interviewDate) return;
    updateStatus(scheduleApp.id, "Interview Scheduled", { interviewDate });
    toast.success(`Interview scheduled for ${scheduleApp.name} on ${interviewDate}`);
    setScheduleApp(null);
    setInterviewDate("");
  };

  const counts = (allStatuses.slice(1) as Status[]).reduce((acc, s) => {
    acc[s] = applicants.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  return (
    <DashboardLayout navItems={navItems} title="Recruiter Portal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applicants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {applicants.length} total &middot; {counts["Pending"] ?? 0} pending review
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, university, skill..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(allStatuses as string[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as Status | "All")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {s} {s !== "All" && `(${counts[s as Status] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Job filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allJobs.map((j) => (
          <button
            key={j}
            onClick={() => setJobFilter(j)}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              jobFilter === j
                ? "bg-accent border-primary/30 text-foreground"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {j}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold mb-1">No applicants found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{a.name}</h3>
                  <p className="text-xs text-muted-foreground">{a.university} &bull; {a.branch} &bull; CGPA: {a.cgpa}</p>
                </div>
                <Badge variant="outline" className={`shrink-0 text-[11px] ${statusColors[a.status]}`}>
                  {a.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-1">
                Applied for: <span className="text-foreground font-medium">{a.job}</span>
              </p>
              {a.interviewDate && (
                <p className="text-xs text-cyan-400 mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Interview: {a.interviewDate}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {a.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs font-normal">{s}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedApp(a)}>
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> View Profile
                </Button>
                {a.status === "Pending" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(a.id, "Shortlisted")}>
                      Shortlist
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => updateStatus(a.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {a.status === "Shortlisted" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => { setScheduleApp(a); }}>
                      <Calendar className="h-3.5 w-3.5 mr-1.5" /> Schedule Interview
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => updateStatus(a.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {a.status === "Interview Scheduled" && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(a.id, "Offered")}>
                      Extend Offer
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => updateStatus(a.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {(a.status === "Rejected" || a.status === "Offered") && (
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "Pending")}>
                    Reset to Pending
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Profile Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedApp.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">University</p>
                    <p className="font-medium">{selectedApp.university}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Branch</p>
                    <p className="font-medium">{selectedApp.branch}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">CGPA</p>
                    <p className="font-medium">{selectedApp.cgpa}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">Applied On</p>
                    <p className="font-medium">{selectedApp.appliedDate}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                    <p className="text-muted-foreground text-xs mb-1">Email</p>
                    <p className="font-medium">{selectedApp.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.skills.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={`text-xs ${statusColors[selectedApp.status]}`}>
                    {selectedApp.status}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Resume download not available in demo.")}>
                  <FileText className="h-4 w-4 mr-2" /> Download Resume
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={!!scheduleApp} onOpenChange={() => setScheduleApp(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          {scheduleApp && (
            <form onSubmit={handleScheduleInterview} className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">
                Scheduling interview for <span className="font-semibold text-foreground">{scheduleApp.name}</span>
              </p>
              <div className="space-y-2">
                <Label>Interview Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit">Confirm Schedule</Button>
                <Button type="button" variant="outline" onClick={() => setScheduleApp(null)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
