import { z } from "zod";

// Shared schemas
export const toolResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

// download_resume tool schema
export const downloadResumeInputSchema = z.object({
  format: z
    .enum(["full", "short", "three-page", "docx"])
    .optional()
    .default("full"),
});

export const downloadResumeOutputSchema = z.object({
  url: z.string().url(),
  filename: z.string(),
  size: z.number(),
  format: z.string().describe("File format (pdf or docx)"),
  googleDriveUrl: z
    .string()
    .url()
    .optional()
    .describe("Fallback Google Drive link"),
});

// list_projects tool schema
export const listProjectsInputSchema = z.object({
  category: z
    .enum(["all", "ai-ml", "web", "mobile", "tools", "other"])
    .optional(),
  featured: z.boolean().optional(),
  limit: z.number().min(1).max(50).optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  role: z.enum(["Full-Stack", "AI", "QA", "QA/AI"]),
  category: z.enum(["ai-ml", "web", "mobile", "tools", "other"]),
  featured: z.boolean(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  status: z.enum(["completed", "in-progress", "planned"]),
});

export const listProjectsOutputSchema = z.object({
  projects: z.array(projectSchema),
  total: z.number(),
});

// open_project tool schema
export const openProjectInputSchema = z.object({
  slug: z.string(),
});

export const projectDetailSchema = projectSchema.extend({
  longDescription: z.string().optional(),
  image: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const openProjectOutputSchema = z.object({
  project: projectDetailSchema,
});

// get_contact tool schema
export const getContactInputSchema = z.object({});

export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
  linkedin: z.string().url(),
  github: z.string().url(),
  twitter: z.string().url().optional(),
});

export const getContactOutputSchema = z.object({
  contact: contactInfoSchema,
});

// download_certificate tool schema
export const downloadCertificateInputSchema = z.object({
  type: z
    .enum(["aws", "nss"])
    .describe(
      "Certificate type: aws (AWS Solutions Architect) or nss (Nashville Software School)"
    ),
});

export const downloadCertificateOutputSchema = z.object({
  url: z.string().url(),
  filename: z.string(),
  size: z.number(),
  format: z.string().describe("File format (pdf)"),
  googleDriveUrl: z
    .string()
    .url()
    .optional()
    .describe("Fallback Google Drive link"),
  certificateName: z.string().describe("Full certificate name"),
  issuer: z.string().describe("Certificate issuing organization"),
  year: z.string().describe("Year certificate was issued"),
});

// Type exports
export type DownloadResumeInput = z.infer<typeof downloadResumeInputSchema>;
export type DownloadResumeOutput = z.infer<typeof downloadResumeOutputSchema>;
export type ListProjectsInput = z.infer<typeof listProjectsInputSchema>;
export type ListProjectsOutput = z.infer<typeof listProjectsOutputSchema>;
export type OpenProjectInput = z.infer<typeof openProjectInputSchema>;
export type OpenProjectOutput = z.infer<typeof openProjectOutputSchema>;
export type GetContactInput = z.infer<typeof getContactInputSchema>;
export type GetContactOutput = z.infer<typeof getContactOutputSchema>;
export type DownloadCertificateInput = z.infer<
  typeof downloadCertificateInputSchema
>;
export type DownloadCertificateOutput = z.infer<
  typeof downloadCertificateOutputSchema
>;
