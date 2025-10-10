import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, GraduationCap, FileCheck } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { facts } from "@/data/facts";

export const metadata = createMetadata({
  title: "Credentials",
  description: "My education, certifications, and professional qualifications in AI/ML and software engineering.",
  path: "/credentials",
});

const certifications = facts.certifications.map((cert) => ({
  ...cert,
  icon: cert.name.includes("AWS") ? Award : cert.name.includes("Machine Learning") ? GraduationCap : FileCheck,
}));

export default function CredentialsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-6 flex items-center justify-center gap-4">
            <GraduationCap className="w-12 h-12 text-brand-primary" />
            Credentials
          </h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto">
            Resumes, certifications, and professional testimonials.
          </p>
        </div>

        {/* Education Section */}
        <div className="space-y-6">
          {facts.education.map((edu, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-1 mb-2">
                      {edu.degree}
                    </h3>
                    <div className="text-text-2 mb-1">{edu.institution}</div>
                    <div className="text-text-3 text-sm mb-3">{edu.year}</div>
                    {edu.specialization && (
                      <p className="text-text-2 text-sm mb-3">
                        {edu.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
