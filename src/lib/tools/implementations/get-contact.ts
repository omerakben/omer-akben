import { getContactInfo } from "@/data/facts";
import { tool } from "ai";

import {
  GetContactInput,
  GetContactResponse,
  createSuccessResponse,
  getContactInputSchema,
  getContactResponseSchema,
} from "@/lib/tools/zod-schemas";

export const getContact = tool<GetContactInput, GetContactResponse>({
  description: "Retrieve Omer's preferred contact information.",
  inputSchema: getContactInputSchema,
  outputSchema: getContactResponseSchema,
  execute: async () =>
    createSuccessResponse({
      contact: getContactInfo(),
    }),
});
