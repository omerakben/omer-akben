import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    it("should render download button", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Download Resume");
    });

    it("should render Download icon", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
      });
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<ResumeDownloadButton className="custom-class" />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
      });
      expect(button.className).toContain("custom-class");
    });

    it("should render with custom variant", () => {
      render(<ResumeDownloadButton variant="outline" />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("should render with custom size", () => {
      render(<ResumeDownloadButton size="sm" />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
      });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct ARIA label", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: "Download professional resume",
      });
      expect(button).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
      });
      button.focus();
      expect(button).toHaveFocus();
    });
  });


  describe("Download Functionality", () => {
    it("should call API with resume format on button click", async () => {
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
        name: /download professional resume/i,
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
        name: /download professional resume/i,
      });

      fireEvent.click(button);

      // Button should show loading text
      expect(button).toHaveTextContent("Downloading...");
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(button).toHaveTextContent("Download Resume");
        expect(button).not.toBeDisabled();
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
        name: /download professional resume/i,
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


  describe("Error Handling", () => {
    it("should show alert on API error response", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      } as Response);

      render(<ResumeDownloadButton />);
      const button = screen.getByRole("button", {
        name: /download professional resume/i,
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
        name: /download professional resume/i,
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
        name: /download professional resume/i,
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
        name: /download professional resume/i,
      });

      fireEvent.click(button);

      // Should be loading
      expect(button).toHaveTextContent("Downloading...");

      await waitFor(() => {
        // Should reset to normal state
        expect(button).toHaveTextContent("Download Resume");
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
        name: /download professional resume/i,
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
        name: /download professional resume/i,
      });
      expect(button).toBeInTheDocument();
    });
  });
});
