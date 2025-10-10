import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getProjectBySlug, projects } from "@/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Omer Akben`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const statusColors = {
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    "in-progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    planned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const roleColors = {
    "Full-Stack": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    AI: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    QA: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "QA/AI": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };

  return (
    <main className="min-h-screen bg-surf-0 py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Back button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-2 hover:text-text-1 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                roleColors[project.role]
              }`}
            >
              {project.role}
            </span>
            {project.status && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            )}
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-text-2 mb-6">{project.description}</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-surf-0 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                View Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surf-1 text-text-1 border border-border-line rounded-lg font-medium hover:bg-surf-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            )}
          </div>
        </div>

        {/* Long description */}
        {project.longDescription && (
          <div className="bg-surf-1 border border-border-line rounded-[20px] p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-1 mb-4">
              About This Project
            </h2>
            <p className="text-text-2 leading-relaxed">
              {project.longDescription}
            </p>
          </div>
        )}

        {/* Technologies */}
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

        {/* Project timeline */}
        {(project.startDate || project.endDate) && (
          <div className="bg-surf-1 border border-border-line rounded-[20px] p-8">
            <h2 className="text-2xl font-bold text-text-1 mb-4">Timeline</h2>
            <div className="flex gap-4 text-text-2">
              {project.startDate && (
                <div>
                  <span className="font-medium">Started:</span>{" "}
                  {project.startDate}
                </div>
              )}
              {project.endDate && (
                <div>
                  <span className="font-medium">Completed:</span>{" "}
                  {project.endDate}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
