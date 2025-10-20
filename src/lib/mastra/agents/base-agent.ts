import type { AgentConfig } from "@mastra/core/agent";
import { Agent } from "@mastra/core/agent";
import type { SystemMessage } from "@mastra/core/llm";
import type { UIMessage } from "ai";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";

export interface AgentExecutionContext {
  query: string;
  threadId: string;
  userId: string;
  history: UIMessage[];
}

export class BasePortfolioAgent<TId extends string = string> extends Agent<TId> {
  protected readonly memoryManager = new RedisMemoryManager();

  constructor(config: AgentConfig<TId>) {
    super(config);
  }

  async buildMemoryContext(query: string, userId: string) {
    return this.memoryManager.retrieveRelevant(query, userId);
  }

  protected formatMemorySummary(context: AgentExecutionContext, memory: Awaited<ReturnType<RedisMemoryManager["retrieveRelevant"]>>): string {
    const episodicSummary = memory.episodic
      .map((item) => `- ${item.content}`)
      .slice(0, 3)
      .join("\n");
    const semanticSummary = JSON.stringify(memory.semantic ?? {}, null, 2);

    return [
      "You are working with persisted memory layers.",
      `Current query: ${context.query}`,
      episodicSummary ? `Recent episodic context:\n${episodicSummary}` : "No episodic memories available.",
      `Semantic profile: ${semanticSummary}`,
    ].join("\n\n");
  }

  async buildInstructionMessage(context: AgentExecutionContext, baseContent: string): Promise<SystemMessage> {
    const memory = await this.buildMemoryContext(context.query, context.userId);
    const summary = this.formatMemorySummary(context, memory);
    return {
      role: "system",
      content: `${baseContent}\n\n${summary}`,
    };
  }
}
