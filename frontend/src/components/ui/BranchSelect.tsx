import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const branches = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "AI & Data Science",
  "Cyber Security",
  "Chemical Engineering",
  "Biotechnology",
];

interface BranchSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export function BranchSelect({ value, onValueChange, placeholder = "Select branch" }: BranchSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch} value={branch}>
            {branch}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
