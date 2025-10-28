import { tool } from "ai";
import { getContactInfo } from "@/data/facts";
import {
  getContactInputSchema,
  getContactOutputSchema,
  type GetContactInput,
  type GetContactOutput,
} from "@/lib/tools/zod-schemas";

export function getContact(_: GetContactInput): GetContactOutput {
  const contact = getContactInfo();
  return { contact };
}

export const getContactTool = tool({
  name: "get_contact",
  description: "Return primary contact channels for Omer Akben.",
  inputSchema: getContactInputSchema,
  outputSchema: getContactOutputSchema,
  execute: async (input) => getContact(input),
});
