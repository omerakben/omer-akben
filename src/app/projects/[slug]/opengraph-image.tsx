import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOG({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  const title = project?.title ?? "Project";
  const subtitle = (project?.technologies ?? []).slice(0, 4).join(" • ");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          width: "100%",
          height: "100%",
          background: "#0b0d0e",
          color: "#e6f7f3",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 54, color: "#00FFC6" }}>{title}</div>
        <div style={{ fontSize: 32, opacity: 0.8 }}>{subtitle}</div>
        <div style={{ fontSize: 24, opacity: 0.6 }}>{`omerakben.com/projects/${params.slug}`}</div>
      </div>
    ),
    { ...size }
  );
}
