import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText, Search, Globe,
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

const companies = [
  { id: 1, name: "TechCorp", industry: "Technology", jobs: 3, website: "techcorp.com", status: "Active" },
  { id: 2, name: "DataWise", industry: "Analytics", jobs: 2, website: "datawise.io", status: "Active" },
  { id: 3, name: "CloudNine", industry: "Cloud Services", jobs: 4, website: "cloudnine.dev", status: "Active" },
  { id: 4, name: "DesignHub", industry: "Design", jobs: 1, website: "designhub.co", status: "Inactive" },
  { id: 5, name: "AI Labs", industry: "AI/ML", jobs: 2, website: "ailabs.ai", status: "Active" },
];

export default function ManageCompanies() {
  const [search, setSearch] = useState("");
  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel (TPO)">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} companies</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search companies..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Company</th>
                <th className="text-left py-3 px-4 font-medium">Industry</th>
                <th className="text-left py-3 px-4 font-medium">Active Jobs</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Website</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{c.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{c.industry}</td>
                  <td className="py-3 px-4 text-muted-foreground">{c.jobs}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className={c.status === "Active" ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" /> {c.website}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
