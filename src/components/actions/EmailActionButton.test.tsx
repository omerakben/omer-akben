import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { EmailActionButton } from "./EmailActionButton";
import { facts } from "@/data/facts";

describe("EmailActionButton", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location
    delete (window as { location?: Location }).location;
    window.location = { ...originalLocation, href: "" } as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe("Rendering", () => {
    it("should render with default props", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", { name: /send email to/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Email");
    });

    it("should render Mail icon", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", { name: /send email to/i });
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<EmailActionButton className="custom-class" />);
      const button = screen.getByRole("button", { name: /send email to/i });
      expect(button).toHaveClass("custom-class");
    });

    it("should render with custom variant", () => {
      const { container } = render(<EmailActionButton variant="outline" />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });

    it("should render with custom size", () => {
      const { container } = render(<EmailActionButton size="sm" />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA label with email address", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", {
        name: `Send email to ${facts.personal.email}`,
      });
      expect(button).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", { name: /send email to/i });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Mailto Link Construction", () => {
    it("should construct mailto link with default subject", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent("Let's connect")}`;
      expect(window.location.href).toBe(expectedLink);
    });

    it("should construct mailto link with custom subject", () => {
      const customSubject = "Project Inquiry";
      render(<EmailActionButton subject={customSubject} />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent(customSubject)}`;
      expect(window.location.href).toBe(expectedLink);
    });

    it("should construct mailto link with custom body", () => {
      const customBody = "I would like to discuss a project.";
      render(<EmailActionButton body={customBody} />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent("Let's connect")}&body=${encodeURIComponent(customBody)}`;
      expect(window.location.href).toBe(expectedLink);
    });

    it("should construct mailto link with both custom subject and body", () => {
      const customSubject = "Project Inquiry";
      const customBody = "I would like to discuss a project.";
      render(<EmailActionButton subject={customSubject} body={customBody} />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`;
      expect(window.location.href).toBe(expectedLink);
    });

    it("should properly encode special characters in subject", () => {
      const subjectWithSpecialChars = "Hello & Welcome!";
      render(<EmailActionButton subject={subjectWithSpecialChars} />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      expect(window.location.href).toContain(
        encodeURIComponent(subjectWithSpecialChars)
      );
    });

    it("should properly encode special characters in body", () => {
      const bodyWithSpecialChars = "Line 1\nLine 2 & more!";
      render(<EmailActionButton body={bodyWithSpecialChars} />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      expect(window.location.href).toContain(
        encodeURIComponent(bodyWithSpecialChars)
      );
    });

    it("should not include body parameter when body is empty string", () => {
      render(<EmailActionButton body="" />);
      const button = screen.getByRole("button", { name: /send email to/i });

      fireEvent.click(button);

      expect(window.location.href).not.toContain("&body=");
    });
  });

  describe("User Interaction", () => {
    it("should handle click event", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", { name: /send email to/i });

      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("should update window.location.href on click", () => {
      render(<EmailActionButton />);
      const button = screen.getByRole("button", { name: /send email to/i });

      const originalHref = window.location.href;
      fireEvent.click(button);

      expect(window.location.href).not.toBe(originalHref);
      expect(window.location.href).toContain("mailto:");
    });
  });

  describe("Props Combinations", () => {
    it("should handle all props together", () => {
      render(
        <EmailActionButton
          subject="Custom Subject"
          body="Custom Body"
          variant="outline"
          size="lg"
          className="test-class"
        />
      );

      const button = screen.getByRole("button", { name: /send email to/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("test-class");
    });
  });
});
