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
    size: 450_000,
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view?usp=sharing",
  },
  extended: {
    filename: "Omer_Akben_Resume_Extended.pdf",
    size: 500_000,
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1LiK6Q6BpnbfitPR-diaWR3ckGFv7yNFo/view?usp=sharing",
  },
};

export const downloadResume = tool<
  DownloadResumeInput,
  DownloadResumeResponse
>({
  description: "Provide the latest resume download link in the requested format.",
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
