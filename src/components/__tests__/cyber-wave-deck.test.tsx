import { CyberWaveDeck } from "@/components/cyber-wave-deck";
import { ProjectWaveHeader } from "@/components/project-wave-header";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("CyberWaveDeck", () => {
  it("defaults to WAVE 01: 3D CONTOUR MATRIX and switches wave visualization modes", () => {
    render(<CyberWaveDeck />);

    const dotsButton = screen.getByRole("button", {
      name: "WAVE 01: 3D CONTOUR MATRIX",
    });
    const ribbonsButton = screen.getByRole("button", {
      name: "WAVE 02: HARMONIC SILK",
    });
    const meshButton = screen.getByRole("button", {
      name: "WAVE 03: 3D MESH TOPOLOGY",
    });

    expect(dotsButton).toHaveAttribute("aria-pressed", "true");
    expect(ribbonsButton).toHaveAttribute("aria-pressed", "false");
    expect(meshButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(ribbonsButton);
    expect(ribbonsButton).toHaveAttribute("aria-pressed", "true");
    expect(dotsButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(meshButton);
    expect(meshButton).toHaveAttribute("aria-pressed", "true");
    expect(ribbonsButton).toHaveAttribute("aria-pressed", "false");
  });

  it("switches between all four architecture and proof channels", () => {
    render(<CyberWaveDeck />);

    expect(
      screen.getByText("Citation-Grounded RAG with a 7-Layer Prompt System")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("tab", { name: "[CH_02: @TUEL/* & FULL-STACK]" })
    );
    expect(
      screen.getByText("13-Package @tuel/* Animation Library & Next.js 15")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("tab", { name: "[CH_03: SDET QUALITY GATES]" })
    );
    expect(
      screen.getByText("Shift-Left Quality Engineering Across 6+ Years")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("tab", { name: "[CH_04: RECRUITER BRIEF]" })
    );
    expect(
      screen.getByText("Immediate U.S. Work Authorization & Target Roles")
    ).toBeInTheDocument();
  });

  it("exposes channels as keyboard-operable tabs with a labelled panel", () => {
    render(<CyberWaveDeck />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      tabs[1].id
    );

    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(tabs[3]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tabs[3], { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});

describe("ProjectWaveHeader", () => {
  it("renders ordinal index and verified status badges", () => {
    const { rerender } = render(
      <ProjectWaveHeader
        index={0}
        slug="elon-ai"
        status="completed"
        demoUrl="https://elon-ai.app"
      />
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("LIVE AT ELON")).toBeInTheDocument();

    rerender(
      <ProjectWaveHeader
        index={1}
        slug="tuel-animation-library"
        status="in-progress"
      />
    );
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("13 NPM PACKAGES")).toBeInTheDocument();
  });
});
