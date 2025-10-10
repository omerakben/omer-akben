import Link from "next/link";
import { Download, Mail, Linkedin, FileText, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "For Recruiters",
  description: "Quick overview, resume downloads, and contact information for recruiters and hiring managers.",
  path: "/recruiter",
});

const tldr = {
  availability: "Available for new opportunities",
  location: "San Francisco, CA (Open to remote)",
  experience: "5+ years",
  specialization: "AI/ML Engineering & Full-Stack Development",
  topSkills: ["Python", "TypeScript", "React", "Next.js", "OpenAI API", "AWS"],
  preferredRoles: ["Senior AI/ML Engineer", "Full-Stack Engineer", "Tech Lead"],
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
              <a href="mailto:hello@omerakben.com">
                <Mail className="mr-2 h-5 w-5" />
                Email: hello@omerakben.com
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
