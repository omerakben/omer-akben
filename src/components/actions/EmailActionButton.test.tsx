import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmailActionButton } from "./EmailActionButton";
import { facts } from "@/data/facts";

describe("EmailActionButton", () => {

  describe("Rendering", () => {
    it("should render as a link with Button styling", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Email");
    });

    it("should have mailto href attribute", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });
      expect(link).toHaveAttribute("href");
      expect(link.getAttribute("href")).toContain("mailto:");
    });

    it("should render Mail icon", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });
      const icon = link.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<EmailActionButton className="custom-class" />);
      const link = screen.getByRole("link", { name: /send email to/i });
      // With asChild, className is applied to the child <a> element
      expect(link).toHaveClass("custom-class");
    });

    it("should render with custom variant styling", () => {
      render(<EmailActionButton variant="outline" />);
      const link = screen.getByRole("link", { name: /send email to/i });
      // Verify link is rendered (Button with asChild renders as <a>)
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
    });

    it("should render with custom size styling", () => {
      render(<EmailActionButton size="sm" />);
      const link = screen.getByRole("link", { name: /send email to/i });
      // Verify link is rendered (Button with asChild renders as <a>)
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
    });

    it("should have rel='noopener noreferrer' for security", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA label with email address", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", {
        name: `Send email to ${facts.personal.email}`,
      });
      expect(link).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe("Mailto Link Construction", () => {
    it("should construct mailto link with default subject", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent("Let's connect")}`;
      expect(link).toHaveAttribute("href", expectedLink);
    });

    it("should construct mailto link with custom subject", () => {
      const customSubject = "Project Inquiry";
      render(<EmailActionButton subject={customSubject} />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent(customSubject)}`;
      expect(link).toHaveAttribute("href", expectedLink);
    });

    it("should construct mailto link with custom body", () => {
      const customBody = "I would like to discuss a project.";
      render(<EmailActionButton body={customBody} />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent("Let's connect")}&body=${encodeURIComponent(customBody)}`;
      expect(link).toHaveAttribute("href", expectedLink);
    });

    it("should construct mailto link with both custom subject and body", () => {
      const customSubject = "Project Inquiry";
      const customBody = "I would like to discuss a project.";
      render(<EmailActionButton subject={customSubject} body={customBody} />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const expectedLink = `mailto:${facts.personal.email}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`;
      expect(link).toHaveAttribute("href", expectedLink);
    });

    it("should properly encode special characters in subject", () => {
      const subjectWithSpecialChars = "Hello & Welcome!";
      render(<EmailActionButton subject={subjectWithSpecialChars} />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const href = link.getAttribute("href");
      expect(href).toContain(encodeURIComponent(subjectWithSpecialChars));
    });

    it("should properly encode special characters in body", () => {
      const bodyWithSpecialChars = "Line 1\nLine 2 & more!";
      render(<EmailActionButton body={bodyWithSpecialChars} />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const href = link.getAttribute("href");
      expect(href).toContain(encodeURIComponent(bodyWithSpecialChars));
    });

    it("should not include body parameter when body is empty string", () => {
      render(<EmailActionButton body="" />);
      const link = screen.getByRole("link", { name: /send email to/i });

      const href = link.getAttribute("href");
      expect(href).not.toContain("&body=");
    });
  });

  describe("User Interaction", () => {
    it("should be clickable as a native link", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });

      // Verify link is present and has href
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href");
      expect(link.getAttribute("href")).toContain("mailto:");
    });

    it("should maintain focus after interaction", () => {
      render(<EmailActionButton />);
      const link = screen.getByRole("link", { name: /send email to/i });

      link.focus();
      expect(link).toHaveFocus();
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

      const link = screen.getByRole("link", { name: /send email to/i });
      expect(link).toBeInTheDocument();

      // Verify href includes custom subject and body
      const href = link.getAttribute("href");
      expect(href).toContain(encodeURIComponent("Custom Subject"));
      expect(href).toContain(encodeURIComponent("Custom Body"));
    });
  });
});
