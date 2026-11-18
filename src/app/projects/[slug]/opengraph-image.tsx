import { getProjectBySlug } from "@/data/projects";
import { OG_COLORS } from "@/lib/og-colors";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project?.shortTitle ?? project?.title ?? "Projects";
  const technologies = (project?.technologies ?? []).slice(0, 4);
  const path = project
    ? `omerakben.com/projects/${slug}`
    : "omerakben.com/projects";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: OG_COLORS.surface,
          color: OG_COLORS.text,
          padding: 64,
          border: `8px solid ${OG_COLORS.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              background: OG_COLORS.volt,
              color: OG_COLORS.surface,
              fontSize: 26,
              fontWeight: 700,
              padding: "6px 16px",
              letterSpacing: "0.08em",
            }}
          >
            OMER.AKBEN
          </div>
          <div style={{ fontSize: 26, color: OG_COLORS.muted }}>{path}</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {technologies.map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                border: `3px solid ${OG_COLORS.border}`,
                background: OG_COLORS.panel,
                fontSize: 24,
                fontWeight: 700,
                padding: "10px 18px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
