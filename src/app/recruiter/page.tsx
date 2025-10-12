import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { facts } from "@/data/facts";
import { createMetadata } from "@/lib/metadata";
import {
  Briefcase,
  Clock,
  DollarSign,
  Download,
  FileText,
  Linkedin,
  Mail,
  Rocket,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = createMetadata({
  title: "For Recruiters",
  description:
    "Quick overview, resume downloads, and contact information for recruiters and hiring managers.",
  path: "/recruiter",
});

const tldr = {
  availability: facts.professional.availability,
  location: facts.professional.workPreferences.location,
  experience: `${facts.professional.yearsOfExperience}+ years`,
  specialization: "AI/ML Engineering & Full-Stack Development",
  topSkills: facts.skills.languages
    .slice(0, 3)
    .concat(facts.skills.frameworks.slice(0, 3)),
  preferredRoles: facts.professional.workPreferences.roles,
  salary: "Competitive (Open to discussion)",
};

export default function RecruiterPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          {/* Profile Photo */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-brand-primary shadow-lg">
              <Image
                src="/assets/me.jpeg"
                alt="Omer Akben - Profile Photo"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

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
              <CardTitle className="text-2xl">
                Production Portfolio Metrics
              </CardTitle>
            </div>
            <p className="text-text-2 text-sm">
              Live systems demonstrating production-ready skills
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-surf-1 rounded-lg border border-border-line">
                <div className="text-3xl font-bold text-brand-primary mb-1">
                  6
                </div>
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
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  9
                </div>
                <div className="text-sm text-text-2">Total Projects</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  Full Portfolio
                </Badge>
              </div>
              <div className="text-center p-4 bg-surf-1 rounded-lg border border-border-line">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  $0
                </div>
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
                  <p className="font-medium text-text-1 mb-1">
                    Real Client Work
                  </p>
                  <p className="text-sm text-text-2">
                    <strong>North Glass LLC</strong> - Live commercial website
                    with AI integration, serving real customers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surf-1 rounded-lg border border-border-line">
                <TrendingUp className="h-5 w-5 text-brand-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-text-1 mb-1">
                    Production-Validated AI
                  </p>
                  <p className="text-sm text-text-2">
                    <strong>Elon AI Agent</strong> - Business plan generator
                    achieving 3-4x speedup, validated by real client usage
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surf-1 rounded-lg border border-border-line">
                <Zap className="h-5 w-5 text-brand-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-text-1 mb-1">
                    Mixed Infrastructure
                  </p>
                  <p className="text-sm text-text-2">
                    5 Vercel deployments (free tier) + 1 Azure Container Apps
                    backend (free tier) - demonstrates multi-cloud expertise and
                    cost optimization
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border-line">
              <Button asChild size="lg" className="w-full">
                <Link href="/projects">
                  <Briefcase className="mr-2 h-5 w-5" />
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

        {/* Resources & Contact - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Downloads Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Downloads</CardTitle>
              <p className="text-text-2 text-sm">
                Choose your preferred format - all versions contain the same
                information
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1-Page PDF */}
                <div className="p-4 border border-border-line rounded-lg bg-surf-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-medium text-text-1">1-Page</h3>
                  </div>
                  <p className="text-xs text-text-2">PDF • ~180KB</p>
                  <div className="space-y-1.5">
                    <Button asChild size="sm" className="w-full">
                      <a
                        href="/assets/Omer_Akben_Resume_1pg_2025-10.pdf"
                        download="Omer_Akben_Resume_1pg.pdf"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a
                        href="https://drive.google.com/file/d/1cSN7PJzyyJnQHg9XzJAOWhsfgsqXNysC/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                        </svg>
                        Google Drive
                      </a>
                    </Button>
                  </div>
                </div>

                {/* 2-Page PDF */}
                <div className="p-4 border border-border-line rounded-lg bg-surf-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-medium text-text-1">2-Page</h3>
                  </div>
                  <p className="text-xs text-text-2">PDF • ~320KB</p>
                  <div className="space-y-1.5">
                    <Button asChild size="sm" className="w-full">
                      <a
                        href="/assets/Omer_Akben_Resume_2pg_2025-10.pdf"
                        download="Omer_Akben_Resume_2pg.pdf"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a
                        href="https://drive.google.com/file/d/1XQQhMjBq5OL0PylySNMCTYLmTVZJR8L9/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                        </svg>
                        Google Drive
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Full PDF */}
                <div className="p-4 border border-border-line rounded-lg bg-surf-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-medium text-text-1">Full Resume</h3>
                  </div>
                  <p className="text-xs text-text-2">PDF • ~450KB</p>
                  <div className="space-y-1.5">
                    <Button asChild size="sm" className="w-full">
                      <a
                        href="/assets/Omer_Akben_Resume_2025-10.pdf"
                        download="Omer_Akben_Resume_Full.pdf"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a
                        href="https://drive.google.com/file/d/1FV1rouLFKtQ6o1Z5BKzXaEWBApEyZe7T/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                        </svg>
                        Google Drive
                      </a>
                    </Button>
                  </div>
                </div>

                {/* DOCX */}
                <div className="p-4 border border-border-line rounded-lg bg-surf-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-medium text-text-1">Word Format</h3>
                  </div>
                  <p className="text-xs text-text-2">DOCX • ~85KB</p>
                  <div className="space-y-1.5">
                    <Button asChild size="sm" className="w-full">
                      <a
                        href="/assets/Omer_Akben_Resume_2025-10.docx"
                        download="Omer_Akben_Resume.docx"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <a
                        href="https://docs.google.com/document/d/1sRe9ST7fCa0-Wqc964ueqPkTS_eJCoaa/edit?usp=drive_link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                        </svg>
                        Google Drive
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Certifications Downloads */}
              <div className="pt-4 mt-4 border-t border-border-line">
                <h4 className="font-medium text-text-1 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-primary" />
                  Certifications
                </h4>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <a
                      href="/assets/Omer-Akben-AWS-Certificate.pdf"
                      download="Omer_Akben_AWS_Certificate.pdf"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      AWS Certified Solutions Architect (2024)
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <a
                      href="/assets/Omer-Akben-NSS-Certificate.pdf"
                      download="Omer_Akben_NSS_Certificate.pdf"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Nashville Software School Graduate (2025)
                    </a>
                  </Button>
                </div>
              </div>

              {/* Portfolio Link */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full justify-start mt-4"
              >
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
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full justify-start"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
