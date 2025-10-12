import { Button } from "@/components/ui/button";
import { getProjectBySlug, projects } from "@/data/projects";
import { roleColors, statusColors } from "@/lib/constants";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
              <Button asChild size="lg">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
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
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              </Button>
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
