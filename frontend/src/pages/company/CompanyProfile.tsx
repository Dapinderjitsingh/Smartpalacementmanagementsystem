import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, PlusCircle, FolderOpen, Users, Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", to: "/company/dashboard", icon: LayoutDashboard },
  { label: "Post Job", to: "/company/post-job", icon: PlusCircle },
  { label: "Manage Jobs", to: "/company/manage-jobs", icon: FolderOpen },
  { label: "View Applicants", to: "/company/applicants", icon: Users },
  { label: "Company Profile", to: "/company/profile", icon: Building2 },
];

const companySizes = ["1–50", "51–200", "201–500", "501–1000", "1000+"];

export default function CompanyProfile() {
  const [companySize, setCompanySize] = useState("201–500");

  return (
    <DashboardLayout navItems={navItems} title="Recruiter Portal">
      <h1 className="text-2xl font-bold mb-2">Company Profile</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your company information visible to students</p>

      <form
        className="max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Company profile updated!");
        }}
      >
        {/* Basic Info */}
        <div className="bg-card border rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-base">Basic Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. TechCorp" defaultValue="TechCorp" required />
            </div>
            <div className="space-y-2">
              <Label>Industry <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Technology" defaultValue="Technology" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Founded Year</Label>
              <Input type="number" placeholder="e.g. 2010" defaultValue="2012" min="1800" max="2030" />
            </div>
            <div className="space-y-2">
              <Label>Headquarters</Label>
              <Input placeholder="e.g. Bangalore, India" defaultValue="Bangalore, India" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Company Size (Employees)</Label>
            <div className="flex flex-wrap gap-2">
              {companySizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setCompanySize(size)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    companySize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>About the Company</Label>
            <Textarea
              placeholder="Tell students about your company, culture, and what makes it a great place to work..."
              rows={4}
              defaultValue="TechCorp is a leading technology company specializing in cloud solutions and enterprise software. We believe in a culture of innovation, collaboration, and continuous learning."
            />
          </div>
        </div>

        {/* Contact & Links */}
        <div className="bg-card border rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-base">Contact &amp; Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Email <span className="text-destructive">*</span></Label>
              <Input type="email" placeholder="hr@yourcompany.com" defaultValue="hr@techcorp.com" required />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Website</Label>
              <Input placeholder="https://yourcompany.com" defaultValue="https://techcorp.com" />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn Page</Label>
              <Input placeholder="https://linkedin.com/company/..." />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-base">Company Logo</h3>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              TC
            </div>
            <div className="space-y-2 flex-1">
              <Input type="file" accept="image/png,image/jpeg,image/svg+xml" />
              <p className="text-xs text-muted-foreground">PNG, JPEG or SVG. Max 2MB. Recommended 200×200px.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => toast.info("Changes discarded.")}>
            Discard
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
