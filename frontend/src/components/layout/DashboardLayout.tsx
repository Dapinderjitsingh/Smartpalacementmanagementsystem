import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Menu, X, User, Edit, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Derive profile and dashboard URLs from navItems dynamically
  const dashboardItem = navItems.find((item) =>
    item.label.toLowerCase().includes("dashboard")
  );
  const profileItem = navItems.find((item) =>
    item.label.toLowerCase().includes("profile")
  );
  const dashboardUrl = dashboardItem?.to ?? "/";
  const profileUrl = profileItem?.to ?? dashboardUrl;

  const profilePic =
    user?.profilePic && user.profilePic.startsWith("http")
      ? user.profilePic
      : `${API_BASE_URL.replace("/api", "")}${user?.profilePic || ""}`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b font-bold">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-sm tracking-tight">{title}</span>
          <button
            className="ml-auto lg:hidden p-1 rounded-md hover:bg-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-accent"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-1">
            <DarkModeToggle />
            <NotificationDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user?.profilePic ? (
                  <img
                    src={profilePic}
                    alt={user.name}
                    className="ml-2 h-9 w-9 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer"
                  />
                ) : (
                  <button className="ml-2 h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                    {user?.name?.slice(0, 1).toUpperCase() || "U"}
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate(profileUrl)} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(profileUrl)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(dashboardUrl)} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
