import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Lessons } from "@/components/status/Lessons";

const items = [
  { date: "2025-09-01", note: "Older lesson" },
  { date: "2025-10-01", note: "Newer lesson" },
];

describe("Lessons", () => {
  it("renders lessons sorted by date", () => {
    render(<Lessons items={items} />);

    const notes = screen.getAllByText(/lesson/);
    expect(notes[0]).toHaveTextContent("Newer lesson");
    expect(notes[1]).toHaveTextContent("Older lesson");
  });
});
