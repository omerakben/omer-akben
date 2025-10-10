"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  slug?: string;
  status?: "completed" | "in-progress" | "planned";
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  demoUrl,
  githubUrl,
  slug,
  status,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group h-full hover:shadow-lg hover:border-brand-primary/50 transition-all duration-300">
        {/* Project Image or Code Icon */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-[20px] bg-gradient-to-br from-brand-primary/10 to-accent-primary/10 flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Code2 className="w-20 h-20 text-brand-primary/40" />
          )}
          {/* Production Badge */}
          {status === "completed" && demoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute top-3 right-3"
            >
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none shadow-lg font-semibold">
                ● LIVE
              </Badge>
            </motion.div>
          )}
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="group-hover:text-brand-primary transition-colors">
              {slug ? (
                <Link href={`/projects/${slug}`}>{title}</Link>
              ) : (
                title
              )}
            </CardTitle>
            <div className="flex gap-2 shrink-0">
              {githubUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {demoUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View live demo"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.slice(0, 6).map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
            {technologies.length > 6 && (
              <Badge variant="outline">+{technologies.length - 6} more</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
