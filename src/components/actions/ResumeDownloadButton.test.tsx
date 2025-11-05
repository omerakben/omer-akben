import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

// Mock global fetch
global.fetch = vi.fn();

// Mock window.alert
global.alert = vi.fn();

describe("ResumeDownloadButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render primary download button", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Resume");
    });

    it("should render dropdown menu trigger", () => {
      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });
      expect(trigger).toBeInTheDocument();
    });

    it("should render Download icon in primary button", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render ChevronDown icon in dropdown trigger", () => {
      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });
      const icon = trigger.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should apply custom className to container", () => {
      const { container } = render(
        <ResumeDownloadButton className="custom-class" />
      );
      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render with custom variant", () => {
      render(<ResumeDownloadButton variant="outline" />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("should render with custom size", () => {
      render(<ResumeDownloadButton size="sm" />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA label for primary button", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: "Download standard resume",
      });
      expect(button).toBeInTheDocument();
    });

    it("should have correct ARIA label for dropdown trigger", () => {
      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: "Select resume format",
      });
      expect(trigger).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Dropdown Menu", () => {
    it("should open dropdown menu on trigger click", async () => {
      const user = userEvent.setup();
      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Standard Resume")).toBeInTheDocument();
      });
    });

    it("should display both resume format options", async () => {
      const user = userEvent.setup();
      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Standard Resume")).toBeInTheDocument();
        expect(screen.getByText("Extended Resume")).toBeInTheDocument();
      });
    });

    it("should display format descriptions", async () => {
      const user = userEvent.setup();
      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Optimized for ATS")).toBeInTheDocument();
        expect(screen.getByText("Detailed version")).toBeInTheDocument();
      });
    });
  });

  describe("Download Functionality - Standard Resume", () => {
    it("should call API with standard format on primary button click", async () => {
      const mockResponse = {
        success: true,
        data: {
          url: "/assets/resume.pdf",
          filename: "resume.pdf",
          size: 1024,
          format: "pdf",
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/tools/download-resume",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ format: "resume" }),
          }
        );
      });
    });

    it("should show loading state during download", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, data: {} }),
                } as Response),
              100
            );
          })
      );

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      // Button should show loading text
      expect(button).toHaveTextContent("Loading...");
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(button).toHaveTextContent("Resume");
        expect(button).not.toBeDisabled();
      });
    });

    it("should disable dropdown trigger during loading", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, data: {} }),
                } as Response),
              100
            );
          })
      );

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });

      fireEvent.click(button);

      expect(trigger).toBeDisabled();

      await waitFor(() => {
        expect(trigger).not.toBeDisabled();
      });
    });

    it("should trigger download with correct data", async () => {
      const mockResponse = {
        success: true,
        data: {
          url: "/assets/resume.pdf",
          filename: "Omer_Akben_Resume.pdf",
          size: 1024,
          format: "pdf",
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/tools/download-resume",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ format: "resume" }),
          }
        );
      });
    });
  });

  describe("Download Functionality - Extended Resume", () => {
    it("should call API with extended format from dropdown", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        success: true,
        data: {
          url: "/assets/resume-extended.pdf",
          filename: "resume-extended.pdf",
          size: 2048,
          format: "pdf",
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(<ResumeDownloadButton />);
      const trigger = screen.getByRole("button", {
        name: /select resume format/i,
      });

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Extended Resume")).toBeInTheDocument();
      });

      const extendedOption = screen.getByText("Extended Resume").closest("div");
      if (extendedOption?.parentElement) {
        await user.click(extendedOption.parentElement);
      }

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/tools/download-resume",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ format: "extended" }),
          }
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("should show alert on API error response", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      } as Response);

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Failed to download resume. Please try again."
        );
      });
    });

    it("should show alert on unsuccessful response data", async () => {
      const mockResponse = {
        success: false,
        error: "Resume not found",
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Failed to download resume. Please try again."
        );
      });
    });

    it("should show alert on network error", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Failed to download resume. Please try again."
        );
      });
    });

    it("should reset loading state after error", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      // Should be loading
      expect(button).toHaveTextContent("Loading...");

      await waitFor(() => {
        // Should reset to normal state
        expect(button).toHaveTextContent("Resume");
        expect(button).not.toBeDisabled();
      });
    });

    it("should log error to console", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "[ResumeDownload] Error:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Props Combinations", () => {
    it("should handle all props together", () => {
      render(
        <ResumeDownloadButton
          variant="outline"
          size="lg"
          className="test-class"
        />
      );

      const button = screen.getByRole("button", {
        name: /download standard resume/i,
      });
      expect(button).toBeInTheDocument();
    });
  });
});
