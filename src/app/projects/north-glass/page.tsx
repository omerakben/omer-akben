import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { Github } from "@/components/brand-icons";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Building2,
  ExternalLink,
  Image as ImageIcon,
  Mail,
  Smartphone,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "North Glass LLC - Production Website",
  description:
    "A case study of the North Glass LLC project, a production commercial website for a glass and aluminum contractor with AI-powered business intelligence integration.",
  path: "/projects/north-glass",
});

export default function NorthGlassPage() {
  const project = getProjectBySlug("north-glass");

  if (!project) {
    notFound();
  }

  const features = [
    {
      icon: Building2,
      title: "Service Showcases",
      description:
        "Comprehensive displays of glass and aluminum contracting services with detailed descriptions and professional imagery",
    },
    {
      icon: ImageIcon,
      title: "Project Portfolio",
      description:
        "Before/after galleries showcasing completed installations and custom fabrication work",
    },
    {
      icon: Bot,
      title: "AI Business Plan Generator",
      description:
        "Integrated Elon AI Agent for automated business intelligence and strategic planning capabilities",
    },
    {
      icon: Mail,
      title: "Email Automation System",
      description:
        "Automated contact form delivery via nodemailer with Gemini Workspace integration for customer email tracking and response management",
    },
    {
      icon: BarChart3,
      title: "Vercel Analytics",
      description:
        "Real-time visitor tracking and performance metrics for data-driven business insights",
    },
    {
      icon: Smartphone,
      title: "Mobile-Responsive Design",
      description:
        "Fully optimized responsive layouts with fast performance across all devices and screen sizes",
    },
  ];

  return (
    <main className="min-h-screen bg-surf-0 py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 mb-8 transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-text-2 mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Button asChild size="lg">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" className="w-4 h-4" />
                  View Live Site
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" size="lg">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github aria-hidden="true" className="w-4 h-4" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Challenge</h2>
          <p className="text-text-2 leading-relaxed">
            North Glass LLC, a professional glass and aluminum contractor serving
            the North Carolina market, needed a modern web presence to showcase
            their specialized services and attract new customers. The challenge
            was to create a production-grade website that would establish
            credibility in a competitive market, improve online discoverability,
            and provide seamless customer contact functionality while integrating
            AI-powered business intelligence tools for operational efficiency.
          </p>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed">
            I developed a full-featured commercial website using Next.js 15 and
            React 19, featuring comprehensive service showcases, project
            portfolio with before/after galleries, intelligent contact system
            with automated email delivery via nodemailer, AI-powered business
            plan generation through integrated Elon AI Agent, Gemini Workspace
            integration for automated customer email tracking and response
            management, Vercel Analytics for performance monitoring, and
            comprehensive SEO optimization. The site delivers production-level
            performance with mobile-responsive design and is actively serving
            real business operations.
          </p>
        </div>

        <div className="mb-8">
          <Image
            src="/nort_glass_img/north_glass_hero.png"
            alt="North Glass LLC homepage showcasing modern landing page design with hero section and service overview"
            width={1200}
            height={675}
            priority
            className="rounded-lg border border-border-line w-full h-auto"
          />
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon
                    className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-text-1 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <Image
            src="/nort_glass_img/north_glass_custom_comp.png"
            alt="North Glass custom before/after component showcasing glass installation comparison with interactive slider"
            width={1200}
            height={675}
            className="rounded-lg border border-border-line w-full h-auto"
          />
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Technical Implementation
          </h2>
          <ul className="list-disc list-inside text-text-2 space-y-2">
            <li>Next.js 15 App Router with React 19 server components</li>
            <li>TypeScript strict mode for comprehensive type safety</li>
            <li>Vercel deployment with zero-downtime updates</li>
            <li>AI agent integration for business intelligence</li>
            <li>
              Email delivery automation with nodemailer and Google Workspace
              SMTP
            </li>
            <li>
              Gemini Workspace integration for customer email tracking and
              automated response notifications
            </li>
            <li>SEO metadata optimization and Open Graph tags</li>
            <li>Mobile-first responsive design with Tailwind CSS</li>
            <li>Image optimization with Next.js Image component</li>
          </ul>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-surf-2 text-text-2 rounded-full text-sm border border-border-line"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
