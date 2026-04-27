import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "recruiter" | "admin">("student");
  const [submitting, setSubmitting] = useState(false);

  const redirectByRole = (nextRole: string) => {
    if (nextRole === "admin") navigate("/admin/dashboard");
    else if (nextRole === "recruiter") navigate("/company/dashboard");
    else navigate("/student/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      if (!response?.success) throw new Error(response?.message || "Login failed");
      login(response.token, response.user);
      toast.success("Welcome back!");
      redirectByRole(response.user.role);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: { credential?: string }) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
        role,
      });
      if (!response?.success) throw new Error(response?.message || "Google login failed");
      login(response.token, response.user);
      toast.success("Google login successful");
      redirectByRole(response.user.role);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-7 w-7 text-primary" />
            SmartPlacement
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground font-body">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border rounded-xl p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "student" | "recruiter" | "admin")}
              className="w-full h-10 border bg-background rounded-md px-3 text-sm"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember me
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed")} />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
