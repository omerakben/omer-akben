"use client";

import { CredentialCard } from "@/components/credential-card";
import { CredentialsHero } from "@/components/credentials-hero";
import { getCertifications, getEducation } from "@/data/credentials";
import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";

export default function CredentialsPage() {
  const education = getEducation();
  const certifications = getCertifications();

  return (
    <div>
      {/* Hero Section with Stats */}
      <CredentialsHero />

      {/* Credentials Content */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-accent-primary/10">
                <GraduationCap className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-1">
                  Education
                </h2>
                <p className="text-text-2">
                  Formal training and academic background
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {education.map((cred, index) => (
                <CredentialCard key={cred.id} credential={cred} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-brand-primary/10">
                <Award className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-1">
                  Certifications
                </h2>
                <p className="text-text-2">
                  Professional certifications and specialized training
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {certifications.map((cred, index) => (
                <CredentialCard key={cred.id} credential={cred} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
