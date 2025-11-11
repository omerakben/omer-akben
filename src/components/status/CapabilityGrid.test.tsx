import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CapabilityGrid } from "@/components/status/CapabilityGrid";

const items = [
  {
    id: "portfolio",
    title: "Portfolio Core",
    summary: "Projects, journey, credentials",
    badge: "MVP",
    link: "/projects",
  },
  {
    id: "ai",
    title: "Agentic AI",
    summary: "Ozzy assistant with memory",
  },
];

describe("CapabilityGrid", () => {
  it("renders capability titles", () => {
    render(<CapabilityGrid items={items} />);
    expect(screen.getByText("Portfolio Core")).toBeVisible();
    expect(screen.getByText("Agentic AI")).toBeVisible();
  });

  it("renders links when provided", () => {
    render(<CapabilityGrid items={items} />);

    const link = screen.getByRole("link", { name: /portfolio core/i });
    expect(link).toHaveAttribute("href", "/projects");
  });
});
