import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Milestones } from "@/components/status/Milestones";

const items = [
  {
    date: "2025-10-01",
    title: "Older milestone",
    details: ["First detail"],
  },
  {
    date: "2025-11-01",
    title: "Newer milestone",
    details: ["Latest detail"],
  },
];

describe("Milestones", () => {
  it("renders milestones sorted by date", () => {
    render(<Milestones items={items} />);

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("Newer milestone");
    expect(headings[1]).toHaveTextContent("Older milestone");
  });

  it("renders milestone details", () => {
    render(<Milestones items={items} />);

    expect(screen.getByText("First detail")).toBeVisible();
    expect(screen.getByText("Latest detail")).toBeVisible();
  });
});
