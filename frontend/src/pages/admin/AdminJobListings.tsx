import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Students", to: "/admin/students", icon: Users },
  { label: "Manage Companies", to: "/admin/companies", icon: Building2 },
  { label: "Job Listings", to: "/admin/jobs", icon: Briefcase },
  { label: "Reports", to: "/admin/reports", icon: FileText },
];

const allJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", location: "Bangalore", applicants: 24, deadline: "2026-04-15", active: true },
  { id: 2, title: "Data Analyst", company: "DataWise", location: "Mumbai", applicants: 18, deadline: "2026-04-10", active: true },
  { id: 3, title: "Backend Engineer", company: "CloudNine", location: "Hyderabad", applicants: 31, deadline: "2026-03-20", active: false },
  { id: 4, title: "Product Designer", company: "DesignHub", location: "Remote", applicants: 9, deadline: "2026-04-25", active: true },
  { id: 5, title: "ML Engineer", company: "AI Labs", location: "Pune", applicants: 41, deadline: "2026-04-30", active: true },
  { id: 6, title: "DevOps Engineer", company: "InfraMax", location: "Delhi", applicants: 15, deadline: "2026-04-05", active: false },
];

export default function AdminJobListings() {
  const [search, setSearch] = useState("");
  const filtered = allJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel (TPO)">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">All active and closed job postings across companies</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Job Title</th>
                <th className="text-left py-3 px-4 font-medium">Company</th>
                <th className="text-left py-3 px-4 font-medium">Location</th>
                <th className="text-left py-3 px-4 font-medium">Applicants</th>
                <th className="text-left py-3 px-4 font-medium">Deadline</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{job.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{job.company}</td>
                  <td className="py-3 px-4 text-muted-foreground">{job.location}</td>
                  <td className="py-3 px-4 text-muted-foreground">{job.applicants}</td>
                  <td className="py-3 px-4 text-muted-foreground">{job.deadline}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="secondary"
                      className={job.active ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"}
                    >
                      {job.active ? "Active" : "Closed"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No jobs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
