"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Credential } from "@/data/credentials";
import { DURATION, STAGGER, VIEWPORT } from "@/lib/animations";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
} from "lucide-react";

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
      viewport={VIEWPORT.default}
      transition={{ duration: DURATION.normal, delay: index * STAGGER.normal }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative bg-surf-1/80 backdrop-blur-sm border border-border-line rounded-[24px] p-6 md:p-8 hover:border-brand-primary/40 transition-all duration-300 shadow-lg shadow-surf-2/50 hover:shadow-xl hover:shadow-brand-primary/10">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content container */}
        <div className="relative z-10">
          {/* Header with Visual Badge */}
          <div className="flex items-start gap-4 mb-6">
            {/* Large Visual Icon/Badge */}
            <div className="flex-shrink-0">
              <div
                className={`p-4 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-accent-primary/10 border-2 border-border-line group-hover:border-brand-primary/30 transition-all ${typeColors[credential.type]}`}
              >
                <Icon className="w-10 h-10" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Date and Type Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`text-sm font-semibold ${typeColors[credential.type]}`}
                >
                  {credential.date}
                </div>
                {credential.type === "certification" && (
                  <Badge
                    variant="outline"
                    className="text-xs border-brand-primary/30 text-brand-primary"
                  >
                    Professional Certificate
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-text-1 mb-3 leading-tight">
                {credential.title}
              </h3>

              {/* Institution with Logo */}
              <a
                href={credential.institutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-2 font-medium hover:text-brand-primary transition-colors group/link"
              >
                <div className="p-1.5 rounded-lg bg-surf-0 border border-border-line group-hover/link:border-brand-primary/30 transition-colors">
                  <Award className="w-4 h-4 flex-shrink-0" />
                </div>
                <span>{credential.institution}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover/link:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-2 mb-4 leading-relaxed">
            {credential.description}
          </p>

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

          {/* Action Buttons - Show/Verify Primary, Download Secondary */}
          {(credential.certificateUrl || credential.verificationUrl) && (
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border-line mt-6">
              {/* Primary: Verification URL (if available) */}
              {credential.verificationUrl && (
                <>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-brand-primary to-accent-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20"
                  >
                    <a
                      href={credential.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify Credential
                      <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
                    </a>
                  </Button>

                  {/* Credential ID Badge - displayed next to verify button */}
                  {credential.credentialId && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surf-0 border border-border-line text-xs text-text-3">
                      <FileText className="w-3 h-3" />
                      <span className="font-mono">
                        ID: {credential.credentialId}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Primary: Show Certificate (if no verification URL but has certificate) */}
              {!credential.verificationUrl && credential.certificateUrl && (
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-brand-primary to-accent-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20"
                >
                  <a
                    href={credential.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Show Certificate
                    <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
                  </a>
                </Button>
              )}

              {/* Secondary: Download Certificate (when verification URL exists) */}
              {credential.certificateUrl && credential.verificationUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-transparent hover:bg-brand-primary/10 text-text-2 hover:text-brand-primary border-border-line hover:border-brand-primary/30 transition-all"
                >
                  <a
                    href={credential.certificateUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              )}

              {/* Secondary: Download Certificate (when no verification URL) */}
              {!credential.verificationUrl && credential.certificateUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-transparent hover:bg-brand-primary/10 text-text-2 hover:text-brand-primary border-border-line hover:border-brand-primary/30 transition-all"
                >
                  <a
                    href={credential.certificateUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              )}

              {/* Info text for certificates without verification */}
              {credential.certificateUrl && !credential.verificationUrl && (
                <span className="text-xs text-text-3 self-center">
                  Official certificate available
                </span>
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
