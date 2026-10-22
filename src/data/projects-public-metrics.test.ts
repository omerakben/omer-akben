import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";

describe("public project copy lock", () => {
  it("does not publish retired 30/27/84 counts on the chatbot project", () => {
    const chatbot = projects.find((project) => project.slug === "tuel-chatbot");
    expect(chatbot).toBeDefined();

    const copy = `${chatbot?.description ?? ""}\n${chatbot?.longDescription ?? ""}`;
    expect(copy).not.toMatch(/30 AI assistants|27 teachers|84 students/);
  });
});
