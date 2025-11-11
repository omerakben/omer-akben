import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PersonaSwitch } from "@/components/status/PersonaSwitch";

const personas = [
  { id: "recruiters" as const, label: "Recruiters" },
  { id: "engineers" as const, label: "Engineers" },
  { id: "curious" as const, label: "Curious" },
];

describe("PersonaSwitch", () => {
  it("renders persona tabs", () => {
    const onChange = vi.fn();
    render(<PersonaSwitch personas={personas} active="recruiters" onChange={onChange} />);

    personas.forEach((persona) => {
      expect(screen.getByRole("tab", { name: persona.label })).toBeVisible();
    });
  });

  it("calls onChange when persona selected", () => {
    const onChange = vi.fn();
    render(<PersonaSwitch personas={personas} active="recruiters" onChange={onChange} />);

    fireEvent.click(screen.getByRole("tab", { name: "Engineers" }));
    expect(onChange).toHaveBeenCalledWith("engineers");
  });
});
