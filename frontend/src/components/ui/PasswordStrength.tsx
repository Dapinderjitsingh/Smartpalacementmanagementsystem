import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 20, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { score: 40, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score: 60, label: "Good", color: "bg-amber-400" };
  if (score <= 4) return { score: 80, label: "Strong", color: "bg-emerald-400" };
  return { score: 100, label: "Very Strong", color: "bg-emerald-500" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);

  return (
    <div className="space-y-1">
      <Progress value={score} className={`h-1.5 ${color}`} />
      <p className="text-xs text-muted-foreground">Password strength: <span className="font-medium">{label}</span></p>
    </div>
  );
}
