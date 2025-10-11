import Link from "next/link";
import { Download, Mail, Linkedin, FileText, Clock, DollarSign, Rocket, Briefcase, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/metadata";
import { facts } from "@/data/facts";

export const metadata = createMetadata({
  title: "For Recruiters",
  description: "Quick overview, resume downloads, and contact information for recruiters and hiring managers.",
  path: "/recruiter",
});

const tldr = {
  availability: facts.professional.availability,
  location: facts.professional.workPreferences.location,
  experience: `${facts.professional.yearsOfExperience}+ years`,
  specialization: "AI/ML Engineering & Full-Stack Development",
  topSkills: facts.skills.languages.slice(0, 3).concat(facts.skills.frameworks.slice(0, 3)),
  preferredRoles: facts.professional.workPreferences.roles,
  salary: "Competitive (Open to discussion)",
};

export default function RecruiterPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-6">
            For Recruiters
          </h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto">
            Quick overview and resources for recruiters and hiring managers.
          </p>
        </div>

        {/* Production Metrics Dashboard */}
        <Card className="mb-12 border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="h-6 w-6 text-brand-primary" />
              <CardTitle className="text-2xl">Production Portfolio Metrics</CardTitle>
            </div>
            <p className="text-text-2 text-sm">Live systems demonstrating production-ready skills</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-surf-1 rounded-lg border border-border-line">
                <div className="text-3xl font-bold text-brand-primary mb-1">6</div>
                <div className="text-sm text-text-2">Live Projects</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  ● Public URLs
                </Badge>
              </div>
              <div className="text-center p-4 bg-surf-1 rounded-lg border border-border-line">
                <div className="text-3xl font-bold text-green-600 mb-1">2</div>
                <div className="text-sm text-text-2">Client Projects</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  Production Use
                </Badge>
              </div>
              <div className="text-center p-4 bg-surf-1 rounded-lg border border-border-line">
                <div className="text-3xl font-bold text-accent-primary mb-1">9</div>
                <div className="text-sm text-text-2">Total Projects</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  Full Portfolio
                </Badge>
              </div>
              <div className="text-center p-4 bg-surf-1 rounded-lg border border-border-line">
                <div className="text-3xl font-bold text-emerald-600 mb-1">$0</div>
                <div className="text-sm text-text-2">Deployment Cost</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  /month
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-surf-1 rounded-lg border border-border-line">
                <Briefcase className="h-5 w-5 text-brand-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-text-1 mb-1">Real Client Work</p>
                  <p className="text-sm text-text-2">
                    <strong>North Glass LLC</strong> - Live commercial website with AI integration, serving real customers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surf-1 rounded-lg border border-border-line">
                <TrendingUp className="h-5 w-5 text-brand-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-text-1 mb-1">Production-Validated AI</p>
                  <p className="text-sm text-text-2">
                    <strong>Elon AI Agent</strong> - Business plan generator achieving 3-4x speedup, validated by real client usage
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surf-1 rounded-lg border border-border-line">
                <Zap className="h-5 w-5 text-brand-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-text-1 mb-1">Mixed Infrastructure</p>
                  <p className="text-sm text-text-2">
                    5 Vercel deployments (free tier) + 1 Azure Container Apps backend (free tier) - demonstrates multi-cloud expertise and cost optimization
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border-line">
              <Button asChild size="lg" className="w-full">
                <Link href="/projects">
                  View All Live Projects →
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TL;DR Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">TL;DR</CardTitle>
            <p className="text-text-2 text-sm">Quick overview of profile</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-text-1">Availability</p>
                  <p className="text-text-2">{tldr.availability}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-brand-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-text-1">Experience</p>
                  <p className="text-text-2">{tldr.experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-brand-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-text-1">Salary Expectations</p>
                  <p className="text-text-2">{tldr.salary}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium text-text-1 mb-2">Specialization</p>
              <p className="text-text-2">{tldr.specialization}</p>
            </div>

            <div>
              <p className="font-medium text-text-1 mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {tldr.topSkills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-text-1 mb-2">Preferred Roles</p>
              <div className="flex flex-wrap gap-2">
                {tldr.preferredRoles.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Downloads Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <p className="text-text-2 text-sm">Download resume and other materials</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild size="lg" className="w-full justify-start">
              <a href="/resume.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download Full Resume (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full justify-start">
              <a href="/resume-short.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download One-Page Resume (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full justify-start">
              <Link href="/projects">
                <FileText className="mr-2 h-5 w-5" />
                View Portfolio & Projects
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <p className="text-text-2 text-sm">
              Interested in working together? Let&apos;s connect!
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild size="lg" className="w-full justify-start">
              <a href={`mailto:${facts.personal.email}`}>
                <Mail className="mr-2 h-5 w-5" />
                Email: {facts.personal.email}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full justify-start"
            >
              <a
                href="https://linkedin.com/in/omerakben"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                Connect on LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full justify-start">
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Contact Form
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
