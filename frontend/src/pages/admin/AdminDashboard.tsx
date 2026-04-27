import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard, Users, Building2, BarChart3, Briefcase, FileText, TrendingUp, Award,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Students", to: "/admin/students", icon: Users },
  { label: "Manage Companies", to: "/admin/companies", icon: Building2 },
  { label: "Job Listings", to: "/admin/jobs", icon: Briefcase },
  { label: "Reports", to: "/admin/reports", icon: FileText },
];

const widgets = [
  { label: "Total Students", value: "5,234", icon: Users, color: "text-primary bg-primary/10" },
  { label: "Total Companies", value: "218", icon: Building2, color: "text-emerald-400 bg-emerald-400/10" },
  { label: "Total Job Listings", value: "142", icon: Briefcase, color: "text-amber-400 bg-amber-400/10" },
  { label: "Placement Rate", value: "92%", icon: Award, color: "text-cyan-400 bg-cyan-400/10" },
];

const barData = [
  { month: "Jan", placements: 45 },
  { month: "Feb", placements: 62 },
  { month: "Mar", placements: 78 },
  { month: "Apr", placements: 91 },
  { month: "May", placements: 56 },
  { month: "Jun", placements: 34 },
];

const pieData = [
  { name: "Placed", value: 4815 },
  { name: "Unplaced", value: 419 },
];

const trendData = [
  { month: "Jan", companies: 28 },
  { month: "Feb", companies: 35 },
  { month: "Mar", companies: 42 },
  { month: "Apr", companies: 55 },
  { month: "May", companies: 48 },
  { month: "Jun", companies: 62 },
];

const COLORS = ["hsl(217, 91%, 60%)", "hsl(215, 25%, 35%)"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={navItems} title="Admin Panel (TPO)">
      <h1 className="text-2xl font-bold mb-2">Placement Statistics</h1>
      <p className="text-muted-foreground font-body mb-8">Overview of campus placement activity</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {widgets.map((w, i) => (
          <motion.div
            key={w.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-card border rounded-xl p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
          >
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${w.color}`}>
              <w.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{w.value}</p>
              <p className="text-sm text-muted-foreground">{w.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Monthly Placements</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(215, 25%, 22%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 20%, 60%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215, 20%, 60%)" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(215, 25%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
              />
              <Bar dataKey="placements" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Placement Rate</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(215, 25%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{entry.name}: {entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Companies Visiting Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(215, 25%, 22%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 20%, 60%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(215, 20%, 60%)" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(215, 25%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
            />
            <Line type="monotone" dataKey="companies" stroke="hsl(199, 89%, 48%)" strokeWidth={2.5} dot={{ fill: "hsl(199, 89%, 48%)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
