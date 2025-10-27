import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description:
    "Explore my portfolio of AI/ML projects, full-stack applications, and test automation solutions. From parallel multi-agent systems to enterprise platforms.",
  path: "/projects",
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
