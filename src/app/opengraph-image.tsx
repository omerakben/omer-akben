import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0b0d0e",
          color: "#00FFC6",
          letterSpacing: "0.03em",
        }}
      >
        Omer Akben • Portfolio
      </div>
    ),
    { ...size }
  );
}
