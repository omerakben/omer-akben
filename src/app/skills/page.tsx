"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { skillsData, getLevelColor, type Skill } from "@/data/skills";

// Note: Metadata export not supported in Client Components
// SEO handled by root layout

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<Skill["level"] | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique categories
  const categories = useMemo(() => {
    return ["All", ...skillsData.map((cat) => cat.category)];
  }, []);

  // Filter skills based on search query, level, and category
  const filteredSkillsData = useMemo(() => {
    return skillsData
      .map((skillCategory) => {
        // Filter by category first
        if (selectedCategory !== "All" && skillCategory.category !== selectedCategory) {
          return null;
        }

        // Filter skills by search query and level
        const filteredSkills = skillCategory.skills.filter((skill) => {
          const matchesSearch = skill.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesLevel =
            selectedLevel === "All" || skill.level === selectedLevel;
          return matchesSearch && matchesLevel;
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
  }, [searchQuery, selectedLevel, selectedCategory]);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-6 flex items-center justify-center gap-4">
            <Zap className="w-12 h-12 text-brand-primary" />
            Skills & Expertise
          </h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills, tools, and
            technologies I work with.
          </p>
        </div>

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

            {/* Filter Pills */}
            <div className="space-y-5">
              {/* Level Filter */}
              <div>
                <label className="text-text-2 font-semibold text-sm mb-3 block">
                  Proficiency Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["All", "Expert", "Advanced", "Proficient"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                        selectedLevel === level
                          ? level === "Expert"
                            ? "bg-brand-primary text-surf-0 shadow-lg shadow-brand-primary/30"
                            : level === "Advanced"
                            ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/30"
                            : level === "Proficient"
                            ? "bg-gradient-to-r from-brand-primary to-accent-primary text-white shadow-lg"
                            : "bg-gradient-to-r from-brand-primary to-accent-primary text-white shadow-lg"
                          : "bg-surf-0 text-text-2 hover:bg-surf-1 hover:text-text-1 border-2 border-border-line hover:border-brand-primary/50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
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
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
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
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mb-12 border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-surf-0/50 rounded-xl border border-border-line">
                <div className="shrink-0">
                  <Badge className={`${getLevelColor("Expert")} text-xs font-bold`}>Expert</Badge>
                </div>
                <div>
                  <p className="text-text-1 font-medium text-sm mb-1">Expert Level</p>
                  <p className="text-text-3 text-xs">Production experience & deep knowledge</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-surf-0/50 rounded-xl border border-border-line">
                <div className="shrink-0">
                  <Badge className={`${getLevelColor("Advanced")} text-xs font-bold`}>Advanced</Badge>
                </div>
                <div>
                  <p className="text-text-1 font-medium text-sm mb-1">Advanced Level</p>
                  <p className="text-text-3 text-xs">Strong working knowledge</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-surf-0/50 rounded-xl border border-border-line">
                <div className="shrink-0">
                  <Badge className={`${getLevelColor("Proficient")} text-xs font-bold`}>Proficient</Badge>
                </div>
                <div>
                  <p className="text-text-1 font-medium text-sm mb-1">Proficient Level</p>
                  <p className="text-text-3 text-xs">Working knowledge</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {(searchQuery || selectedLevel !== "All" || selectedCategory !== "All") && (
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
                    <span className="text-text-1 font-medium"> matching &quot;{searchQuery}&quot;</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLevel("All");
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
                    setSelectedLevel("All");
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
                <Card className="border-border-line hover:border-brand-primary/30 transition-all">
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
                          className="group flex items-center justify-between p-4 bg-surf-0 border-2 border-border-line rounded-xl hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary/20 to-accent-primary/20 flex items-center justify-center group-hover:from-brand-primary/30 group-hover:to-accent-primary/30 transition-all">
                              <svg
                                className="w-3.5 h-3.5 text-brand-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-text-1 font-medium">{skill.name}</span>
                          </div>
                          <Badge className={`${getLevelColor(skill.level)} text-xs font-bold`}>
                            {skill.level}
                          </Badge>
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
