import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { ArrowLeft, BookOpen, Building2, ExternalLink, Github, Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = createMetadata({
  title: "LSB Applied AI Studio - Business AI Education Platform",
  description:
    "Comprehensive AI education ecosystem from Elon's Love School of Business featuring four integrated learning applications: AI Tutor, Prompt Bank, LSB AI Toolbox, and Business Agents. Prepares business leaders for AI-native markets through hands-on learning.",
  path: "/projects/lsb-ai-studio",
});

export default function LSBAIStudioPage() {
  const project = getProjectBySlug("lsb-ai-studio");

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
                  <a
                    href="https://www.elon.edu/u/ai/elongpt/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text-1"
                  >
                    ElonGPT
                  </a>
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
          <h2 className="text-2xl font-bold text-text-1 mb-4">The Mission</h2>
          <p className="text-text-2 leading-relaxed">
            The LSB Applied AI Studio was created to address the critical need
            for strategic foresight and practical skills in navigating
            AI-driven business environments. As artificial intelligence
            transforms markets and industries, business leaders must not only
            understand AI fundamentals but also know how to apply them
            ethically and effectively. The studio serves LSB students and
            professionals seeking to master AI tools and methodologies
            essential for contemporary business leadership.
          </p>
        </div>

        <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-1 mb-4">
            The Ecosystem
          </h2>
          <p className="text-text-2 leading-relaxed mb-4">
            The LSB Applied AI Studio features four interconnected learning
            applications that work together to develop comprehensive AI
            competencies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BookOpen
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">AI Tutor</h3>
                  <p className="text-sm text-text-2">
                    Interactive learning companion for mastering foundational
                    AI concepts through dialogue-based instruction
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BookOpen
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    Prompt Bank
                  </h3>
                  <p className="text-sm text-text-2">
                    Curated collection of business-ready prompts demonstrating
                    practical prompt engineering techniques
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BookOpen
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    LSB AI Toolbox
                  </h3>
                  <p className="text-sm text-text-2">
                    Hands-on platform enabling users to construct, validate,
                    and implement AI solutions through structured workflows
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surf-0 border border-border-line rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Users
                  aria-hidden="true"
                  className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-semibold text-text-1 mb-1">
                    Business Agents
                  </h3>
                  <p className="text-sm text-text-2">
                    Experiential program connecting students with community
                    partner projects for real-world AI deployment
                  </p>
                </div>
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
            Learning Outcomes
          </h2>
          <ul className="list-disc list-inside text-text-2 space-y-2">
            <li>
              <strong>Understand</strong> - Master foundational AI concepts and
              terminology
            </li>
            <li>
              <strong>Apply</strong> - Implement AI tools and techniques in
              real business scenarios
            </li>
            <li>
              <strong>Lead</strong> - Navigate the AI-native economy with
              strategic foresight
            </li>
            <li>
              Develop workforce competencies for AI-driven markets
            </li>
            <li>
              Foster innovative problem-solving with AI augmentation
            </li>
            <li>
              Practice ethical AI development and deployment
            </li>
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
                <strong>LSB Applied AI Studio</strong> - Business AI education
                platform (this project)
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
