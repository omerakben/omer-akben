import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Elon AI Toolbox | Omer Akben",
  description:
    "A case study of the Elon AI Toolbox project, a curated catalog of AI tools for Elon University.",
};

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
      </div>
    </main>
  );
}
