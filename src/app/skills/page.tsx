"use client";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { skillsData } from "@/data/skills";
import { SkillIcon } from "@/lib/skill-icons";
import { motion } from "framer-motion";
import { Search, Zap, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

// Note: Metadata export not supported in Client Components
// SEO handled by root layout

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique categories
  const categories = useMemo(() => {
    return ["All", ...skillsData.map((cat) => cat.category)];
  }, []);

  // Filter skills based on search query and category
  const filteredSkillsData = useMemo(() => {
    return skillsData
      .map((skillCategory) => {
        // Filter by category first
        if (
          selectedCategory !== "All" &&
          skillCategory.category !== selectedCategory
        ) {
          return null;
        }

        // Filter skills by search query (now includes context fields)
        const filteredSkills = skillCategory.skills.filter((skill) => {
          const searchLower = searchQuery.toLowerCase();
          const matchesName = skill.name.toLowerCase().includes(searchLower);
          const matchesContext = skill.context?.toLowerCase().includes(searchLower);
          const matchesExperience = skill.experience?.toLowerCase().includes(searchLower);
          const matchesProjects = skill.projects?.some(p => p.toLowerCase().includes(searchLower));
          const matchesMetrics = skill.metrics?.toLowerCase().includes(searchLower);

          return matchesName || matchesContext || matchesExperience || matchesProjects || matchesMetrics;
        });

        // Only return category if it has matching skills
        if (filteredSkills.length === 0) {
          return null;
        }

        return {
          ...skillCategory,
          skills: filteredSkills,
        };
      })
      .filter((category) => category !== null);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <PageHeader
          icon={Zap}
          title="Skills & Expertise"
          description="A comprehensive overview of my technical skills, tools, and technologies I work with."
        />

        {/* Search and Filter Section */}
        <Card className="mb-12 border-border-line">
          <CardContent className="pt-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base text-text-1 bg-surf-0 border-2 border-border-line focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all rounded-full"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-text-2 font-semibold text-sm mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-brand-primary to-accent-primary text-white shadow-lg"
                        : "bg-surf-0 text-text-2 hover:bg-surf-1 hover:text-text-1 border-2 border-border-line hover:border-brand-primary/50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {(searchQuery || selectedCategory !== "All") && (
          <Card className="mb-6 border-border-line">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-text-2">
                  Found{" "}
                  <span className="font-bold text-brand-primary text-lg">
                    {filteredSkillsData.reduce(
                      (acc, cat) => acc + (cat?.skills.length || 0),
                      0
                    )}
                  </span>{" "}
                  skills
                  {searchQuery && (
                    <span className="text-text-1 font-medium">
                      {" "}
                      matching &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="text-sm text-text-3 hover:text-brand-primary transition-colors font-medium"
                >
                  Clear filters
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Categories */}
        {filteredSkillsData.length === 0 ? (
          <Card className="border-border-line">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surf-1 flex items-center justify-center">
                  <Search className="w-8 h-8 text-text-3" />
                </div>
                <p className="text-text-1 text-lg font-semibold mb-2">
                  No skills found
                </p>
                <p className="text-text-2 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-brand-primary to-accent-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {filteredSkillsData.map((skillCategory, categoryIndex) => (
              <motion.div
                key={skillCategory.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <Card className="border-border-line hover:border-brand-primary/60 transition-all">
                  <CardHeader className="border-b border-border-line bg-surf-1/50">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-brand-primary to-accent-primary rounded-full"></div>
                      {skillCategory.category}
                      <span className="text-sm font-normal text-text-3 ml-auto">
                        {skillCategory.skills.length} skills
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skillCategory.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="group flex flex-col p-4 bg-surf-0 border-2 border-border-line rounded-xl hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
                        >
                          {/* Skill Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-brand-primary/10 to-accent-primary/10 flex items-center justify-center group-hover:from-brand-primary/20 group-hover:to-accent-primary/20 transition-all border border-border-line group-hover:border-brand-primary/30">
                                <SkillIcon
                                  skillName={skill.name}
                                  className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform"
                                />
                              </div>
                              <span className="text-text-1 font-semibold">
                                {skill.name}
                              </span>
                            </div>
                            {skill.experience && (
                              <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 text-xs font-semibold shrink-0">
                                {skill.experience}
                              </Badge>
                            )}
                          </div>

                          {/* Context */}
                          {skill.context && (
                            <p className="text-text-2 text-sm mb-2 leading-relaxed">
                              {skill.context}
                            </p>
                          )}

                          {/* Projects */}
                          {skill.projects && skill.projects.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {skill.projects.map((project) => (
                                <Badge
                                  key={project}
                                  className="bg-surf-1 text-text-2 border-border-line hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30 transition-colors text-xs"
                                >
                                  {project}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Metrics */}
                          {skill.metrics && (
                            <div className="flex items-center gap-1.5 text-xs text-brand-primary/90 font-semibold mt-auto pt-2">
                              <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                              <span className="text-text-1/90">{skill.metrics}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
