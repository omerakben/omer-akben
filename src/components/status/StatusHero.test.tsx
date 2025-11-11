import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusHero } from "@/components/status/StatusHero";

describe("StatusHero", () => {
  const props = {
    title: "Live Status & Roadmap",
    subtitle: "Transparent build snapshot",
    ctas: {
      chatHref: "/?openChat=1",
      resumeHref: "/assets/Omer_Akben_Resume.pdf",
    },
  };

  it("renders hero copy", () => {
    render(<StatusHero {...props} />);

    expect(screen.getByRole("heading", { name: props.title })).toBeVisible();
    expect(screen.getByText(props.subtitle)).toBeVisible();
  });

  it("includes CTA links", () => {
    render(<StatusHero {...props} />);

    expect(screen.getByRole("link", { name: /open chat/i })).toHaveAttribute(
      "href",
      props.ctas.chatHref
    );
    expect(
      screen.getByRole("link", { name: /download resume/i })
    ).toHaveAttribute("href", props.ctas.resumeHref);
  });
});
