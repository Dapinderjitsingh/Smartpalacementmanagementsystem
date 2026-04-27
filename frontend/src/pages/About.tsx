import { Navbar } from "@/components/landing/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container py-16">
        <h1 className="text-3xl font-bold">About Smart Placement</h1>
        <p className="mt-4 text-muted-foreground max-w-3xl">
          Smart Placement connects students, recruiters, and placement officers
          through one unified portal. Students can discover jobs and track applications,
          companies can post openings and shortlist talent, and teams can manage placements
          with clear visibility.
        </p>
      </section>
    </div>
  );
}
