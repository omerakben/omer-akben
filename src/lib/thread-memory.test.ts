import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanExpiredThreads,
  deleteThread,
  listThreads,
  loadThread,
  saveThread,
  type Thread,
} from "./thread-memory";

// Mock localStorage with enumerable keys (needed for Object.keys(localStorage))
const localStorageMock: Storage = (() => {
  const store: Record<string, string> = {};

  const mock: Record<string, unknown> & Partial<Storage> = {
    getItem(key: string): string | null {
      return store[key] || null;
    },
    setItem(key: string, value: string): void {
      store[key] = value;
      // Make key enumerable on the mock object so Object.keys(localStorage) works
      Object.defineProperty(mock, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    },
    removeItem(key: string): void {
      delete store[key];
      delete mock[key];
    },
    clear(): void {
      Object.keys(store).forEach((key) => {
        delete mock[key];
      });
      Object.keys(store).forEach((key) => delete store[key]);
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key(index: number): string | null {
      return Object.keys(store)[index] || null;
    },
  };

  return mock as Storage;
})();

// Ensure window object exists for tests
if (typeof window === "undefined") {
  // @ts-expect-error - Mocking global window for tests
  global.window = {};
}

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe("thread-memory", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe("saveThread", () => {
    it("should save a thread to localStorage", () => {
      const messages = [
        { id: "1", role: "user", content: "Hello" },
        { id: "2", role: "assistant", content: "Hi there!" },
      ];

      saveThread("test-thread", messages);

      const stored = localStorage.getItem("thread_test-thread");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!) as Thread;
      expect(parsed.id).toBe("test-thread");
      expect(parsed.messages).toEqual(messages);
      expect(parsed.createdAt).toBeTypeOf("number");
      expect(parsed.lastAccessedAt).toBeTypeOf("number");
    });

    it("should overwrite existing thread with new messages", () => {
      const messages1 = [{ id: "1", role: "user", content: "First" }];
      const messages2 = [
        { id: "1", role: "user", content: "First" },
        { id: "2", role: "assistant", content: "Second" },
      ];

      saveThread("test-thread", messages1);
      saveThread("test-thread", messages2);

      const stored = localStorage.getItem("thread_test-thread");
      const parsed = JSON.parse(stored!) as Thread;

      expect(parsed.messages).toEqual(messages2);
      expect(parsed.messages).toHaveLength(2);
    });

    it("should handle empty messages array", () => {
      saveThread("empty-thread", []);

      const stored = localStorage.getItem("thread_empty-thread");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!) as Thread;
      expect(parsed.messages).toEqual([]);
    });

    it("should handle localStorage quota exceeded gracefully", () => {
      // Mock quota exceeded error
      const originalSetItem = localStorage.setItem;
      let callCount = 0;

      vi.spyOn(localStorage, "setItem").mockImplementation((key, value) => {
        callCount++;
        if (callCount === 1) {
          const error = new Error("QuotaExceededError");
          error.name = "QuotaExceededError";
          throw error;
        }
        return originalSetItem.call(localStorage, key, value);
      });

      // Should retry after clearing old threads
      expect(() => {
        saveThread("quota-test", [{ id: "1", role: "user", content: "Test" }]);
      }).not.toThrow();

      expect(callCount).toBeGreaterThan(1); // Should have retried

      vi.restoreAllMocks();
    });
  });

  describe("loadThread", () => {
    it("should load an existing thread", () => {
      const messages = [
        { id: "1", role: "user", content: "Hello" },
        { id: "2", role: "assistant", content: "Hi!" },
      ];

      saveThread("test-load", messages);
      const loaded = loadThread("test-load");

      expect(loaded).toEqual(messages);
    });

    it("should return null for non-existent thread", () => {
      const loaded = loadThread("non-existent");
      expect(loaded).toBeNull();
    });

    it("should handle corrupted data gracefully", () => {
      localStorage.setItem("thread_corrupted", "invalid json{");
      const loaded = loadThread("corrupted");
      expect(loaded).toBeNull();
    });

    it("should return null for expired threads", () => {
      const messages = [{ id: "1", role: "user", content: "Expired" }];

      // Save thread in the past (25 hours ago, TTL is 24 hours)
      const pastTimestamp = Date.now() - 25 * 60 * 60 * 1000;
      const thread: Thread = {
        id: "expired-thread",
        messages,
        createdAt: pastTimestamp,
        lastAccessedAt: pastTimestamp,
      };

      localStorage.setItem("thread_expired-thread", JSON.stringify(thread));

      const loaded = loadThread("expired-thread");
      expect(loaded).toBeNull();
    });

    it("should return valid threads within 24-hour TTL", () => {
      const messages = [{ id: "1", role: "user", content: "Valid" }];

      // Save thread 1 hour ago (well within TTL)
      const recentTimestamp = Date.now() - 1 * 60 * 60 * 1000;
      const thread: Thread = {
        id: "valid-thread",
        messages,
        createdAt: recentTimestamp,
        lastAccessedAt: recentTimestamp,
      };

      localStorage.setItem("thread_valid-thread", JSON.stringify(thread));

      const loaded = loadThread("valid-thread");
      expect(loaded).toEqual(messages);
    });
  });

  describe("cleanExpiredThreads", () => {
    it("should remove threads older than 24 hours", () => {
      // Create fresh thread
      saveThread("fresh", [{ id: "1", role: "user", content: "Fresh" }]);

      // Create expired thread manually
      const expiredThread: Thread = {
        id: "expired",
        messages: [{ id: "2", role: "user", content: "Expired" }],
        createdAt: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
        lastAccessedAt: Date.now() - 25 * 60 * 60 * 1000,
      };
      localStorage.setItem("thread_expired", JSON.stringify(expiredThread));

      cleanExpiredThreads();

      expect(localStorage.getItem("thread_fresh")).toBeTruthy();
      expect(localStorage.getItem("thread_expired")).toBeNull();
    });

    it("should handle corrupted thread data during cleanup", () => {
      localStorage.setItem(
        "thread_good",
        JSON.stringify({
          id: "good",
          messages: [],
          createdAt: Date.now(),
          lastAccessedAt: Date.now(),
        })
      );
      localStorage.setItem("thread_bad", "invalid json");

      expect(() => cleanExpiredThreads()).not.toThrow();

      // Good thread should remain
      expect(localStorage.getItem("thread_good")).toBeTruthy();
      // Bad thread should be removed
      expect(localStorage.getItem("thread_bad")).toBeNull();
    });

    it("should not affect non-thread localStorage items", () => {
      localStorage.setItem("other-key", "other-value");

      const expiredThread: Thread = {
        id: "test",
        messages: [],
        createdAt: Date.now() - 25 * 60 * 60 * 1000,
        lastAccessedAt: Date.now() - 25 * 60 * 60 * 1000,
      };
      localStorage.setItem("thread_test", JSON.stringify(expiredThread));

      cleanExpiredThreads();

      expect(localStorage.getItem("other-key")).toBe("other-value");
      expect(localStorage.getItem("thread_test")).toBeNull();
    });

    it("should handle empty localStorage", () => {
      expect(() => cleanExpiredThreads()).not.toThrow();
    });
  });

  describe("deleteThread", () => {
    it("should delete an existing thread", () => {
      const messages = [{ id: "1", role: "user", content: "Delete me" }];
      saveThread("to-delete", messages);

      expect(localStorage.getItem("thread_to-delete")).toBeTruthy();

      deleteThread("to-delete");

      expect(localStorage.getItem("thread_to-delete")).toBeNull();
    });

    it("should not throw when deleting non-existent thread", () => {
      expect(() => deleteThread("non-existent")).not.toThrow();
    });

    it("should only delete the specified thread", () => {
      saveThread("thread1", [{ id: "1", role: "user", content: "One" }]);
      saveThread("thread2", [{ id: "2", role: "user", content: "Two" }]);

      deleteThread("thread1");

      expect(localStorage.getItem("thread_thread1")).toBeNull();
      expect(localStorage.getItem("thread_thread2")).toBeTruthy();
    });
  });

  describe("listThreads", () => {
    it("should return empty array when no threads exist", () => {
      const threads = listThreads();
      expect(threads).toEqual([]);
    });

    it("should list all thread IDs", () => {
      saveThread("thread1", [{ id: "1", role: "user", content: "One" }]);
      saveThread("thread2", [{ id: "2", role: "user", content: "Two" }]);
      saveThread("thread3", [{ id: "3", role: "user", content: "Three" }]);

      const threads = listThreads();

      expect(threads).toHaveLength(3);
      expect(threads).toContain("thread1");
      expect(threads).toContain("thread2");
      expect(threads).toContain("thread3");
    });

    it("should not include non-thread localStorage keys", () => {
      localStorage.setItem("other-key", "value");
      saveThread("thread1", [{ id: "1", role: "user", content: "One" }]);

      const threads = listThreads();

      expect(threads).toEqual(["thread1"]);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle typical conversation flow", () => {
      // Start conversation
      const msg1 = [{ id: "1", role: "user", content: "Hello" }];
      saveThread("conversation", msg1);

      // Add AI response
      const msg2 = [
        ...msg1,
        { id: "2", role: "assistant", content: "Hi there!" },
      ];
      saveThread("conversation", msg2);

      // Add user follow-up
      const msg3 = [
        ...msg2,
        { id: "3", role: "user", content: "How are you?" },
      ];
      saveThread("conversation", msg3);

      // Load conversation
      const loaded = loadThread("conversation");
      expect(loaded).toEqual(msg3);
      expect(loaded).toHaveLength(3);
    });

    it("should handle page refresh scenario", () => {
      // Simulate saving before refresh
      const messages = [
        { id: "1", role: "user", content: "Before refresh" },
        { id: "2", role: "assistant", content: "Response" },
      ];
      saveThread("main", messages);

      // Simulate page refresh by loading thread
      const loaded = loadThread("main");
      expect(loaded).toEqual(messages);

      // Continue conversation
      const newMessages = [
        ...messages,
        { id: "3", role: "user", content: "After refresh" },
      ];
      saveThread("main", newMessages);

      expect(loadThread("main")).toEqual(newMessages);
    });

    it("should handle concurrent thread management", () => {
      // Multiple threads active simultaneously
      saveThread("user1", [{ id: "1", role: "user", content: "User 1" }]);
      saveThread("user2", [{ id: "2", role: "user", content: "User 2" }]);
      saveThread("user3", [{ id: "3", role: "user", content: "User 3" }]);

      const threads = listThreads();
      expect(threads).toHaveLength(3);

      // Each thread maintains its own state
      expect(loadThread("user1")).toEqual([
        { id: "1", role: "user", content: "User 1" },
      ]);
      expect(loadThread("user2")).toEqual([
        { id: "2", role: "user", content: "User 2" },
      ]);
      expect(loadThread("user3")).toEqual([
        { id: "3", role: "user", content: "User 3" },
      ]);
    });

    it("should persist threads across multiple operations", () => {
      // Create initial threads
      saveThread("thread-a", [{ id: "a", role: "user", content: "A" }]);
      saveThread("thread-b", [{ id: "b", role: "user", content: "B" }]);

      // Verify they exist
      expect(listThreads()).toContain("thread-a");
      expect(listThreads()).toContain("thread-b");

      // Delete one
      deleteThread("thread-a");

      // Verify deletion
      expect(listThreads()).not.toContain("thread-a");
      expect(listThreads()).toContain("thread-b");

      // Add new thread
      saveThread("thread-c", [{ id: "c", role: "user", content: "C" }]);

      // Verify state
      const final = listThreads();
      expect(final).toHaveLength(2);
      expect(final).toContain("thread-b");
      expect(final).toContain("thread-c");
    });
  });

  describe("TTL Validation", () => {
    it("should respect 24-hour TTL boundary", () => {
      const messages = [{ id: "1", role: "user", content: "Test" }];

      // Thread created 23 hours ago (within TTL)
      const thread23h: Thread = {
        id: "thread-23h",
        messages,
        createdAt: Date.now() - 23 * 60 * 60 * 1000,
        lastAccessedAt: Date.now() - 23 * 60 * 60 * 1000,
      };
      localStorage.setItem("thread_thread-23h", JSON.stringify(thread23h));

      expect(loadThread("thread-23h")).toEqual(messages);

      // Thread created 25 hours ago (expired)
      const thread25h: Thread = {
        id: "thread-25h",
        messages,
        createdAt: Date.now() - 25 * 60 * 60 * 1000,
        lastAccessedAt: Date.now() - 25 * 60 * 60 * 1000,
      };
      localStorage.setItem("thread_thread-25h", JSON.stringify(thread25h));

      expect(loadThread("thread-25h")).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in thread IDs", () => {
      const threadId = "thread-with-special_chars.123";
      const messages = [{ id: "1", role: "user", content: "Special" }];

      saveThread(threadId, messages);
      expect(loadThread(threadId)).toEqual(messages);
      expect(listThreads()).toContain(threadId);
    });

    it("should handle very long messages arrays", () => {
      const longMessages = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Message ${i}`,
      }));

      saveThread("long-thread", longMessages);
      const loaded = loadThread("long-thread");

      expect(loaded).toHaveLength(100);
      expect(loaded).toEqual(longMessages);
    });

    it("should handle rapid sequential saves", () => {
      for (let i = 0; i < 10; i++) {
        saveThread("rapid-test", [
          { id: `${i}`, role: "user", content: `Msg ${i}` },
        ]);
      }

      const loaded = loadThread("rapid-test");
      expect(loaded).toHaveLength(1);
      expect(loaded![0].content).toBe("Msg 9"); // Last save wins
    });
  });
});
