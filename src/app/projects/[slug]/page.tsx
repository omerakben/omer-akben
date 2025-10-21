import { getProjectBySlug, projects } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { ProjectPageContent } from "../_components/project-page-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project ? `${project.title}` : "Project";
  const description = project?.description ?? "Project details and outcomes.";
  const path = `/projects/${slug}`;
  const image = project ? `/projects/${slug}/opengraph-image` : "/opengraph-image";

  return createMetadata({ title, description, path, image });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectPageContent project={project} />;
}
