import { Navbar } from "@/components/landing/Navbar";
import { BarChart, Briefcase, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO SECTION */}
      <section className="container py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          About <span className="text-primary">Smart Placement</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          A unified platform connecting students, recruiters, and placement officers
          to simplify hiring, applications, and career growth.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="container grid md:grid-cols-3 gap-8 py-16">
        
        <div className="p-6 rounded-2xl bg-card shadow-md hover:shadow-xl transition">
          <Briefcase className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Job Opportunities</h3>
          <p className="text-muted-foreground mt-2">
            Discover and apply to top company jobs in one place with ease.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card shadow-md hover:shadow-xl transition">
          <Users className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Recruiter Access</h3>
          <p className="text-muted-foreground mt-2">
            Companies can post jobs, shortlist candidates, and manage hiring.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card shadow-md hover:shadow-xl transition">
          <BarChart className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Placement Analytics</h3>
          <p className="text-muted-foreground mt-2">
            Track applications, results, and performance with clear insights.
          </p>
        </div>

      </section>

      {/* STATS SECTION */}
      <section className="bg-muted py-16">
        <div className="container grid md:grid-cols-3 text-center gap-8">
          <div>
            <h2 className="text-4xl font-bold text-primary">500+</h2>
            <p className="text-muted-foreground mt-2">Students Placed</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-primary">100+</h2>
            <p className="text-muted-foreground mt-2">Companies</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-primary">1000+</h2>
            <p className="text-muted-foreground mt-2">Job Listings</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container py-20 text-center">
        <h2 className="text-3xl font-bold">
          Ready to Start Your Career Journey?
        </h2>
        <p className="text-muted-foreground mt-4">
          Join Smart Placement today and explore opportunities.
        </p>
<p>Updated UI for better user experience</p>

        <button className="mt-6 px-6 py-3 bg-primary text-white rounded-xl shadow hover:scale-105 transition">
          Get Started
        </button>
      </section>
    </div>
  );
}
