"use client";

import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/data/projects";
import { Briefcase, Filter } from "lucide-react";
import { useState } from "react";

// Note: Metadata export not supported in Client Components
// SEO handled by root layout

type RoleFilter = "All" | "Full-Stack" | "AI" | "QA" | "QA/AI";

const allTechnologies = Array.from(
  new Set(projects.flatMap((p) => p.technologies))
).sort();

export default function ProjectsPage() {
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("All");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const resetFilters = () => {
    setSelectedRole("All");
    setSelectedTechnologies([]);
  };

  const filteredProjects = projects.filter((project) => {
    const roleMatch = selectedRole === "All" || project.role === selectedRole;
    const techMatch =
      selectedTechnologies.length === 0 ||
      selectedTechnologies.some((tech) => project.technologies.includes(tech));
    return roleMatch && techMatch;
  });

  // Separate into featured and non-featured, both filtered
  const featuredProjects = filteredProjects
    .filter((p) => p.featured)
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
    .slice(0, 5); // Limit to 5 featured projects

  const otherProjects = filteredProjects
    .filter((p) => !p.featured)
    .sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      return orderA - orderB;
    });

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <PageHeader
          icon={Briefcase}
          title="Projects"
          description="A collection of my work in AI, automation, and full-stack development."
        />

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-brand-primary"
              >
                Reset All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role Filter */}
            <div>
              <div className="text-sm font-medium text-text-2 mb-3">Role:</div>
              <div className="flex flex-wrap gap-2">
                {(
                  ["All", "Full-Stack", "AI", "QA", "QA/AI"] as RoleFilter[]
                ).map((role) => (
                  <Badge
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    className="cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                    onClick={() => setSelectedRole(role)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedRole(role);
                      }
                    }}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Technology Filter */}
            <div>
              <div className="text-sm font-medium text-text-2 mb-3">
                Technologies:
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant={
                      selectedTechnologies.includes(tech)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                    onClick={() => toggleTechnology(tech)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleTechnology(tech);
                      }
                    }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-1 mb-6">
              Featured Projects
            </h2>
            <div className="space-y-6">
              {/* First Row - 2 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProjects.slice(0, 2).map((project, index) => (
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
              {featuredProjects.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.slice(2, 5).map((project, index) => (
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
                      index={2 + index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other Projects Section */}
        {otherProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-1 mb-6">
              More Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
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
                  index={featuredProjects.length + index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-3">
              No projects found with the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
