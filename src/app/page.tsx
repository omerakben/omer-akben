import { CyberWaveDeck } from "@/components/cyber-wave-deck";
import { ExpandableQuote } from "@/components/expandable-quote";
import { HeroSectionStatic } from "@/components/hero-section-static";
import { ProjectCard } from "@/components/project-card";
import { TechMarqueeSection } from "@/components/tech-marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedProjects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { createMetadata } from "@/lib/metadata";
import { getPersonSchema, getWebSiteSchema } from "@/lib/structured-data";
import { ArrowRight, Briefcase, Mail, Quote, UserCheck } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({});

const FEATURED_PROJECTS_FIRST_ROW_COUNT = 2;
const FEATURED_PROJECTS_SECOND_ROW_COUNT = 3;
const MAX_FEATURED_PROJECTS = 5;

export default async function HomePage() {
  const featuredProjects = getFeaturedProjects()
    .sort((a, b) => {
      if (a.displayOrder !== undefined && b.displayOrder === undefined)
        return -1;
      if (a.displayOrder === undefined && b.displayOrder !== undefined)
        return 1;
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return 0;
    })
    .slice(0, MAX_FEATURED_PROJECTS);
  const leadershipTestimonials = testimonials.filter(
    (t) => t.type === "leadership"
  );
  const teamTestimonials = testimonials.filter((t) => t.type === "team");

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPersonSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebSiteSchema()),
        }}
      />

      {/* Hero Bento Section */}
      <HeroSectionStatic />

      {/* Fluid 3D Wave & Architecture Deck */}
      <div className="cybersynth-grid px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <CyberWaveDeck />
        </div>
      </div>

      {/* Technology Marquee */}
      <TechMarqueeSection />

      {/* Featured Projects Section */}
      <section className="cybersynth-grid border-t-2 border-border-line px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 font-mono text-xs font-bold text-synth-red">
                {"// 01_FEATURED_SYSTEMS"}
              </div>
              <h2 className="mb-2 text-3xl font-black tracking-tight text-text-1 md:text-4xl">
                Featured Projects
              </h2>
              <p className="max-w-2xl text-base text-text-2 sm:text-lg">
                Production AI/ML systems, open-source motion libraries, and
                full-stack architecture.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden rounded-none border-2 border-border-line bg-surf-1 font-mono text-xs font-bold uppercase text-text-1 hover:border-brand-primary md:flex"
            >
              <Link href="/projects">
                <Briefcase className="mr-2 h-4 w-4" />
                View All Systems
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {/* First Row - 2 Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featuredProjects
                .slice(0, FEATURED_PROJECTS_FIRST_ROW_COUNT)
                .map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    title={project.shortTitle || project.title}
                    description={project.description}
                    image={project.image}
                    technologies={project.technologies}
                    demoUrl={project.demoUrl}
                    githubUrl={project.githubUrl}
                    slug={project.slug}
                    status={project.status}
                    index={index}
                    priority={true}
                  />
                ))}
            </div>

            {/* Second Row - 3 Cards */}
            {featuredProjects.length > FEATURED_PROJECTS_FIRST_ROW_COUNT && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects
                  .slice(
                    FEATURED_PROJECTS_FIRST_ROW_COUNT,
                    FEATURED_PROJECTS_FIRST_ROW_COUNT +
                      FEATURED_PROJECTS_SECOND_ROW_COUNT
                  )
                  .map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      title={project.shortTitle || project.title}
                      description={project.description}
                      image={project.image}
                      technologies={project.technologies}
                      demoUrl={project.demoUrl}
                      githubUrl={project.githubUrl}
                      slug={project.slug}
                      status={project.status}
                      index={FEATURED_PROJECTS_FIRST_ROW_COUNT + index}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Button
              asChild
              variant="outline"
              className="rounded-none border-2 border-border-line bg-surf-1 font-mono text-xs font-bold uppercase text-text-1"
            >
              <Link href="/projects">
                <Briefcase className="mr-2 h-4 w-4" />
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y-2 border-border-line bg-surf-1 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-2 font-mono text-xs font-bold text-synth-emerald">
              {"// 02_PEER_VERIFICATION"}
            </div>
            <h2 className="mb-3 text-3xl font-black tracking-tight text-text-1 md:text-4xl">
              What People Say
            </h2>
            <p className="mx-auto max-w-2xl text-base text-text-2 sm:text-lg">
              Testimonials from engineering leaders, clients, and collaborators.
            </p>
          </div>

          {/* Leadership Testimonials */}
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-[2px] flex-1 bg-border-line" />
              <h3 className="px-3 font-mono text-xs font-bold uppercase tracking-wider text-text-2">
                Leadership &amp; Management
              </h3>
              <div className="h-[2px] flex-1 bg-border-line" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {leadershipTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="h-full rounded-none border-2 border-border-line bg-surf-0 transition-colors hover:border-brand-primary"
                >
                  <CardContent className="flex h-full flex-col pt-6">
                    <div className="flex-1 space-y-4">
                      <Quote className="h-7 w-7 text-brand-primary" />
                      <ExpandableQuote
                        text={testimonial.quote}
                        clampLines={6}
                      />
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-border-line pt-4">
                      <Avatar className="h-10 w-10 rounded-none border border-border-line">
                        {testimonial.avatar ? (
                          <AvatarImage
                            alt={`${testimonial.author} profile photo`}
                            src={testimonial.avatar}
                          />
                        ) : null}
                        <AvatarFallback className="rounded-none bg-synth-volt font-mono text-xs font-bold text-synth-volt-fg">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-bold text-text-1">
                          {testimonial.author}
                        </div>
                        <div className="break-words font-mono text-xs text-text-3">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Testimonials */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-[2px] flex-1 bg-border-line" />
              <h3 className="px-3 font-mono text-xs font-bold uppercase tracking-wider text-text-2">
                Teammates &amp; Colleagues
              </h3>
              <div className="h-[2px] flex-1 bg-border-line" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="h-full rounded-none border-2 border-border-line bg-surf-0 transition-colors hover:border-brand-primary"
                >
                  <CardContent className="flex h-full flex-col pt-6">
                    <div className="flex-1 space-y-4">
                      <Quote className="h-7 w-7 text-brand-primary" />
                      <ExpandableQuote
                        text={testimonial.quote}
                        clampLines={5}
                      />
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-border-line pt-4">
                      <Avatar className="h-10 w-10 rounded-none border border-border-line">
                        {testimonial.avatar ? (
                          <AvatarImage
                            alt={`${testimonial.author} profile photo`}
                            src={testimonial.avatar}
                          />
                        ) : null}
                        <AvatarFallback className="rounded-none bg-synth-volt font-mono text-xs font-bold text-synth-volt-fg">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-bold text-text-1">
                          {testimonial.author}
                        </div>
                        <div className="break-words font-mono text-xs text-text-3">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cybersynth-grid px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="container mx-auto max-w-4xl border-2 border-border-line bg-surf-1 p-8 text-center sm:p-12">
          <div className="mb-3 font-mono text-xs font-bold text-synth-red">
            {"// 03_INITIATE_HANDSHAKE"}
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-text-1 md:text-4xl">
            Let&apos;s Work Together
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-text-2 sm:text-lg">
            Building verified AI for learning. Open to strong AI engineering
            roles, plus TUEL walkthroughs and scoped builds.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-none border-2 border-border-line bg-synth-volt font-mono text-xs font-bold uppercase text-synth-volt-fg hover:opacity-90"
            >
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Get in Touch
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none border-2 border-border-line bg-surf-0 font-mono text-xs font-bold uppercase text-text-1 hover:border-brand-primary hover:bg-surf-2 hover:text-text-1"
            >
              <Link href="/recruiter">
                <UserCheck className="mr-2 h-4 w-4" />
                Recruiters
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
