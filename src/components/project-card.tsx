"use client";

import { Github } from "@/components/brand-icons";
import { ProjectWaveHeader } from "@/components/project-wave-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DURATION, EASING, VIEWPORT } from "@/lib/animations";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { memo, useState } from "react";

const ProjectScreenshot = dynamic(
  () => import("@/components/project-screenshot"),
  { ssr: false }
);

export interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  slug?: string;
  status?: "completed" | "in-progress" | "planned";
  index?: number;
  priority?: boolean;
}

export const ProjectCard = memo(
  function ProjectCard({
    title,
    description,
    image,
    technologies,
    demoUrl,
    githubUrl,
    slug,
    status,
    index = 0,
  }: ProjectCardProps) {
    const shouldAnimateImmediately = index < 6;
    // The screenshot is only requested once someone shows interest in the card.
    const [wantsScreenshot, setWantsScreenshot] = useState(false);
    const requestScreenshot = () => setWantsScreenshot(true);

    return (
      <motion.div
        className="motion-safe h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={shouldAnimateImmediately ? { opacity: 1, y: 0 } : undefined}
        whileInView={
          !shouldAnimateImmediately ? { opacity: 1, y: 0 } : undefined
        }
        viewport={!shouldAnimateImmediately ? VIEWPORT.default : undefined}
        transition={{
          duration: DURATION.normal,
          ease: EASING.default,
          delay: shouldAnimateImmediately ? index * 0.08 : 0,
        }}
      >
        <Card
          onPointerEnter={requestScreenshot}
          onFocusCapture={requestScreenshot}
          className="group flex h-full flex-col justify-between rounded-none border-2 border-border-line bg-surf-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary">
          <div>
            <ProjectWaveHeader
              index={index}
              status={status}
              demoUrl={demoUrl}
              slug={slug}
            >
              {image && wantsScreenshot ? (
                <ProjectScreenshot src={image} />
              ) : null}
            </ProjectWaveHeader>

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl font-extrabold tracking-tight text-text-1 transition-colors group-hover:text-brand-primary">
                  {slug ? (
                    <Link
                      href={`/projects/${slug}`}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>{title}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  ) : (
                    title
                  )}
                </CardTitle>
                <div className="flex shrink-0 gap-1.5">
                  {githubUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-none border border-border-line p-0 hover:border-brand-primary"
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
                      className="h-8 w-8 rounded-none border border-border-line p-0 hover:border-brand-primary"
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
              <CardDescription className="line-clamp-3 text-sm leading-relaxed text-text-2">
                {description}
              </CardDescription>
            </CardHeader>
          </div>

          <CardContent className="border-t border-border-line pt-4">
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="rounded-none border border-border-line bg-surf-0 font-mono text-xs text-text-2"
                >
                  {tech}
                </Badge>
              ))}
              {technologies.length > 5 && (
                <Badge
                  variant="outline"
                  className="rounded-none border border-border-line font-mono text-xs text-text-3"
                >
                  +{technologies.length - 5}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.description === nextProps.description &&
      prevProps.image === nextProps.image &&
      prevProps.slug === nextProps.slug &&
      prevProps.demoUrl === nextProps.demoUrl &&
      prevProps.githubUrl === nextProps.githubUrl &&
      prevProps.status === nextProps.status &&
      prevProps.index === nextProps.index &&
      prevProps.priority === nextProps.priority &&
      prevProps.technologies.length === nextProps.technologies.length &&
      prevProps.technologies.every((tech, i) => tech === nextProps.technologies[i])
    );
  }
);
