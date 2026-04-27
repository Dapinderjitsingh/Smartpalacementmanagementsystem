import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  BarChart3,
  FileText,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Easy Job Applications",
    desc: "Apply to campus placements with a single click. Your profile and resume are sent instantly.",
  },
  {
    icon: BarChart3,
    title: "Centralized Management",
    desc: "One platform for students, recruiters, and placement officers to coordinate seamlessly.",
  },
  {
    icon: Building2,
    title: "Recruiter Dashboard",
    desc: "Post jobs, manage listings, review applicants, and shortlist candidates efficiently.",
  },
  {
    icon: CheckCircle2,
    title: "Application Tracking",
    desc: "Track every application from submission to final offer with real-time status updates.",
  },
];

const stats = [
  { value: "5,000+", label: "Students Registered" },
  { value: "200+", label: "Companies Partnered" },
  { value: "92%", label: "Placement Rate" },
  { value: "1,200+", label: "Jobs Posted" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
          >
            Campus Placements,{" "}
            <span className="text-primary">Simplified</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto"
          >
            A single source of truth for students, recruiters, and placement
            officers. Apply, recruit, and manage — all in one professional
            platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-card py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="mt-3 text-muted-foreground font-body max-w-lg mx-auto">
              Built for the complete placement lifecycle — from job posting to
              final offer.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="bg-background border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground font-body">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-card py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">Ready to Get Placed?</h2>
          <p className="mt-3 text-muted-foreground font-body max-w-md mx-auto">
            Join thousands of students and hundreds of companies already using
            SmartPlacement.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">
                <GraduationCap className="mr-2 h-4 w-4" /> I'm a Student
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">
                <Building2 className="mr-2 h-4 w-4" /> I'm a Recruiter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="border-t py-12 bg-card">
        <div className="container grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              SmartPlacement
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Connecting talent with opportunity through modern campus placement
              management.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-foreground transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@smartplacement.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2026 SmartPlacement. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
