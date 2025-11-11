import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MetricsRow } from "@/components/status/MetricsRow";

const metrics = [
  { label: "Commit", value: "abc1234", tooltip: "Current SHA" },
  { label: "Deploy", value: "2025-11-10 09:42 UTC", tooltip: "Build timestamp" },
];

describe("MetricsRow", () => {
  it("renders metric labels and values", () => {
    render(<MetricsRow items={metrics} />);

    metrics.forEach((metric) => {
      expect(screen.getByText(metric.label)).toBeVisible();
      expect(screen.getByText(metric.value)).toBeVisible();
    });
  });
});
