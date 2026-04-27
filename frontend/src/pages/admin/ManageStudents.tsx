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

const students = [
  { id: 1, name: "Priya Sharma", email: "priya@iitd.ac.in", university: "IIT Delhi", branch: "Computer Science", cgpa: "9.2", placed: true },
  { id: 2, name: "Rahul Gupta", email: "rahul@nitt.edu", university: "NIT Trichy", branch: "Electronics", cgpa: "8.5", placed: false },
  { id: 3, name: "Ananya Patel", email: "ananya@bits.ac.in", university: "BITS Pilani", branch: "AI & Data Science", cgpa: "8.9", placed: true },
  { id: 4, name: "Vikram Singh", email: "vikram@iitb.ac.in", university: "IIT Bombay", branch: "Mechanical", cgpa: "7.8", placed: false },
  { id: 5, name: "Sneha Reddy", email: "sneha@iiith.ac.in", university: "IIIT Hyderabad", branch: "Information Technology", cgpa: "9.0", placed: true },
];

export default function ManageStudents() {
  const [search, setSearch] = useState("");
  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.university.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel (TPO)">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Students</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} students</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">University</th>
                <th className="text-left py-3 px-4 font-medium">Branch</th>
                <th className="text-left py-3 px-4 font-medium">CGPA</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{s.university}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.branch}</td>
                  <td className="py-3 px-4 font-medium">{s.cgpa}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className={s.placed ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}>
                      {s.placed ? "Placed" : "Unplaced"}
                    </Badge>
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
