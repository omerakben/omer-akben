import type { Page } from "@playwright/test";

declare global {
  interface Window {
    skillsContrastFrames: {
      frames: number;
      failures: { selector: string; ratio: number; opacity: number }[];
    };
  }
}

/** Observe every rendered frame, including hydration and theme transitions. */
export async function recordSkillsContrast(page: Page) {
  await page.addInitScript(() => {
    window.skillsContrastFrames = { frames: 0, failures: [] };
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d")!;
    const color = (value: string) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data);
    };
    const blend = (foreground: number[], background: number[], alpha: number) =>
      background.map((channel, index) => foreground[index] * alpha + channel * (1 - alpha));
    const luminance = (rgb: number[]) => {
      const linear = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const sample = () => {
      const selectors = ["main p.text-lg", "main input[placeholder='Search skills...']", "main label"];
      let found = 0;
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (!element) continue;
        found++;
        const chain: Element[] = [];
        for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
          chain.unshift(ancestor);
        }
        let background = [255, 255, 255];
        let opacity = 1;
        for (const ancestor of chain) {
          const style = getComputedStyle(ancestor);
          const rgba = color(style.backgroundColor);
          background = blend(rgba, background, rgba[3] / 255);
          opacity *= Number(style.opacity);
        }
        const textStyle = getComputedStyle(element, element instanceof HTMLInputElement ? "::placeholder" : null);
        const rgba = color(textStyle.color);
        const foreground = blend(rgba, background, (rgba[3] / 255) * opacity * Number(textStyle.opacity));
        const a = luminance(foreground);
        const b = luminance(background);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        if ((ratio < 4.5 || opacity < 1) && window.skillsContrastFrames.failures.length < 30) {
          window.skillsContrastFrames.failures.push({ selector, ratio, opacity });
        }
      }
      if (found === selectors.length) window.skillsContrastFrames.frames++;
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
}
