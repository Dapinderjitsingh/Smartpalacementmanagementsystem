import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { BranchSelect } from "@/components/ui/BranchSelect";
import { SkillsTagInput } from "@/components/ui/SkillsTagInput";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Role = "student" | "recruiter";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("student");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("branch", branch);
      formData.append("skills", JSON.stringify(skills));
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const response = await api.postForm("/auth/register", formData);
      if (!response?.success) throw new Error(response?.message || "Registration failed");

      login(response.token, response.user);
      toast.success("Registration successful!");
      if (response.user.role === "recruiter") navigate("/company/dashboard");
      else navigate("/student/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-7 w-7 text-primary" />
            SmartPlacement
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground font-body">
            Choose your role and fill in your details
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-card border rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              role === "student"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              role === "recruiter"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Company
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Label>Full Name <span className="text-destructive">*</span></Label>
            <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Email <span className="text-destructive">*</span></Label>
            <Input type="email" placeholder="john@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <Input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
          </div>

          {role === "student" ? (
            <>
              <div className="space-y-2">
                <Label>Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <PasswordStrength password={password} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>University <span className="text-destructive">*</span></Label>
                  <Input placeholder="MIT" required />
                </div>
                <div className="space-y-2">
                  <Label>Course <span className="text-destructive">*</span></Label>
                  <Input placeholder="B.Tech" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Engineering Branch <span className="text-destructive">*</span></Label>
                  <BranchSelect value={branch} onValueChange={setBranch} />
                </div>
                <div className="space-y-2">
                  <Label>CGPA <span className="text-destructive">*</span></Label>
                  <Input type="number" step="0.01" min="0" max="10" placeholder="8.50" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <SkillsTagInput value={skills} onChange={setSkills} />
              </div>
              <div className="space-y-2">
                <Label>Resume</Label>
                <Input type="file" disabled />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Company Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Acme Inc." onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <PasswordStrength password={password} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Industry <span className="text-destructive">*</span></Label>
                  <Input placeholder="Technology" required />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input placeholder="https://acme.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Tell us about your company..." rows={3} />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
