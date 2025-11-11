import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureSpotlights } from "@/components/status/FeatureSpotlights";

const items = [
  {
    id: "sidebar-pin",
    title: "Pinned Sidebar",
    summary: "Keep Ozzy visible while browsing.",
    badge: "New",
    details: [
      "Desktop-only cue",
      "Persists width",
    ],
    link: {
      label: "See docs",
      href: "/status#sidebar-pin",
    },
  },
];

describe("FeatureSpotlights", () => {
  it("renders spotlight cards", () => {
    render(<FeatureSpotlights items={items} />);

    expect(screen.getByText(/Pinned Sidebar/i)).toBeVisible();
    expect(screen.getByText(/Desktop-only cue/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /See docs/i })).toHaveAttribute(
      "href",
      "/status#sidebar-pin"
    );
  });

  it("returns null when no items provided", () => {
    const { container } = render(<FeatureSpotlights items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
