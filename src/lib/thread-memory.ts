/**
 * Thread Memory Utility
 *
 * Provides localStorage-based conversation persistence with 24-hour TTL.
 * Automatically cleans expired threads and implements LRU eviction.
 */

export interface Message {
  id: string;
  role: string;
  content?: string;
  [key: string]: unknown;
}

export interface Thread {
  id: string;
  messages: Message[];
  createdAt: number;
  lastAccessedAt: number;
  pinned?: boolean;
}

const TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_THREADS = 10; // Maximum threads to keep (LRU eviction)
const STORAGE_PREFIX = "thread_";

/**
 * Save a thread to localStorage with current timestamp
 */
export function saveThread(
  threadId: string,
  messages: Message[],
  pinned?: boolean
): void {
  if (typeof window === "undefined") return;

  // Try to preserve existing thread metadata
  let existingThread: Thread | null = null;
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${threadId}`);
    if (stored) {
      existingThread = JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }

  const thread: Thread = {
    id: threadId,
    messages,
    createdAt: existingThread?.createdAt || Date.now(),
    lastAccessedAt: Date.now(),
    pinned: pinned !== undefined ? pinned : existingThread?.pinned,
  };

  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${threadId}`,
      JSON.stringify(thread)
    );
    enforceThreadLimit();
  } catch (error) {
    console.error("[ThreadMemory] Failed to save thread:", error);
    // If quota exceeded, clean old threads and retry
    cleanExpiredThreads();
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${threadId}`,
        JSON.stringify(thread)
      );
    } catch (retryError) {
      console.error(
        "[ThreadMemory] Failed to save thread after cleanup:",
        retryError
      );
    }
  }
}

/**
 * Load a thread from localStorage, respecting TTL
 * Returns null if thread doesn't exist or has expired
 */
export function loadThread(threadId: string): Message[] | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${threadId}`);
    if (!stored) return null;

    const thread: Thread = JSON.parse(stored);

    // Check TTL
    if (Date.now() - thread.createdAt > TTL) {
      localStorage.removeItem(`${STORAGE_PREFIX}${threadId}`);
      return null;
    }

    // Update last accessed timestamp
    thread.lastAccessedAt = Date.now();
    localStorage.setItem(
      `${STORAGE_PREFIX}${threadId}`,
      JSON.stringify(thread)
    );

    return thread.messages;
  } catch (error) {
    console.error("[ThreadMemory] Failed to load thread:", error);
    return null;
  }
}

/**
 * Clean all expired threads from localStorage
 */
export function cleanExpiredThreads(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(STORAGE_PREFIX)
    );
    const now = Date.now();

    keys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return;

        const thread: Thread = JSON.parse(stored);
        if (now - thread.createdAt > TTL) {
          localStorage.removeItem(key);
        }
      } catch {
        // Remove corrupted threads
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("[ThreadMemory] Failed to clean expired threads:", error);
  }
}

/**
 * Enforce thread limit using LRU eviction
 * Keeps only the most recently accessed threads
 */
function enforceThreadLimit(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(STORAGE_PREFIX)
    );

    if (keys.length <= MAX_THREADS) return;

    // Parse all threads and sort by lastAccessedAt
    const threads: { key: string; thread: Thread }[] = [];

    keys.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return;
        const thread: Thread = JSON.parse(stored);
        threads.push({ key, thread });
      } catch {
        // Remove corrupted threads
        localStorage.removeItem(key);
      }
    });

    // Sort by lastAccessedAt (oldest first)
    threads.sort((a, b) => a.thread.lastAccessedAt - b.thread.lastAccessedAt);

    // Remove oldest threads until we're under the limit
    const toRemove = threads.length - MAX_THREADS;
    for (let i = 0; i < toRemove; i++) {
      localStorage.removeItem(threads[i].key);
    }
  } catch (error) {
    console.error("[ThreadMemory] Failed to enforce thread limit:", error);
  }
}

/**
 * Delete a specific thread
 */
export function deleteThread(threadId: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${threadId}`);
  } catch (error) {
    console.error("[ThreadMemory] Failed to delete thread:", error);
  }
}

/**
 * List all thread IDs
 */
export function listThreads(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(STORAGE_PREFIX)
    );
    return keys.map((k) => k.replace(STORAGE_PREFIX, ""));
  } catch (error) {
    console.error("[ThreadMemory] Failed to list threads:", error);
    return [];
  }
}

/**
 * Get full thread object (not just messages)
 * Useful for accessing metadata like pinned state
 */
export function getThread(threadId: string): Thread | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${threadId}`);
    if (!stored) return null;

    const thread: Thread = JSON.parse(stored);

    // Check TTL
    if (Date.now() - thread.createdAt > TTL) {
      localStorage.removeItem(`${STORAGE_PREFIX}${threadId}`);
      return null;
    }

    return thread;
  } catch (error) {
    console.error("[ThreadMemory] Failed to get thread:", error);
    return null;
  }
}

/**
 * Update pinned state for a thread
 */
export function setPinnedState(threadId: string, pinned: boolean): void {
  if (typeof window === "undefined") return;

  try {
    const thread = getThread(threadId);
    if (!thread) return;

    thread.pinned = pinned;
    thread.lastAccessedAt = Date.now();

    localStorage.setItem(
      `${STORAGE_PREFIX}${threadId}`,
      JSON.stringify(thread)
    );
  } catch (error) {
    console.error("[ThreadMemory] Failed to set pinned state:", error);
  }
}
