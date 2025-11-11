import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HowToUse } from "@/components/status/HowToUse";

describe("HowToUse", () => {
  const blocks = [
    { persona: "recruiters" as const, prompts: ["Prompt A", "Prompt B"] },
    { persona: "engineers" as const, prompts: ["Engineer prompt"] },
  ];

  it("renders prompts for selected persona", () => {
    render(<HowToUse persona="recruiters" blocks={blocks} />);

    expect(screen.getByText("Prompt A")).toBeVisible();
    expect(screen.getByText("Prompt B")).toBeVisible();
    expect(screen.queryByText("Engineer prompt")).not.toBeInTheDocument();
  });

  it("copies prompt to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    render(<HowToUse persona="recruiters" blocks={blocks} />);

    fireEvent.click(screen.getAllByRole("button", { name: /copy/i })[0]);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("Prompt A");
    });
  });
});
