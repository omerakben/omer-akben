import { z } from "zod";

const toolSuccessSchema = <TSchema extends z.ZodTypeAny>(dataSchema: TSchema) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    error: z.undefined().optional(),
  });

const toolErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  data: z.undefined().optional(),
});

export const createToolResponseSchema = <TSchema extends z.ZodTypeAny>(
  dataSchema: TSchema
) => z.union([toolSuccessSchema(dataSchema), toolErrorSchema]);

export type ToolSuccess<TData> = {
  success: true;
  data: TData;
};

export type ToolError = {
  success: false;
  error: string;
};

export type ToolResponse<TData> = ToolSuccess<TData> | ToolError;

export const createSuccessResponse = <TData>(
  data: TData
): ToolSuccess<TData> => ({
  success: true,
  data,
});

export const createErrorResponse = (message: string): ToolError => ({
  success: false,
  error: message,
});

export const toolResponseSchema = createToolResponseSchema(z.unknown());

export const downloadResumeInputSchema = z.object({
  format: z.enum(["resume", "extended"]).optional().default("resume"),
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

export const downloadResumeResponseSchema = createToolResponseSchema(
  downloadResumeOutputSchema
);

export const listProjectsInputSchema = z.object({
  category: z
    .enum(["all", "ai-ml", "web", "mobile", "tools", "other"])
    .optional()
    .describe("Filter by project category (ai-ml, web, mobile, tools, other)"),
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

export const listProjectsResponseSchema = createToolResponseSchema(
  listProjectsOutputSchema
);

export const searchProjectsSemanticSchema = z.object({
  query: z
    .string()
    .describe("Natural language query for semantic project search"),
  limit: z.number().min(1).max(10).optional().default(5),
});

export const searchProjectsSemanticOutputSchema = z.object({
  results: z.array(
    z.object({
      slug: z.string(),
      score: z.number(),
      project: projectSchema.partial(),
    })
  ),
  query: z.string(),
  count: z.number(),
});

export const searchProjectsSemanticResponseSchema = createToolResponseSchema(
  searchProjectsSemanticOutputSchema
);

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

export const openProjectResponseSchema = createToolResponseSchema(
  openProjectOutputSchema
);

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

export const getContactResponseSchema = createToolResponseSchema(
  getContactOutputSchema
);

export const downloadCertificateInputSchema = z.object({
  type: z
    .enum(["aws", "nss"])
    .describe(
      "Certificate type: aws (AWS Cloud Practitioner Essentials) or nss (Nashville Software School)"
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

export const downloadCertificateResponseSchema = createToolResponseSchema(
  downloadCertificateOutputSchema
);

export const provideNavigationLinksInputSchema = z.object({
  links: z.array(
    z.object({
      label: z.string().describe("Button label text"),
      href: z.string().describe("URL or path to navigate to"),
      icon: z
        .enum([
          "briefcase",
          "github",
          "external-link",
          "arrow-right",
          "file-text",
          "zap",
          "mail",
        ])
        .optional()
        .describe("Icon name from lucide-react"),
      type: z
        .enum(["internal", "external"])
        .describe("internal for same-site navigation, external for new tab"),
    })
  ),
});

export const provideNavigationLinksOutputSchema = z.object({
  links: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      icon: z.string().optional(),
      type: z.enum(["internal", "external"]),
    })
  ),
});

export const provideNavigationLinksResponseSchema = createToolResponseSchema(
  provideNavigationLinksOutputSchema
);

export const navigatePageInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe("URL to navigate to (must be omerakben.com domain)"),
  waitUntil: z
    .enum(["load", "domcontentloaded", "networkidle"])
    .optional()
    .default("load")
    .describe("Navigation wait condition"),
});

export const navigatePageOutputSchema = z.object({
  url: z.string(),
  waitUntil: z.enum(["load", "domcontentloaded", "networkidle"]),
  message: z.string(),
});

export const navigatePageResponseSchema = createToolResponseSchema(
  navigatePageOutputSchema
);

export const scrollToSectionInputSchema = z.object({
  selector: z.string().describe("CSS selector or ARIA label to scroll to"),
  behavior: z
    .enum(["smooth", "instant"])
    .optional()
    .default("smooth")
    .describe("Scroll behavior"),
});

export const scrollToSectionOutputSchema = z.object({
  selector: z.string(),
  behavior: z.enum(["smooth", "instant"]),
  message: z.string(),
});

export const scrollToSectionResponseSchema = createToolResponseSchema(
  scrollToSectionOutputSchema
);

export const extractPageSummaryInputSchema = z.object({
  maxLength: z
    .number()
    .min(50)
    .max(500)
    .optional()
    .default(200)
    .describe("Maximum summary length in words"),
});

export const extractPageSummaryOutputSchema = z.object({
  summary: z.string(),
  wordCount: z.number(),
});

export const extractPageSummaryResponseSchema = createToolResponseSchema(
  extractPageSummaryOutputSchema
);

export const triggerWorkflowInputSchema = z.object({
  workflowId: z.string().describe("n8n workflow identifier"),
  payload: z.record(z.string(), z.unknown()).describe("Workflow input data"),
  waitForResult: z
    .boolean()
    .optional()
    .default(true)
    .describe("Wait for workflow completion"),
});

export const triggerWorkflowOutputSchema = z.object({
  workflowId: z.string(),
  status: z.enum(["completed", "running", "failed"]),
  result: z.unknown().optional(),
  message: z.string(),
});

export const triggerWorkflowResponseSchema = createToolResponseSchema(
  triggerWorkflowOutputSchema
);

export const profilePerformanceInputSchema = z.object({
  duration: z
    .number()
    .min(1000)
    .max(30000)
    .optional()
    .default(5000)
    .describe("Profiling duration in milliseconds"),
  includeScreenshots: z
    .boolean()
    .optional()
    .default(false)
    .describe("Capture performance screenshots"),
});

export const profilePerformanceOutputSchema = z.object({
  metrics: z.object({
    lcp: z.number().optional().describe("Largest Contentful Paint (ms)"),
    fid: z.number().optional().describe("First Input Delay (ms)"),
    cls: z.number().optional().describe("Cumulative Layout Shift score"),
    ttfb: z.number().optional().describe("Time to First Byte (ms)"),
  }),
  suggestions: z
    .array(z.string())
    .describe("Performance improvement suggestions"),
  traceUrl: z.string().optional().describe("Chrome DevTools trace file URL"),
});

export const profilePerformanceResponseSchema = createToolResponseSchema(
  profilePerformanceOutputSchema
);

export const collectContactInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .describe("Visitor's full name"),
  email: z
    .string()
    .email("Invalid email format")
    .describe("Visitor's email address"),
  company: z.string().max(100).optional().describe("Company name (optional)"),
  purpose: z
    .enum(["hire", "collaborate", "interview", "consult", "other"])
    .describe("Reason for contact"),
  notes: z
    .string()
    .max(500)
    .optional()
    .describe("Additional context from conversation"),
  preferredTime: z
    .string()
    .optional()
    .describe("Preferred meeting time (if mentioned)"),
});

export const collectContactOutputSchema = z.object({
  success: z.boolean(),
  emailSent: z.boolean(),
  zoomLink: z.string().url().optional(),
  message: z.string(),
  messageId: z.string().optional(),
});

export const collectContactResponseSchema = createToolResponseSchema(
  collectContactOutputSchema
);

export type DownloadResumeInput = z.infer<typeof downloadResumeInputSchema>;
export type DownloadResumeOutput = z.infer<typeof downloadResumeOutputSchema>;
export type DownloadResumeResponse = ToolResponse<DownloadResumeOutput>;

export type ListProjectsInput = z.infer<typeof listProjectsInputSchema>;
export type ListProjectsOutput = z.infer<typeof listProjectsOutputSchema>;
export type ListProjectsResponse = ToolResponse<ListProjectsOutput>;

export type OpenProjectInput = z.infer<typeof openProjectInputSchema>;
export type OpenProjectOutput = z.infer<typeof openProjectOutputSchema>;
export type OpenProjectResponse = ToolResponse<OpenProjectOutput>;

export type GetContactInput = z.infer<typeof getContactInputSchema>;
export type GetContactOutput = z.infer<typeof getContactOutputSchema>;
export type GetContactResponse = ToolResponse<GetContactOutput>;

export type DownloadCertificateInput = z.infer<
  typeof downloadCertificateInputSchema
>;
export type DownloadCertificateOutput = z.infer<
  typeof downloadCertificateOutputSchema
>;
export type DownloadCertificateResponse = ToolResponse<
  DownloadCertificateOutput
>;

export type ProvideNavigationLinksInput = z.infer<
  typeof provideNavigationLinksInputSchema
>;
export type ProvideNavigationLinksOutput = z.infer<
  typeof provideNavigationLinksOutputSchema
>;
export type ProvideNavigationLinksResponse = ToolResponse<
  ProvideNavigationLinksOutput
>;

export type NavigatePageInput = z.infer<typeof navigatePageInputSchema>;
export type NavigatePageOutput = z.infer<typeof navigatePageOutputSchema>;
export type NavigatePageResponse = ToolResponse<NavigatePageOutput>;

export type ScrollToSectionInput = z.infer<typeof scrollToSectionInputSchema>;
export type ScrollToSectionOutput = z.infer<typeof scrollToSectionOutputSchema>;
export type ScrollToSectionResponse = ToolResponse<ScrollToSectionOutput>;

export type ExtractPageSummaryInput = z.infer<
  typeof extractPageSummaryInputSchema
>;
export type ExtractPageSummaryOutput = z.infer<
  typeof extractPageSummaryOutputSchema
>;
export type ExtractPageSummaryResponse = ToolResponse<
  ExtractPageSummaryOutput
>;

export type TriggerWorkflowInput = z.infer<typeof triggerWorkflowInputSchema>;
export type TriggerWorkflowOutput = z.infer<typeof triggerWorkflowOutputSchema>;
export type TriggerWorkflowResponse = ToolResponse<TriggerWorkflowOutput>;

export type ProfilePerformanceInput = z.infer<
  typeof profilePerformanceInputSchema
>;
export type ProfilePerformanceOutput = z.infer<
  typeof profilePerformanceOutputSchema
>;
export type ProfilePerformanceResponse = ToolResponse<
  ProfilePerformanceOutput
>;

export type SearchProjectsSemanticInput = z.infer<
  typeof searchProjectsSemanticSchema
>;
export type SearchProjectsSemanticOutput = z.infer<
  typeof searchProjectsSemanticOutputSchema
>;
export type SearchProjectsSemanticResponse = ToolResponse<
  SearchProjectsSemanticOutput
>;

export type CollectContactInput = z.infer<typeof collectContactInputSchema>;
export type CollectContactOutput = z.infer<typeof collectContactOutputSchema>;
export type CollectContactResponse = ToolResponse<CollectContactOutput>;
