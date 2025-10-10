import { Timeline } from "@/components/timeline";
import { journeyData } from "@/data/journey";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "My Journey",
  description: "A timeline of my professional experience, education, and key achievements in software engineering and AI/ML.",
  path: "/journey",
});

export default function JourneyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-6">
            My Journey
          </h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto">
            A timeline of my professional experience, education, and key
            achievements in software engineering and AI/ML.
          </p>
        </div>

        {/* Timeline */}
        <Timeline items={journeyData} />
      </div>
    </div>
  );
}
