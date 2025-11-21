import { buildCurrentTimeContext } from "@/lib/time/time-context";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";
import type { AgentConfig } from "@mastra/core/agent";
import { Agent } from "@mastra/core/agent";
import type { SystemMessage } from "@mastra/core/llm";
import type { UIMessage } from "ai";

export interface AgentExecutionContext {
  query: string;
  threadId: string;
  userId: string;
  history: UIMessage[];
}

export class BasePortfolioAgent<
  TId extends string = string,
> extends Agent<TId> {
  protected readonly memoryManager = new RedisMemoryManager();

  constructor(config: AgentConfig<TId>) {
    super(config);
  }

  async buildMemoryContext(query: string, userId: string) {
    return this.memoryManager.retrieveRelevant(query, userId);
  }

  protected formatMemorySummary(
    context: AgentExecutionContext,
    memory: Awaited<ReturnType<RedisMemoryManager["retrieveRelevant"]>>
  ): string {
    const episodicSummary = memory.episodic
      .slice(0, 5)
      .map((item) => `- [Relevance: ${(item.score * 100).toFixed(1)}%] ${item.content}`)
      .join("\n");
    const semanticSummary = JSON.stringify(memory.semantic ?? {}, null, 2);

    return [
      "MEMORY USAGE DIRECTIVE: Use the following memory layers to provide context-aware, personalized responses. Reference past conversations and user profile information when relevant.",
      `Current query: ${context.query}`,
      episodicSummary
        ? `Recent episodic context (top 5 relevant memories):\n${episodicSummary}`
        : "No episodic memories available.",
      `Semantic profile: ${semanticSummary}`,
    ].join("\n\n");
  }

  async buildInstructionMessage(
    context: AgentExecutionContext,
    baseContent: string
  ): Promise<SystemMessage> {
    const memory = await this.buildMemoryContext(context.query, context.userId);
    const summary = this.formatMemorySummary(context, memory);
    const timeContext = buildCurrentTimeContext();
    return {
      role: "system",
      content: `${baseContent}\n\n${timeContext}\n\n${summary}`,
    };
  }
}
