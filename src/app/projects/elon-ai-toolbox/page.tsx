import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { ArrowLeft, Building2, ExternalLink, Github } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "Elon AI Toolbox",
  description:
    "A case study of the Elon AI Toolbox project, a curated catalog of AI tools for Elon University.",
  path: "/projects/elon-ai-toolbox",
});

export default function ElonAiToolboxPage() {
  const project = getProjectBySlug("elon-ai-toolbox");

  if (!project) {
    notFound();
  }

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

        {/* University Property Warning */}
        <div className="bg-yellow-500/10 border-4 border-yellow-500/60 rounded-lg p-4 mb-8 shadow-lg">
          <div className="flex gap-3">
            <Building2
              aria-hidden="true"
              className="w-6 h-6 text-yellow-400 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-text-1 mb-2">
                Elon University Intellectual Property
              </h3>
              <div className="text-text-2 text-sm space-y-2">
                <p>
                  This project, along with the Elon AI platform (TUEL AI), AI
                  Toolbox, ElonGPT, and LSB Applied AI Studio, was developed
                  for Elon University and remains their intellectual property.
                </p>
                <p>
                  All source code is maintained in private repositories. Please
                  respect Elon University&apos;s property and do not attempt to
                  access, replicate, or distribute these systems without
                  authorization.
                </p>
                <p>
                  Demo access is provided for portfolio demonstration purposes
                  only.
                </p>
              </div>
            </div>
          </div>
        </div>

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
                  View Live Demo
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
            Elon University needed a centralized platform to help students,
            faculty, and staff discover and utilize the growing number of AI
            tools. The challenge was to create a user-friendly and comprehensive
            resource that would be easy to navigate and search, while also
            reflecting the university&apos;s brand and academic mission.
          </p>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Solution</h2>
          <p className="text-text-2 leading-relaxed">
            I developed the Elon AI Toolbox, a web application that provides a
            curated and searchable catalog of over 130 AI tools. The application
            features a clean and intuitive interface, smart filtering and search
            functionality, and a responsive design that works seamlessly across
            all devices. The toolbox is built with Next.js, React, and
            TypeScript, and it leverages Fuse.js for fast and accurate search
            results.
          </p>
        </div>

        {project.image && (
          <div className="mb-8">
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={675}
              className="rounded-lg border border-border-line"
            />
          </div>
        )}

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-text-2 space-y-2">
            <li>Over 130 curated AI tools</li>
            <li>Smart filtering by category</li>
            <li>Real-time search with Fuse.js</li>
            <li>Responsive design for all devices</li>
            <li>URL-synced filters for easy sharing</li>
            <li>Elon University branding</li>
          </ul>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
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

        {/* Acknowledgment Section */}
        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Acknowledgment
          </h2>
          <div className="text-text-2 leading-relaxed space-y-4">
            <p>
              This project was developed during my time at Elon University as
              part of their AI initiative, which includes several innovative
              projects:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <Link
                  href="/projects/elon-ai"
                  className="underline hover:text-text-1"
                >
                  <strong>Elon AI Platform</strong>
                </Link>{" "}
                - Live TUEL AI deployment
              </li>
              <li>
                <Link
                  href="/projects/elon-ai-agent"
                  className="underline hover:text-text-1"
                >
                  <strong>Elon AI Agent</strong>
                </Link>{" "}
                - Business Plan Generator
              </li>
              <li>
                <strong>AI Toolbox</strong> - Comprehensive AI tools catalog
                (this project)
              </li>
              <li>
                <a
                  href="https://www.elon.edu/u/ai/elongpt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-text-1"
                >
                  <strong>ElonGPT</strong>
                </a>{" "}
                - University information assistant
              </li>
              <li>
                <Link
                  href="/projects/lsb-ai-studio"
                  className="underline hover:text-text-1"
                >
                  <strong>LSB Applied AI Studio</strong>
                </Link>{" "}
                - Business AI education platform
              </li>
            </ul>
            <p>
              All projects are delivered for Elon University and maintained in
              private repositories for institutional/client IP. I am grateful
              for the opportunity to have contributed to these educational
              initiatives that advance AI literacy across the university
              community.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
