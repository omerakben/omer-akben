import { tool } from "ai";
import {
  downloadCertificateInputSchema,
  downloadCertificateOutputSchema,
  type DownloadCertificateInput,
  type DownloadCertificateOutput,
} from "@/lib/tools/zod-schemas";

const CERTIFICATE_FILES: Record<
  DownloadCertificateInput["type"],
  DownloadCertificateOutput
> = {
  aws: {
    url: "/assets/Omer-Akben-AWS-Certificate.pdf",
    filename: "Omer-Akben-AWS-Certificate.pdf",
    size: 250_000,
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1wosKaBVPTEsShVnQQWpi28eB40XEHtOD/view?usp=sharing",
    certificateName: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    year: "2022",
  },
  nss: {
    url: "/assets/Omer-Akben-NSS-Certificate.pdf",
    filename: "Omer-Akben-NSS-Certificate.pdf",
    size: 200_000,
    format: "pdf",
    googleDriveUrl:
      "https://drive.google.com/file/d/1vjwfgNY__4bb3yRa9Ic5LbS_O-fgeFbn/view?usp=sharing",
    certificateName: "Nashville Software School Graduate",
    issuer: "Nashville Software School",
    year: "2025",
  },
};

export function downloadCertificate(
  input: DownloadCertificateInput
): DownloadCertificateOutput {
  const certificate = CERTIFICATE_FILES[input.type];

  if (!certificate) {
    throw new Error(`Invalid certificate type: ${input.type}`);
  }

  return certificate;
}

export const downloadCertificateTool = tool({
  name: "download_certificate",
  description: "Provide certificate download links for AWS and NSS credentials.",
  inputSchema: downloadCertificateInputSchema,
  outputSchema: downloadCertificateOutputSchema,
  execute: async (input) => downloadCertificate(input),
});
