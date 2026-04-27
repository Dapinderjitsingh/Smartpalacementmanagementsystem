import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const suggestions = [
  "Java", "Python", "C++", "C", "JavaScript", "TypeScript", "React", "Angular",
  "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
  "MongoDB", "SQL", "PostgreSQL", "MySQL", "Firebase",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "Git", "Linux", "REST API", "GraphQL", "HTML", "CSS", "Tailwind CSS",
  "Data Structures", "Algorithms", "System Design",
];

interface SkillsTagInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export function SkillsTagInput({ value, onChange, placeholder = "Type a skill and press Enter..." }: SkillsTagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = input.length > 0
    ? suggestions.filter(
        (s) =>
          s.toLowerCase().includes(input.toLowerCase()) &&
          !value.includes(s)
      ).slice(0, 6)
    : [];

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) addSkill(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1.5 p-2 min-h-[42px] rounded-md border border-input bg-background cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-medium bg-primary/15 text-primary border-primary/20 hover:bg-primary/25 transition-colors"
          >
            {skill}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="rounded-full p-0.5 hover:bg-primary/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg overflow-hidden">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addSkill(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
