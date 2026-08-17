import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { facts } from "@/data/facts";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { Linkedin } from "@/components/brand-icons";
import {
  Award,
  Briefcase,
  Clock,
  Download,
  ExternalLink,
  FileText,
  FileUser,
  Mail,
  Rocket,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Recruiters",
  description:
    "Quick overview, resume downloads, and contact information for recruiters and hiring managers.",
  path: "/recruiter",
});

const tldr = {
  availability: facts.professional.availability,
  location: facts.professional.workPreferences.location,
  experience: `${facts.professional.yearsOfExperience}+ years`,
  specialization: facts.personal.title,
  topSkills: facts.skills.languages
    .slice(0, 3)
    .concat(facts.skills.frontend.slice(0, 2))
    .concat(facts.skills.aiml.slice(0, 2)),
  preferredRoles: facts.professional.workPreferences.roles,
};

const liveProjectsCount = projects.filter(
  (project) => project.status === "completed" && project.demoUrl
).length;
const totalProjectsCount = projects.length;
const clientProjectsCount = 3;

export default function RecruiterPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Enhanced Hero Section */}
        <div className="relative mb-20">
          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-primary/5 via-transparent to-accent-primary/5 rounded-3xl blur-3xl" />

          <div className="text-center">
            {/* Profile Photo - Larger & More Prominent */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary to-accent-primary opacity-20 blur-xl scale-110" />
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-brand-primary shadow-2xl ring-4 ring-brand-primary/20">
                  <Image
                    src="/assets/me.jpeg"
                    alt="Omer Akben - Profile Photo"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Status Badge */}
                <div className="absolute top-0 -right-4 md:-right-6 flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Open to Work
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surf-1 border border-border-line">
                <FileUser className="w-5 h-5 text-brand-primary" />
                <span className="text-sm font-medium text-text-2">
                  For Recruiters & Hiring Managers
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-text-1 tracking-tight">
                Omer{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-accent-primary">
                  &quot;Ozzy&quot;
                </span>{" "}
                Akben
              </h1>

              <p className="text-xl md:text-2xl text-text-2 font-medium">
                {tldr.specialization}
              </p>

              <p className="text-lg text-text-2 max-w-2xl mx-auto">
                {tldr.experience} of experience building production AI systems
                and Full-Stack applications
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {tldr.availability}
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {liveProjectsCount} Live Projects
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  AWS Certified
                </Badge>
              </div>

              {/* Primary CTA - Download Resume */}
              <div className="pt-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto px-8 bg-gradient-to-r from-brand-primary to-accent-primary text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <a
                    href="/assets/Omer_Akben_Resume.pdf"
                    download="Omer_Akben_Resume.pdf"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Production Metrics Dashboard - Enhanced */}
        <Card className="mb-16 border-brand-primary/30 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-brand-primary/10">
                <Rocket className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">
                  Production Portfolio Metrics
                </CardTitle>
                <p className="text-text-2 text-sm mt-1">
                  Live systems demonstrating production-ready skills
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Live Projects - Enhanced Card */}
              <div className="group relative text-center p-6 bg-surf-1 rounded-xl border border-border-line hover:border-brand-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative">
                  <div className="text-4xl font-bold text-brand-primary mb-2 group-hover:scale-110 transition-transform">
                    {liveProjectsCount}
                  </div>
                  <div className="text-sm font-medium text-text-1 mb-2">
                    Live Projects
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    Public URLs
                  </Badge>
                </div>
              </div>

              {/* Client Projects */}
              <div className="group relative text-center p-6 bg-surf-1 rounded-xl border border-border-line hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative">
                  <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                    {clientProjectsCount}
                  </div>
                  <div className="text-sm font-medium text-text-1 mb-2">
                    Client Projects
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Production Use
                  </Badge>
                </div>
              </div>

              {/* Total Projects */}
              <div className="group relative text-center p-6 bg-surf-1 rounded-xl border border-border-line hover:border-accent-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative">
                  <div className="text-4xl font-bold text-accent-primary mb-2 group-hover:scale-110 transition-transform">
                    {totalProjectsCount}
                  </div>
                  <div className="text-sm font-medium text-text-1 mb-2">
                    Total Projects
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Full Portfolio
                  </Badge>
                </div>
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
                    <strong>Elon University, Minor Use Foundation, North Glass LLC</strong>{" "}
                    - production deployments and automation outcomes
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
                    <strong>Elon AI (TUEL AI platform)</strong> - 72.2M tokens,
                    96% satisfaction, 60% faster support response
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
                    Vercel + Azure App Service + AWS infrastructure with
                    cost-aware deployment and multi-cloud experience
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

        {/* TL;DR Section - Enhanced */}
        <Card className="mb-16 border-2 border-accent-primary/20 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-primary/10">
                <Zap className="h-6 w-6 text-accent-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">TL;DR</CardTitle>
                <p className="text-text-2 text-sm mt-1">
                  Quick overview for busy recruiters
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand-primary/5 to-transparent border border-border-line">
                <Clock className="h-5 w-5 text-brand-primary mb-2" />
                <p className="text-xs font-medium text-text-2 mb-1">
                  Availability
                </p>
                <p className="text-lg font-bold text-text-1">
                  {tldr.availability}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-accent-primary/5 to-transparent border border-border-line">
                <FileText className="h-5 w-5 text-accent-primary mb-2" />
                <p className="text-xs font-medium text-text-2 mb-1">
                  Experience
                </p>
                <p className="text-lg font-bold text-text-1">
                  {tldr.experience}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border-line to-transparent" />

            {/* Specialization Highlight */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-brand-primary/10 via-accent-primary/5 to-transparent border-2 border-brand-primary/20">
              <p className="text-sm font-semibold text-brand-primary mb-2">
                Core Specialization
              </p>
              <p className="text-xl font-bold text-text-1">
                {tldr.specialization}
              </p>
            </div>

            {/* Skills with Better Grouping */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-brand-primary" />
                <p className="font-semibold text-text-1">
                  Top Technical Skills
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tldr.topSkills.map((skill, index) => (
                  <Badge
                    key={skill}
                    variant={index < 3 ? "default" : "outline"}
                    className="text-sm px-3 py-1.5"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Roles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-accent-primary" />
                <p className="font-semibold text-text-1">Preferred Roles</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tldr.preferredRoles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="text-sm px-3 py-1.5"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Documents Section - Enhanced */}
        <Card className="mb-16 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-primary/10">
                <FileText className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">
                  Professional Documents
                </CardTitle>
                <p className="text-text-2 text-sm mt-1">
                  Resume, portfolio, and certifications - choose your preferred
                  format
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Resume Section */}
              <div>
                <h2 className="text-sm font-semibold text-text-1 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-primary" />
                  Resume
                </h2>
                <div className="max-w-md">
                  {/* Professional Resume PDF */}
                  <div className="p-4 border border-border-line rounded-lg bg-surf-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-brand-primary" />
                      <h3 className="font-medium text-text-1">Professional Resume (PDF)</h3>
                    </div>
                    <p className="text-xs text-text-2">Comprehensive 2-page PDF • 126KB</p>
                    <p className="text-xs text-text-3">6+ years of AI/ML engineering and QA automation experience</p>
                    <div className="space-y-1.5">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <a
                          href="/assets/Omer_Akben_Resume.pdf"
                          download="Omer_Akben_Resume.pdf"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications Section */}
              <div>
                <h2 className="text-sm font-semibold text-text-1 mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-primary" />
                  Certifications
                </h2>
                <div className="space-y-2">
                  <div className="p-3 border border-border-line rounded-lg bg-surf-1">
                    <p className="text-sm font-medium text-text-1 mb-2">
                      Nashville Software School Graduate (2025)
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-to-r from-brand-primary to-accent-primary"
                    >
                      <a
                        href="/assets/Omer-Akben-NSS-Certificate.pdf"
                        download="Omer_Akben_NSS_Certificate.pdf"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </a>
                    </Button>
                  </div>

                  <div className="p-3 border border-border-line rounded-lg bg-surf-1">
                    <p className="text-sm font-medium text-text-1 mb-2">
                      NSS Cloud Deployment Certificate (2025)
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-to-r from-brand-primary to-accent-primary"
                    >
                      <a
                        href="/assets/Omer-Akben-NSS-Cloud-Certificate.pdf"
                        download="Omer_Akben_NSS_Cloud_Certificate.pdf"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </a>
                    </Button>
                  </div>

                  <div className="p-3 border border-border-line rounded-lg bg-surf-1">
                    <p className="text-sm font-medium text-text-1 mb-2">
                      AWS Cloud Practitioner Essentials (2022)
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-to-r from-brand-primary to-accent-primary"
                    >
                      <a
                        href="/assets/Omer-Akben-AWS-Certificate.pdf"
                        download="Omer_Akben_AWS_Certificate.pdf"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Certificate
                      </a>
                    </Button>
                  </div>
                </div>
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

        {/* Contact Section - Enhanced */}
        <Card className="border-2 border-brand-primary/20 shadow-xl bg-gradient-to-br from-brand-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-primary/10">
                <Mail className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">Let&apos;s Connect</CardTitle>
                <p className="text-text-2 text-sm mt-1">
                  Ready to discuss opportunities? I typically respond within 24
                  hours
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary CTA - Email */}
            <div className="p-1 rounded-xl bg-gradient-to-r from-brand-primary to-accent-primary">
              <Button
                asChild
                size="lg"
                className="w-full bg-surf-0 hover:bg-surf-1 text-text-1"
              >
                <a href={`mailto:${facts.personal.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  <span className="font-semibold">
                    Email: {facts.personal.email}
                  </span>
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                </a>
              </Button>
            </div>

            {/* Secondary CTAs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-1 rounded-xl bg-gradient-to-r from-brand-primary to-accent-primary">
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-start bg-surf-0 hover:bg-surf-1 text-text-1"
                >
                  <a
                    href="https://linkedin.com/in/omerakben"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2]" />
                    <span className="font-semibold">LinkedIn</span>
                    <ExternalLink className="ml-auto h-4 w-4 opacity-70" />
                  </a>
                </Button>
              </div>

              <div className="p-1 rounded-xl bg-gradient-to-r from-brand-primary to-accent-primary">
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-start bg-surf-0 hover:bg-surf-1 text-text-1"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5 text-accent-primary" />
                    <span className="font-semibold">Contact Form</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Response Time Badge */}
            <div className="flex items-center justify-center gap-2 pt-4 pb-2 text-sm text-text-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>
                Usually responds within{" "}
                <strong className="text-text-1">24 hours</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
