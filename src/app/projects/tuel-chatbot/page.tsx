import { getProjectBySlug } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { ProjectPageContent } from "../_components/project-page-content";

const slug = "tuel-chatbot";

const project = getProjectBySlug(slug);

export const metadata = createMetadata({
  title: project?.title,
  description: project?.description,
  path: `/projects/${slug}`,
  image: `/projects/${slug}/opengraph-image`,
});

export default function TuelChatbotPage() {
  const projectData = getProjectBySlug(slug);

  if (!projectData) {
    notFound();
  }

  return <ProjectPageContent project={projectData} />;
}
