import { describe, expect, it } from "vitest";
import { statusData, type Persona } from "@/data/status";

describe("statusData", () => {
  it("should include all primary sections", () => {
    expect(statusData.hero).toBeDefined();
    expect(statusData.capabilities).toBeDefined();
    expect(statusData.metrics).toBeDefined();
    expect(statusData.milestones).toBeDefined();
    expect(statusData.roadmap).toBeDefined();
    expect(statusData.lessons).toBeDefined();
    expect(statusData.howToUse).toBeDefined();
  });

  it("should provide hero copy and CTAs", () => {
    expect(statusData.hero.title).toBeTruthy();
    expect(statusData.hero.subtitle).toBeTruthy();
    expect(statusData.hero.ctas.chatHref).toBeTruthy();
    expect(statusData.hero.ctas.resumeHref).toBeTruthy();
  });

  it("should list at least seven capabilities", () => {
    expect(statusData.capabilities.length).toBeGreaterThanOrEqual(7);
    statusData.capabilities.forEach((capability) => {
      expect(capability.id).toBeTruthy();
      expect(capability.title).toBeTruthy();
      expect(capability.summary).toBeTruthy();
    });
  });

  it("should expose four metrics badges", () => {
    expect(statusData.metrics).toHaveLength(4);
    statusData.metrics.forEach((metric) => {
      expect(metric.label).toBeTruthy();
      expect(metric.value).toBeTruthy();
    });
  });

  it("should include recent milestones", () => {
    expect(statusData.milestones.length).toBeGreaterThanOrEqual(3);
    statusData.milestones.forEach((milestone) => {
      expect(milestone.date).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
      expect(milestone.title).toBeTruthy();
      expect(milestone.details.length).toBeGreaterThan(0);
    });
  });

  it("should have roadmap entries for now/next/later", () => {
    expect(statusData.roadmap.now.length).toBeGreaterThan(0);
    expect(statusData.roadmap.next.length).toBeGreaterThan(0);
    expect(statusData.roadmap.later.length).toBeGreaterThan(0);
  });

  it("should log lessons with timestamps", () => {
    expect(statusData.lessons.length).toBeGreaterThan(0);
    statusData.lessons.forEach((lesson) => {
      expect(lesson.date).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
      expect(lesson.note).toBeTruthy();
    });
  });

  it("should include how-to prompts for each persona", () => {
    const personas: Persona[] = ["recruiters", "engineers", "curious"];
    personas.forEach((persona) => {
      const entry = statusData.howToUse.find((item) => item.persona === persona);
      expect(entry).toBeDefined();
      expect((entry?.prompts.length ?? 0)).toBeGreaterThan(0);
    });
  });

  it("should define feature spotlights", () => {
    expect(statusData.spotlights.length).toBeGreaterThan(0);
    statusData.spotlights.forEach((spotlight) => {
      expect(spotlight.id).toBeTruthy();
      expect(spotlight.title).toBeTruthy();
      expect(spotlight.summary).toBeTruthy();
      expect(spotlight.details.length).toBeGreaterThan(0);
    });
  });
});
