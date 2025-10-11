"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Credential } from "@/data/credentials";

interface CredentialsShowcaseProps {
  credentials: Credential[];
  title: string;
  description: string;
}

/**
 * Visual showcase of credentials with badges and logos
 * Following best practices: Visual display primary, downloads secondary
 */
export function CredentialsShowcase({
  credentials,
  title,
  description,
}: CredentialsShowcaseProps) {
  // Only show completed certifications with verification URLs for showcase
  const showcaseCredentials = credentials.filter(
    (cred) => cred.status === "completed" && cred.verificationUrl
  );

  if (showcaseCredentials.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-text-1 mb-2">{title}</h3>
        <p className="text-text-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseCredentials.map((credential, index) => (
          <motion.div
            key={credential.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group h-full border-border-line hover:border-brand-primary/50 transition-all hover:shadow-xl hover:shadow-brand-primary/10 overflow-hidden">
              {/* Visual Badge Header */}
              <div className="bg-gradient-to-br from-brand-primary/10 to-accent-primary/10 p-6 border-b border-border-line">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/90 border border-brand-primary/20 shadow-lg">
                    <Award className="w-8 h-8 text-brand-primary" />
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-white/90 text-brand-primary border-brand-primary/30"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <h4 className="text-lg font-bold text-text-1 leading-tight mb-2">
                  {credential.title}
                </h4>

                <p className="text-sm text-text-2 font-medium">
                  {credential.institution}
                </p>

                <p className="text-xs text-text-3 mt-1">{credential.date}</p>
              </div>

              {/* Credential Details */}
              <div className="p-5">
                {/* Credential ID */}
                {credential.credentialId && (
                  <div className="mb-4 p-3 rounded-lg bg-surf-0 border border-border-line">
                    <p className="text-xs text-text-3 mb-1">Credential ID</p>
                    <p className="text-sm font-mono text-brand-primary font-semibold">
                      {credential.credentialId}
                    </p>
                  </div>
                )}

                {/* Skills Preview */}
                {credential.skills && credential.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-text-3 mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {credential.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {credential.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{credential.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Link - Primary CTA */}
                {credential.verificationUrl && (
                  <a
                    href={credential.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-brand-primary to-accent-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20 group"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Credential
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
