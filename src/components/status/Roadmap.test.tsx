import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Roadmap } from "@/components/status/Roadmap";

const data = {
  now: ["Ship MVP"],
  next: ["Add analytics"],
  later: ["Multi-agent"],
};

describe("Roadmap", () => {
  it("renders phase headings and items", () => {
    render(<Roadmap data={data} />);

    expect(screen.getByRole("heading", { name: "Now" })).toBeVisible();
    expect(screen.getByText("Ship MVP")).toBeVisible();
    expect(screen.getByText("Add analytics")).toBeVisible();
    expect(screen.getByText("Multi-agent")).toBeVisible();
  });
});
