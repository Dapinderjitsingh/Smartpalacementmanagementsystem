import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, PlusCircle, FolderOpen, Users, Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { SkillsTagInput } from "@/components/ui/SkillsTagInput";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/company/dashboard", icon: LayoutDashboard },
  { label: "Post Job", to: "/company/post-job", icon: PlusCircle },
  { label: "Manage Jobs", to: "/company/manage-jobs", icon: FolderOpen },
  { label: "View Applicants", to: "/company/applicants", icon: Users },
  { label: "Company Profile", to: "/company/profile", icon: Building2 },
];

const jobTypes = ["Full-time", "Internship", "Part-time", "Contract"];

export default function PostJob() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [jobType, setJobType] = useState("Full-time");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      toast.error("Please add at least one required skill.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Job posted successfully!");
    formRef.current?.reset();
    setSkills([]);
    setJobType("Full-time");
    navigate("/company/manage-jobs");
  };

  return (
    <DashboardLayout navItems={navItems} title="Recruiter Portal">
      <h1 className="text-2xl font-bold mb-2">Post a New Job</h1>
      <p className="text-sm text-muted-foreground mb-6">Fill in the details to create a job listing visible to students</p>

      <form
        ref={formRef}
        className="bg-card border rounded-xl p-6 max-w-2xl space-y-5"
        onSubmit={handleSubmit}
      >
        {/* Job Type toggle */}
        <div className="space-y-2">
          <Label>Job Type <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  jobType === type
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
          <Input id="title" name="title" placeholder="e.g. Frontend Developer" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Required Skills <span className="text-destructive">*</span></Label>
          <SkillsTagInput
            value={skills}
            onChange={setSkills}
            placeholder="Type a skill and press Enter..."
          />
          {skills.length === 0 && (
            <p className="text-xs text-muted-foreground">Add skills like React, Python, SQL…</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary">Salary / Stipend</Label>
            <Input id="salary" name="salary" placeholder={jobType === "Internship" ? "e.g. ₹15,000/month" : "e.g. 8-12 LPA"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
            <Input id="location" name="location" placeholder="e.g. Bangalore or Remote" required />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openings">Number of Openings</Label>
            <Input id="openings" name="openings" type="number" min="1" placeholder="e.g. 5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline <span className="text-destructive">*</span></Label>
            <Input id="deadline" name="deadline" type="date" required />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Posting…" : "Post Job"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/company/manage-jobs")}>
            Cancel
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
