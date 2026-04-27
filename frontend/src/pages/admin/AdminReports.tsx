import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText, TrendingUp, Award, GraduationCap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Students", to: "/admin/students", icon: Users },
  { label: "Manage Companies", to: "/admin/companies", icon: Building2 },
  { label: "Job Listings", to: "/admin/jobs", icon: Briefcase },
  { label: "Reports", to: "/admin/reports", icon: FileText },
];

const placementData = [
  { month: "Jan", placements: 45 },
  { month: "Feb", placements: 62 },
  { month: "Mar", placements: 78 },
  { month: "Apr", placements: 91 },
  { month: "May", placements: 56 },
  { month: "Jun", placements: 103 },
];

const branchData = [
  { name: "Computer Science", value: 38 },
  { name: "Electronics", value: 22 },
  { name: "Mechanical", value: 14 },
  { name: "AI & Data Science", value: 18 },
  { name: "Civil", value: 8 },
];

const applicationTrend = [
  { week: "W1", applications: 120 },
  { week: "W2", applications: 145 },
  { week: "W3", applications: 98 },
  { week: "W4", applications: 167 },
  { week: "W5", applications: 134 },
  { week: "W6", applications: 189 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#06b6d4", "#ec4899"];

const summaryCards = [
  { label: "Placement Rate", value: "92%", icon: Award, color: "text-cyan-400 bg-cyan-400/10" },
  { label: "Avg. Package", value: "9.4 LPA", icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10" },
  { label: "Students Placed", value: "4,815", icon: GraduationCap, color: "text-primary bg-primary/10" },
  { label: "Top Recruiters", value: "42", icon: Building2, color: "text-amber-400 bg-amber-400/10" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function AdminReports() {
  return (
    <DashboardLayout navItems={navItems} title="Admin Panel (TPO)">
      <h1 className="text-2xl font-bold mb-2">Placement Reports</h1>
      <p className="text-muted-foreground font-body mb-8">Analytics and insights across all placement activities</p>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-card border rounded-xl p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
          >
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly placements bar chart */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Monthly Placements</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={placementData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar dataKey="placements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Branch-wise pie chart */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Placements by Branch (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={branchData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {branchData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {branchData.map((entry, index) => (
              <span key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Application trend */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Weekly Application Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={applicationTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
            <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
