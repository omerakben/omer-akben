import { getCheckpointer } from "@/lib/mastra/memory/checkpointer";
import {
  RedisEpisodicMemory,
  type EpisodicMemoryResult,
} from "@/lib/mastra/memory/episodic";
import {
  RedisSemanticMemory,
  type SemanticMemoryPayload,
} from "@/lib/mastra/memory/semantic";
import type {
  ChannelVersions,
  CheckpointMetadata,
} from "@langchain/langgraph-checkpoint";
import type { UIMessage } from "ai";

export class RedisMemoryManager {
  private readonly episodic = new RedisEpisodicMemory();
  private readonly semantic = new RedisSemanticMemory();

  async saveSTM(threadId: string, messages: UIMessage[]): Promise<void> {
    const metadata: CheckpointMetadata = {
      source: "input",
      step: messages.length,
      parents: {},
    };
    const versions: ChannelVersions = {};
    const checkpoint = {
      v: 4,
      id: `${Date.now()}`,
      ts: new Date().toISOString(),
      channel_values: { messages },
      channel_versions: {},
      versions_seen: {},
    };

    await getCheckpointer().put(
      { configurable: { thread_id: threadId } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      checkpoint as any,
      metadata,
      versions
    );
  }

  async loadSTM(threadId: string): Promise<UIMessage[]> {
    const checkpoint = await getCheckpointer().get({
      configurable: { thread_id: threadId },
    });
    return (
      (checkpoint?.channel_values?.messages as UIMessage[] | undefined) ?? []
    );
  }

  async saveLTM(threadId: string, messages: UIMessage[]): Promise<void> {
    await this.episodic.saveConversation(threadId, messages);
  }

  async retrieveEpisodic(
    query: string,
    limit = 3
  ): Promise<EpisodicMemoryResult[]> {
    return this.episodic.search(query, limit);
  }

  async setSemantic(
    userId: string,
    payload: SemanticMemoryPayload
  ): Promise<void> {
    await this.semantic.setFacts(userId, payload);
  }

  async mergeSemantic(
    userId: string,
    facts: Record<string, unknown>
  ): Promise<void> {
    await this.semantic.mergeFacts(userId, facts);
  }

  async getSemantic<T = SemanticMemoryPayload>(
    userId: string
  ): Promise<T | null> {
    return this.semantic.getFacts<T>(userId);
  }

  async retrieveRelevant(query: string, userId: string) {
    const [episodic, semantic] = await Promise.all([
      this.retrieveEpisodic(query, 3),
      this.getSemantic(userId),
    ]);

    return {
      episodic,
      semantic,
    };
  }
}
