import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Job {
  id: number;
  
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  posted: string;
}

export type ApplicationStatus = "Pending" | "Shortlisted" | "Rejected" | "Interview Scheduled";

export interface Application {
  job: Job;
  appliedDate: string;
  status: ApplicationStatus;
}

interface JobApplicationContextType {
  applications: Application[];
  appliedIds: Set<number>;
  applyToJob: (job: Job) => boolean;
}

const JobApplicationContext = createContext<JobApplicationContextType | null>(null);

export function JobApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  const applyToJob = useCallback((job: Job): boolean => {
    if (appliedIds.has(job.id)) return false;
    setAppliedIds((prev) => new Set(prev).add(job.id));
    setApplications((prev) => [
      {
        job,
        appliedDate: new Date().toISOString().split("T")[0],
        status: "Pending",
      },
      ...prev,
    ]);
    return true;
  }, [appliedIds]);

  return (
    <JobApplicationContext.Provider value={{ applications, appliedIds, applyToJob }}>
      {children}
    </JobApplicationContext.Provider>
  );
}

export function useJobApplications() {
  const ctx = useContext(JobApplicationContext);
  if (!ctx) throw new Error("useJobApplications must be used within JobApplicationProvider");
  return ctx;
}
