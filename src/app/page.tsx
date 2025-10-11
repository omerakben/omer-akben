import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { ProjectCard } from "@/components/project-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({});

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const leadershipTestimonials = testimonials.filter((t) => t.type === "leadership");
  const teamTestimonials = testimonials.filter((t) => t.type === "team");

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-1 mb-4">
                Featured Projects
              </h2>
              <p className="text-text-2 max-w-2xl">
                A selection of recent work in AI/ML engineering, web development,
                and innovative solutions.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                demoUrl={project.demoUrl}
                githubUrl={project.githubUrl}
                slug={project.slug}
                status={project.status}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surf-1">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-1 mb-4">
              What People Say
            </h2>
            <p className="text-text-2 max-w-2xl mx-auto">
              Testimonials from colleagues, clients, and collaborators.
            </p>
          </div>

          {/* Leadership Testimonials */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-brand-primary/30" />
              <h3 className="text-text-2 text-sm md:text-base px-4">Leadership & Management</h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-brand-primary/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-border-line hover:border-brand-primary/30 transition-all">
                  <CardContent className="pt-6 space-y-4">
                    <Quote className="w-8 h-8 text-brand-primary" />
                    <p className="text-text-2 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-brand-primary to-accent-primary text-surf-0">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-text-1">{testimonial.author}</div>
                        <div className="text-text-3 text-sm">{testimonial.role}</div>
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
              <h3 className="text-text-2 text-sm md:text-base px-4">Teammates & Colleagues</h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-accent-primary/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-border-line hover:border-brand-primary/30 transition-all">
                  <CardContent className="pt-6 space-y-4">
                    <Quote className="w-8 h-8 text-brand-primary" />
                    <p className="text-text-2 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-brand-primary to-accent-primary text-surf-0">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-text-1">{testimonial.author}</div>
                        <div className="text-text-3 text-sm">{testimonial.role}</div>
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
            Always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/recruiter">For Recruiters</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
