import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JobApplicationProvider } from "@/context/JobApplicationContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import StudentDashboard from "./pages/student/StudentDashboard";
import AvailableJobs from "./pages/student/AvailableJobs";
import AppliedJobs from "./pages/student/AppliedJobs";
import StudentProfile from "./pages/student/StudentProfile";
import StudentNotifications from "./pages/student/StudentNotifications";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import PostJob from "./pages/company/PostJob";
import ManageJobs from "./pages/company/ManageJobs";
import ViewApplicants from "./pages/company/ViewApplicants";
import CompanyProfile from "./pages/company/CompanyProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCompanies from "./pages/admin/ManageCompanies";
import AdminJobListings from "./pages/admin/AdminJobListings";
import AdminReports from "./pages/admin/AdminReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <JobApplicationProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Student */}
              <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/jobs" element={<ProtectedRoute><AvailableJobs /></ProtectedRoute>} />
              <Route path="/student/applied" element={<ProtectedRoute><AppliedJobs /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
              <Route path="/student/status" element={<ProtectedRoute><AppliedJobs /></ProtectedRoute>} />
              <Route path="/student/notifications" element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>} />

              {/* Company */}
              <Route path="/company/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/company/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
              <Route path="/company/manage-jobs" element={<ProtectedRoute><ManageJobs /></ProtectedRoute>} />
              <Route path="/company/applicants" element={<ProtectedRoute><ViewApplicants /></ProtectedRoute>} />
              <Route path="/company/profile" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
              <Route path="/admin/companies" element={<ProtectedRoute><ManageCompanies /></ProtectedRoute>} />
              <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobListings /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </JobApplicationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

