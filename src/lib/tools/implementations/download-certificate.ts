import { tool } from "ai";

import {
  DownloadCertificateInput,
  DownloadCertificateResponse,
  createErrorResponse,
  createSuccessResponse,
  downloadCertificateInputSchema,
  downloadCertificateResponseSchema,
} from "@/lib/tools/zod-schemas";

type CertificateType = DownloadCertificateInput["type"];

type CertificateDescriptor = {
  filename: string;
  size: number;
  format: string;
  googleDriveUrl: string;
  certificateName: string;
  issuer: string;
  year: string;
};

const CERTIFICATE_MAP: Record<CertificateType, CertificateDescriptor> = {
  aws: {
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

export const downloadCertificate = tool<
  DownloadCertificateInput,
  DownloadCertificateResponse
>({
  description: "Provide certificate download links for verified achievements.",
  inputSchema: downloadCertificateInputSchema,
  outputSchema: downloadCertificateResponseSchema,
  execute: async (input) => {
    const certificate = CERTIFICATE_MAP[input.type];
    if (!certificate) {
      return createErrorResponse(`Invalid certificate type: ${input.type}`);
    }

    return createSuccessResponse({
      url: `/assets/${certificate.filename}`,
      filename: certificate.filename,
      size: certificate.size,
      format: certificate.format,
      googleDriveUrl: certificate.googleDriveUrl,
      certificateName: certificate.certificateName,
      issuer: certificate.issuer,
      year: certificate.year,
    });
  },
});
