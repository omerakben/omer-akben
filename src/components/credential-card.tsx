"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, FileText, ExternalLink, Download, CheckCircle2 } from "lucide-react";
import { Credential } from "@/data/credentials";

interface CredentialCardProps {
  credential: Credential;
  index: number;
}

const typeIcons = {
  education: GraduationCap,
  certification: Award,
  award: Award,
} as const;

const typeColors = {
  education: "text-accent-primary",
  certification: "text-brand-primary",
  award: "text-brand-primary",
} as const;

export function CredentialCard({ credential, index }: CredentialCardProps) {
  const Icon = typeIcons[credential.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative bg-surf-1/80 backdrop-blur-sm border border-border-line rounded-[24px] p-6 md:p-8 hover:border-brand-primary/50 transition-all duration-300 shadow-lg shadow-surf-2/50 hover:shadow-xl hover:shadow-brand-primary/10">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content container */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-xl bg-brand-primary/10 ${typeColors[credential.type]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold mb-1 ${typeColors[credential.type]}`}>
                {credential.date}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-text-1 mb-2">
                {credential.title}
              </h3>
              <a
                href={credential.institutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-2 font-medium hover:text-brand-primary transition-colors"
              >
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span>{credential.institution}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-2 mb-4 leading-relaxed">{credential.description}</p>

          {/* Highlights */}
          {credential.highlights && credential.highlights.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-2">
                {credential.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-text-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="flex-1">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {credential.skills && credential.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {credential.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/20 transition-all duration-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(credential.certificateUrl || credential.verificationUrl) && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border-line">
              {credential.certificateUrl && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="bg-transparent hover:bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:border-brand-primary transition-all"
                >
                  <a
                    href={credential.certificateUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </a>
                </Button>
              )}
              {credential.verificationUrl && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="bg-transparent hover:bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:border-brand-primary transition-all"
                >
                  <a
                    href={credential.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Verify Credential
                    {credential.credentialId && (
                      <span className="ml-2 text-xs opacity-70">
                        {credential.credentialId.slice(0, 8)}...
                      </span>
                    )}
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-colors duration-500" />

        {/* Status badge */}
        {credential.status === "in-progress" && (
          <div className="absolute top-4 right-12">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
              In Progress
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
