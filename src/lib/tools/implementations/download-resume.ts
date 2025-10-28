import { tool } from "ai";
import {
  downloadResumeInputSchema,
  downloadResumeOutputSchema,
  type DownloadResumeInput,
  type DownloadResumeOutput,
} from "@/lib/tools/zod-schemas";

const RESUME_FILES: Record<
  DownloadResumeInput["format"],
  DownloadResumeOutput
> = {
  resume: {
    url: "/assets/Omer_Akben_Resume.pdf",
    filename: "Omer_Akben_Resume.pdf",
    size: 450_000,
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view?usp=sharing",
  },
  extended: {
    url: "/assets/Omer_Akben_Resume_Extended.pdf",
    filename: "Omer_Akben_Resume_Extended.pdf",
    size: 500_000,
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1LiK6Q6BpnbfitPR-diaWR3ckGFv7yNFo/view?usp=sharing",
  },
};

export function downloadResume(
  input: DownloadResumeInput
): DownloadResumeOutput {
  const file = RESUME_FILES[input.format];

  if (!file) {
    throw new Error(`Invalid format: ${input.format}`);
  }

  return file;
}

export const downloadResumeTool = tool({
  name: "download_resume",
  description:
    "Retrieve links for Omer Akben's resume variants (standard or extended).",
  inputSchema: downloadResumeInputSchema,
  outputSchema: downloadResumeOutputSchema,
  execute: async (input) => downloadResume(input),
});
