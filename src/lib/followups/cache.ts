/**
 * Follow-up Suggestion Caching Layer
 *
 * Provides in-memory caching for generated follow-up suggestions with:
 * - Thread-based key isolation
 * - TTL-based expiration (5 minutes)
 * - Automatic cleanup of expired entries
 */

import type { FollowupResponseType } from "@/lib/schemas/followup-schema";

interface CacheEntry {
  data: FollowupResponseType;
  expiresAt: number;
}

class FollowupCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate cache key for thread
   */
  private getKey(threadId: string): string {
    return `followups:${threadId}`;
  }

  /**
   * Store follow-up suggestions for a thread
   */
  set(threadId: string, data: FollowupResponseType): void {
    const key = this.getKey(threadId);
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.TTL_MS,
    });

    // Clean up expired entries (background cleanup)
    this.cleanup();
  }

  /**
   * Retrieve cached follow-up suggestions
   * Returns null if not found or expired
   */
  get(threadId: string): FollowupResponseType | null {
    const key = this.getKey(threadId);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Remove cached suggestions for a thread
   */
  delete(threadId: string): void {
    const key = this.getKey(threadId);
    this.cache.delete(key);
  }

  /**
   * Clean up all expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cached entries (useful for testing)
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const followupCache = new FollowupCache();
