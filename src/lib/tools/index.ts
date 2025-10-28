import type { Tool } from "ai";
import type { Tool as MastraToolClass } from "@mastra/core/tools";

import {
  getContactAiTool,
  getContactMastraTool,
} from "@/lib/tools/implementations/get-contact";

export type AiToolRegistry = Record<string, Tool>;
export type MastraToolRegistry = Record<string, MastraToolClass<any, any>>;

export const aiTools: AiToolRegistry = {
  get_contact: getContactAiTool,
};

export const mastraTools: MastraToolRegistry = {
  get_contact: getContactMastraTool,
};

export { getContactAiTool, getContactMastraTool } from "@/lib/tools/implementations/get-contact";
