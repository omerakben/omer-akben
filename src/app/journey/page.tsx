import { EnhancedTimeline } from "@/components/enhanced-timeline";
import { JourneyHero } from "@/components/journey-hero";
import { journeyData } from "@/data/journey";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "My Journey",
  description:
    "A timeline of my professional experience, education, and key achievements in software engineering and AI/ML.",
  path: "/journey",
});

export default function JourneyPage() {
  return (
    <div>
      {/* Hero Section with Stats */}
      <JourneyHero />

      {/* Timeline Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <EnhancedTimeline items={journeyData} />
        </div>
      </div>
    </div>
  );
}
