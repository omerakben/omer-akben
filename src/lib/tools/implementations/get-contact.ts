import { getContactInfo } from "@/data/facts";
import { tool } from "ai";
import { createTool } from "@mastra/core";
import {
  getContactInputSchema,
  getContactOutputSchema,
  type GetContactInput,
  type GetContactOutput,
} from "@/lib/tools/zod-schemas";

export async function resolveGetContact(
  _input: GetContactInput = {}
): Promise<GetContactOutput> {
  const contact = getContactInfo();
  return { contact };
}

export const getContactAiTool = tool({
  description: "Retrieve Omer Akben's primary contact channels (email, social, location).",
  inputSchema: getContactInputSchema,
  outputSchema: getContactOutputSchema,
  execute: async () => resolveGetContact({}),
});

export const getContactMastraTool = createTool({
  id: "get_contact",
  description: "Retrieve Omer Akben's primary contact information.",
  inputSchema: getContactInputSchema,
  outputSchema: getContactOutputSchema,
  execute: async () => resolveGetContact({}),
});
