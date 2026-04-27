import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, User, Briefcase, FileCheck, Activity, Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useState } from "react";
import { BranchSelect } from "@/components/ui/BranchSelect";
import { SkillsTagInput } from "@/components/ui/SkillsTagInput";

const navItems = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/student/profile", icon: User },
  { label: "Available Jobs", to: "/student/jobs", icon: Briefcase },
  { label: "Applied Jobs", to: "/student/applied", icon: FileCheck },
  { label: "Application Status", to: "/student/status", icon: Activity },
  { label: "Notifications", to: "/student/notifications", icon: Bell },
];

export default function StudentProfile() {
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Profile Completion</h3>
          <Progress value={20} className="h-2.5 mb-3" />
          <p className="text-sm text-muted-foreground">20% complete — Fill in all fields to boost your profile.</p>
        </div>

        <form
          className="bg-card border rounded-xl p-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Profile updated!");
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="you@university.edu" disabled />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>University</Label>
              <Input placeholder="Your university" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Input placeholder="B.Tech, M.Tech, etc." />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Engineering Branch</Label>
              <BranchSelect value={branch} onValueChange={setBranch} />
            </div>
            <div className="space-y-2">
              <Label>CGPA</Label>
              <Input type="number" step="0.01" min="0" max="10" placeholder="8.50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Skills</Label>
            <SkillsTagInput value={skills} onChange={setSkills} />
          </div>
          <div className="space-y-2">
            <Label>Resume</Label>
            <Input type="file" accept=".pdf,.doc,.docx" />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
