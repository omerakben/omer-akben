"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { skillsData, getLevelColor } from "@/data/skills";

// Note: Metadata export not supported in Client Components
// SEO handled by root layout

export default function SkillsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-6 flex items-center justify-center gap-4">
            <Zap className="w-12 h-12 text-brand-primary" />
            Skills & Expertise
          </h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills, tools, and
            technologies I work with.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 p-6 bg-surf-1 border border-border-line rounded-[14px]">
          <div className="flex items-center gap-2">
            <Badge className={getLevelColor("Expert")}>Expert</Badge>
            <span className="text-text-3">Production experience & deep knowledge</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getLevelColor("Advanced")}>Advanced</Badge>
            <span className="text-text-3">Strong working knowledge</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getLevelColor("Proficient")}>Proficient</Badge>
            <span className="text-text-3">Working knowledge</span>
          </div>
        </div>

        {/* Skills Categories */}
        <div className="space-y-12">
          {skillsData.map((skillCategory, categoryIndex) => (
            <motion.div
              key={skillCategory.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{skillCategory.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skillCategory.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-3 bg-surf-0 border border-border-line rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-brand-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-text-1">{skill.name}</span>
                        </div>
                        <Badge className={getLevelColor(skill.level)}>
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
      </div>
    </div>
  );
}
