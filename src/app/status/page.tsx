"use client";

import { useEffect, useState } from "react";

import { FeatureSpotlights } from "@/components/status/FeatureSpotlights";
import { HowToUse } from "@/components/status/HowToUse";
import { CapabilityGrid } from "@/components/status/CapabilityGrid";
import { Lessons } from "@/components/status/Lessons";
import { MetricsRow } from "@/components/status/MetricsRow";
import { Milestones } from "@/components/status/Milestones";
import { PersonaSwitch } from "@/components/status/PersonaSwitch";
import { Roadmap } from "@/components/status/Roadmap";
import { StatusHero } from "@/components/status/StatusHero";
import { statusData, type Persona } from "@/data/status";
import { wipBannerCopy } from "@/data/wip";
import { posthog } from "@/lib/analytics/posthog-client";
import { enrichMetrics } from "@/lib/status/metrics";

const personas = [
  { id: "recruiters" as Persona, label: "Recruiters" },
  { id: "engineers" as Persona, label: "Engineers" },
  { id: "curious" as Persona, label: "Curious" },
];

export default function StatusPage() {
  const [activePersona, setActivePersona] = useState<Persona>("recruiters");
  const [metrics, setMetrics] = useState(statusData.metrics);
  const bannerMessage = `${wipBannerCopy.neutral.prefix} ${wipBannerCopy.neutral.main}`;

  useEffect(() => {
    let mounted = true;
    enrichMetrics(statusData.metrics)
      .then((enriched) => {
        if (mounted) {
          setMetrics(enriched);
        }
      })
      .catch((error) => {
        console.error("[StatusPage] Failed to enrich metrics:", error);
        // Keep using placeholder values from statusData.metrics on error
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handlePersonaChange = (persona: Persona) => {
    setActivePersona(persona);
    posthog.capture("status_page.persona_switch", { persona });
  };

  return (
    <div className="min-h-screen bg-surf-0" data-testid="status-page">
      <StatusHero
        title={statusData.hero.title}
        subtitle={statusData.hero.subtitle}
        ctas={statusData.hero.ctas}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6">
        <section
          aria-labelledby="why-banner"
          className="rounded-2xl border border-dashed border-brand-primary/40 bg-surf-1 p-6 shadow-sm"
        >
          <h2 id="why-banner" className="text-lg font-semibold text-text-1">
            Why you saw a banner
          </h2>
          <p className="mt-2 text-sm text-text-2">
            <span className="font-semibold text-text-1">{bannerMessage}</span>
            {" "}This notice reappears whenever a new deploy ships (keyed to the
            latest git SHA) and always links back here for the full roadmap and
            release notes.
          </p>
        </section>

        <section aria-labelledby="mission-vision" className="space-y-8">
          <div>
            <h2
              id="mission-vision"
              className="text-sm font-semibold uppercase tracking-[0.3em] text-text-3"
            >
              Mission
            </h2>
            <p className="mt-4 text-lg text-text-1">{statusData.mission}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-text-3">
              Vision
            </h3>
            <p className="mt-2 text-lg text-text-1">{statusData.vision}</p>
          </div>
        </section>

        {statusData.spotlights.length > 0 && (
          <section
            aria-labelledby="spotlights-heading"
            className="space-y-6"
            id="sidebar-pin"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  id="spotlights-heading"
                  className="text-2xl font-semibold text-text-1"
                >
                  Feature Spotlight
                </h2>
                <p className="text-sm text-text-3">
                  Pin Ozzy on desktop to keep context visible while scrolling.
                </p>
              </div>
            </div>
            <FeatureSpotlights items={statusData.spotlights} />
          </section>
        )}

        <section aria-labelledby="metrics-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="metrics-heading"
              className="text-2xl font-semibold text-text-1"
            >
              Live Metrics
            </h2>
            <p className="text-sm text-text-3">Git SHA + performance snapshot</p>
          </div>
          <div className="mt-6">
            <MetricsRow items={metrics} />
          </div>
        </section>

        <section aria-labelledby="capabilities-heading">
          <h2
            id="capabilities-heading"
            className="text-2xl font-semibold text-text-1"
          >
            What is Live Today
          </h2>
          <p className="mt-2 text-sm text-text-3">
            Each capability is backed by tests, telemetry, and accessible UI.
          </p>
          <div className="mt-6">
            <CapabilityGrid items={statusData.capabilities} />
          </div>
        </section>

        <section aria-labelledby="milestones-heading">
          <h2
            id="milestones-heading"
            className="text-2xl font-semibold text-text-1"
          >
            Recent Milestones
          </h2>
          <div className="mt-6">
            <Milestones items={statusData.milestones} />
          </div>
        </section>

        <section aria-labelledby="roadmap-heading">
          <h2
            id="roadmap-heading"
            className="text-2xl font-semibold text-text-1"
          >
            Roadmap
          </h2>
          <div className="mt-6">
            <Roadmap data={statusData.roadmap} />
          </div>
        </section>

        <section aria-labelledby="lessons-heading">
          <h2
            id="lessons-heading"
            className="text-2xl font-semibold text-text-1"
          >
            Lessons Learned
          </h2>
          <div className="mt-6">
            <Lessons items={statusData.lessons} />
          </div>
        </section>

        <section aria-labelledby="how-to-use-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="how-to-use-heading"
                className="text-2xl font-semibold text-text-1"
              >
                How to Use Ozzy
              </h2>
              <p className="text-sm text-text-3">
                Copy prompts tailored to each persona and let Ozzy answer them.
              </p>
            </div>
            <PersonaSwitch
              active={activePersona}
              onChange={handlePersonaChange}
              personas={personas}
            />
          </div>
          <div className="mt-6">
            <HowToUse blocks={statusData.howToUse} persona={activePersona} />
          </div>
        </section>
      </div>
    </div>
  );
}
