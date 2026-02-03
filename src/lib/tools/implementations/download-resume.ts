import { tool } from "ai";

import {
  DownloadResumeInput,
  DownloadResumeResponse,
  createErrorResponse,
  createSuccessResponse,
  downloadResumeInputSchema,
  downloadResumeResponseSchema,
} from "@/lib/tools/zod-schemas";

type ResumeFormat = DownloadResumeInput["format"];

type ResumeDescriptor = {
  filename: string;
  size: number;
  format: string;
  googleDriveUrl: string;
};

const FILE_MAP: Record<ResumeFormat, ResumeDescriptor> = {
  resume: {
    filename: "Omer_Akben_Resume.pdf",
    size: 129384, // ~126KB
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1_Q4LEz9emCn2FpR5Mbw9eSi62Rs1HOYw/view?usp=sharing",
  },
};

export const downloadResume = tool<
  DownloadResumeInput,
  DownloadResumeResponse
>({
  description: "Provide the latest professional resume download link (PDF, 2 pages, 126KB). Comprehensive resume covering 6+ years of AI/ML engineering and QA automation experience.",
  inputSchema: downloadResumeInputSchema,
  outputSchema: downloadResumeResponseSchema,
  execute: async (input) => {
    const fileInfo = FILE_MAP[input.format];
    if (!fileInfo) {
      return createErrorResponse(`Invalid format: ${input.format}`);
    }

    return createSuccessResponse({
      url: `/assets/${fileInfo.filename}`,
      filename: fileInfo.filename,
      size: fileInfo.size,
      format: fileInfo.format,
      googleDriveUrl: fileInfo.googleDriveUrl,
    });
  },
});
