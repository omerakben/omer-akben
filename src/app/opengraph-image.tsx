import {
  elonAcademicProof,
  elonOperationalProof,
} from "@/lib/proof";
import { OG_COLORS } from "@/lib/og-colors";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Omer Akben, AI Full-Stack Engineer and founder of TUEL AI";

export default async function OG() {
  const proof = [
    `${elonAcademicProof.activeUsers} USERS`,
    `${elonAcademicProof.voluntaryAdoption} VOLUNTARY ADOPTION`,
    `${elonOperationalProof.totalTokens} TOKENS`,
  ];

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
          <div style={{ fontSize: 26, color: OG_COLORS.muted }}>
            AI Full-Stack Engineer · Founder, TUEL AI
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          I BUILT TUEL SO A UNIVERSITY CAN VERIFY EVERY ANSWER.
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {proof.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                border: `3px solid ${OG_COLORS.border}`,
                background: OG_COLORS.panel,
                fontSize: 24,
                fontWeight: 700,
                padding: "10px 18px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
