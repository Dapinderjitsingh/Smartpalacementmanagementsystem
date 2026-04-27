import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, PlusCircle, FolderOpen, Users, Building2, Pencil, Trash2, Eye,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/company/dashboard", icon: LayoutDashboard },
  { label: "Post Job", to: "/company/post-job", icon: PlusCircle },
  { label: "Manage Jobs", to: "/company/manage-jobs", icon: FolderOpen },
  { label: "View Applicants", to: "/company/applicants", icon: Users },
  { label: "Company Profile", to: "/company/profile", icon: Building2 },
];

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
  applicants: number;
  active: boolean;
}

const initialJobs: Job[] = [
  { id: 1, title: "Frontend Developer", description: "Build and maintain responsive web UIs using React and TypeScript.", location: "Bangalore", salary: "8-12 LPA", deadline: "2026-04-15", applicants: 24, active: true },
  { id: 2, title: "Data Analyst", description: "Analyze datasets and produce business insights using Python and SQL.", location: "Mumbai", salary: "6-10 LPA", deadline: "2026-04-10", applicants: 18, active: true },
  { id: 3, title: "Backend Engineer", description: "Design and develop scalable REST APIs using Node.js and PostgreSQL.", location: "Hyderabad", salary: "10-15 LPA", deadline: "2026-03-20", applicants: 31, active: false },
];

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeleteId(null);
    toast.success("Job listing deleted.");
  };

  const handleToggleActive = (id: number) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const next = !j.active;
        toast.success(next ? "Job listing activated." : "Job listing closed.");
        return { ...j, active: next };
      })
    );
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editJob) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === editJob.id
          ? {
              ...j,
              title: data.get("title") as string,
              description: data.get("description") as string,
              location: data.get("location") as string,
              salary: data.get("salary") as string,
              deadline: data.get("deadline") as string,
            }
          : j
      )
    );
    toast.success("Job updated successfully!");
    setEditJob(null);
  };

  return (
    <DashboardLayout navItems={navItems} title="Recruiter Portal">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {jobs.filter((j) => j.active).length} active &middot; {jobs.filter((j) => !j.active).length} closed
          </p>
        </div>
        <Button onClick={() => navigate("/company/post-job")}>
          <PlusCircle className="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold mb-1">No job listings yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first job posting to start receiving applications.</p>
          <Button onClick={() => navigate("/company/post-job")}>Post a Job</Button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">Job Title</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Applicants</th>
                  <th className="text-left py-3 px-4 font-medium">Deadline</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.salary}</p>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{job.location}</td>
                    <td className="py-3 px-4">
                      <button
                        className="text-primary hover:underline font-medium"
                        onClick={() => navigate("/company/applicants")}
                      >
                        {job.applicants}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{job.deadline}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={job.active ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"}
                      >
                        {job.active ? "Active" : "Closed"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          title="View applicants"
                          onClick={() => navigate("/company/applicants")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          title="Edit job"
                          onClick={() => setEditJob(job)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          title={job.active ? "Close listing" : "Reopen listing"}
                          onClick={() => handleToggleActive(job.id)}
                        >
                          {job.active
                            ? <ToggleRight className="h-4 w-4 text-emerald-400" />
                            : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete job"
                          onClick={() => setDeleteId(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Job Listing</DialogTitle>
          </DialogHeader>
          {editJob && (
            <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input name="title" defaultValue={editJob.title} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" defaultValue={editJob.description} rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input name="location" defaultValue={editJob.location} required />
                </div>
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input name="salary" defaultValue={editJob.salary} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input name="deadline" type="date" defaultValue={editJob.deadline} required />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setEditJob(null)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Job Listing?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            This will permanently remove the listing. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="destructive" onClick={() => deleteId !== null && handleDelete(deleteId)}>
              Yes, Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
