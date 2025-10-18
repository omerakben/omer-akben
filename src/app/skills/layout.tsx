import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Skills & Technologies",
  description: "Expert in AI/ML engineering, full-stack development, and test automation. Proficient in Python, TypeScript, React, Next.js, and modern DevOps tools.",
  path: "/skills",
});

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
