import { HeroSectionStatic } from "@/components/hero-section-static";
import { ProjectCard } from "@/components/project-card";
import { TechMarqueeSection } from "@/components/tech-marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableQuote } from "@/components/expandable-quote";
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
      // Sort by displayOrder if present (lower numbers first)
      if (a.displayOrder !== undefined && b.displayOrder === undefined)
        return -1;
      if (a.displayOrder === undefined && b.displayOrder !== undefined)
        return 1;
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return 0;
    })
    .slice(0, MAX_FEATURED_PROJECTS); // Limit to exactly 5 projects
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

      {/* Hero Section */}
      <HeroSectionStatic />

      {/* Technology Marquee */}
      <TechMarqueeSection />

      {/* Featured Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-1 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-text-2 max-w-2xl">
                A selection of recent work in AI/ML engineering, web
                development, and innovative solutions.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/projects">
                <Briefcase className="mr-2 h-4 w-4" />
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Masonry Grid: Row 1 = 2 cards, Row 2 = 3 cards */}
          <div className="space-y-6">
            {/* First Row - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    priority={true} // Above the fold - priority load
                  />
                ))}
            </div>

            {/* Second Row - 3 Cards */}
            {featuredProjects.length > FEATURED_PROJECTS_FIRST_ROW_COUNT && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Button asChild variant="outline">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surf-1">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-1 mb-4">
              What People Say
            </h2>
            <p className="text-lg text-text-2 max-w-2xl mx-auto">
              Testimonials from colleagues, clients, and collaborators.
            </p>
          </div>

          {/* Leadership Testimonials */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-brand-primary/30" />
              <h3 className="text-text-2 text-sm md:text-base px-4">
                Leadership & Management
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-brand-primary/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadershipTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="h-full border-border-line hover:border-brand-primary/40 transition-all"
                >
                  <CardContent className="flex h-full flex-col pt-6">
                    <div className="flex-1 space-y-4">
                      <Quote className="w-8 h-8 text-brand-primary" />
                      <ExpandableQuote text={testimonial.quote} clampLines={6} />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Avatar className="w-10 h-10">
                        {testimonial.avatar ? (
                          <AvatarImage
                            alt={`${testimonial.author} profile photo`}
                            src={testimonial.avatar}
                          />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-brand-primary to-accent-primary text-surf-0">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-text-1">{testimonial.author}</div>
                        <div className="text-text-3 text-sm break-words">
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
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-accent-primary/30" />
              <h3 className="text-text-2 text-sm md:text-base px-4">
                Teammates & Colleagues
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-accent-primary/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="h-full border-border-line hover:border-brand-primary/40 transition-all"
                >
                  <CardContent className="flex h-full flex-col pt-6">
                    <div className="flex-1 space-y-4">
                      <Quote className="w-8 h-8 text-brand-primary" />
                      <ExpandableQuote text={testimonial.quote} clampLines={5} />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Avatar className="w-10 h-10">
                        {testimonial.avatar ? (
                          <AvatarImage
                            alt={`${testimonial.author} profile photo`}
                            src={testimonial.avatar}
                          />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-brand-primary to-accent-primary text-surf-0">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-text-1">{testimonial.author}</div>
                        <div className="text-text-3 text-sm break-words">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-1 mb-6">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg text-text-2 mb-8 max-w-2xl mx-auto">
            Building verified AI for learning. If you want a walkthrough of
            TUEL, or a scoped build, write me.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Get in Touch
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
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
