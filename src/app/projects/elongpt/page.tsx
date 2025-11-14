import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Github,
  MessageSquare,
  Search,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "ElonGPT - University Information Assistant",
  description:
    "AI-powered campus information chatbot developed by Elon University's AI Hub. Provides real-time information about campus events, news, and university resources by synthesizing data from official Elon sources.",
  path: "/projects/elongpt",
});

export default function ElonGPTPage() {
  const project = getProjectBySlug("elongpt");

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
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <Building2
              aria-hidden="true"
              className="w-5 h-5 text-blue-400 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-text-1 mb-2">
                Elon University Intellectual Property
              </h3>
              <div className="text-text-2 text-sm space-y-2">
                <p>
                  This project, along with the{" "}
                  <Link
                    href="/projects/elon-ai-agent"
                    className="underline hover:text-text-1"
                  >
                    Elon AI Agent
                  </Link>
                  ,{" "}
                  <Link
                    href="/projects/elon-ai-toolbox"
                    className="underline hover:text-text-1"
                  >
                    AI Toolbox
                  </Link>
                  , and{" "}
                  <Link
                    href="/projects/lsb-ai-studio"
                    className="underline hover:text-text-1"
                  >
                    LSB Applied AI Studio
                  </Link>
                  , was developed for Elon University and remains their
                  intellectual property. Please respect Elon University&apos;s
                  ownership of these educational resources.
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
                  Try ElonGPT
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
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Purpose</h2>
          <p className="text-text-2 leading-relaxed">
            ElonGPT serves as a 24/7 information companion for the Elon
            University community, helping students, faculty, and staff quickly
            find campus information, discover events, access news, and navigate
            university resources. Developed by Elon University&apos;s AI Hub,
            ElonGPT synthesizes data from official Elon sources to ensure
            accuracy and relevance in every response.
          </p>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            How It Works
          </h2>
          <p className="text-text-2 leading-relaxed mb-4">
            ElonGPT is an intelligent information retrieval system that pulls
            information from the official Elon website and curated university
            sources. The system is designed to provide fast, accurate answers
            to questions about campus life, academic events, university news,
            and institutional resources.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
            <div className="flex gap-3">
              <MessageSquare
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="font-semibold text-text-1 mb-1">
                  Pro Tip: Be Specific
                </h3>
                <p className="text-text-2 text-sm">
                  ElonGPT works best with detailed questions. Instead of asking
                  &quot;What events are happening?&quot;, try &quot;What events
                  are happening today on campus? Today is [specific
                  date]&quot;. Query specificity ensures optimal results.
                </p>
              </div>
            </div>
          </div>
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
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            Key Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    Campus Events
                  </h3>
                  <p className="text-sm text-text-2">
                    Stay informed about upcoming university events, academic
                    programs, and campus activities
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    University News
                  </h3>
                  <p className="text-sm text-text-2">
                    Access the latest news and announcements from across the
                    Elon community
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Search
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    Resource Navigation
                  </h3>
                  <p className="text-sm text-text-2">
                    Quickly find university resources, departments, and
                    services
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageSquare
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    24/7 Availability
                  </h3>
                  <p className="text-sm text-text-2">
                    Get campus information anytime, day or night, with
                    consistent accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                  href="/projects/elon-ai-agent"
                  className="underline hover:text-text-1"
                >
                  <strong>Elon AI Agent</strong>
                </Link>{" "}
                - Business Plan Generator
              </li>
              <li>
                <Link
                  href="/projects/elon-ai-toolbox"
                  className="underline hover:text-text-1"
                >
                  <strong>AI Toolbox</strong>
                </Link>{" "}
                - Comprehensive AI tools catalog
              </li>
              <li>
                <strong>ElonGPT</strong> - University information assistant
                (this project)
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
              All projects remain the intellectual property of Elon University.
              I am grateful for the opportunity to have contributed to these
              educational initiatives that advance AI literacy across the
              university community.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
