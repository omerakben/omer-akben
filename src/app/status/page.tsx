"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Cookie, Mail } from "lucide-react";
import Link from "next/link";

export default function StatusPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <PageHeader
          icon={Cookie}
          title="Still Cooking! 🍳"
          description="This portfolio is actively being built and improved. Thanks for your patience!"
          className="mb-16"
        />

        <div className="space-y-8">
          {/* Main Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>What This Means</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-text-2">
              <p>
                You&rsquo;re visiting a work in progress! While the core features are
                functional, some areas are still being refined and new features
                are being added regularly.
              </p>
              <p>
                I&rsquo;m committed to transparency about the development process. If
                you encounter any bugs or have suggestions, I&rsquo;d love to hear
                from you.
              </p>
            </CardContent>
          </Card>

          {/* Feature Status */}
          <Card>
            <CardHeader>
              <CardTitle>Development Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-1">
                      Core Portfolio Features
                    </div>
                    <div className="text-sm text-text-3">
                      Projects, skills, journey, and credentials are live
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-1">
                      AI Assistant (Ozzy)
                    </div>
                    <div className="text-sm text-text-3">
                      Interactive chat powered by Vercel AI SDK
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-1">
                      Additional Features
                    </div>
                    <div className="text-sm text-text-3">
                      More interactive experiences and optimizations coming soon
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="border-brand-primary/30 bg-brand-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Found a Bug or Have Feedback?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-text-2">
              <p>
                Your feedback helps make this site better! If you encounter any
                issues or have suggestions for improvements, please reach out.
              </p>
              <Link
                href="mailto:me@omerakben.com?subject=Portfolio Feedback"
                className="inline-flex items-center gap-2 text-brand-primary hover:underline font-medium"
              >
                <Mail className="h-4 w-4" />
                me@omerakben.com
              </Link>
            </CardContent>
          </Card>

          {/* Privacy & Cache Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Privacy & Cache Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-text-2 text-sm">
              <p>
                This site uses local browser storage and cloud-based caching to
                enhance your experience:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>localStorage:</strong> Stores your preferences
                  (brightness mode, sidebar state) locally in your browser
                </li>
                <li>
                  <strong>Redis Cache:</strong> Temporarily caches your
                  preferences server-side for improved performance across
                  devices (90-day retention)
                </li>
                <li>
                  <strong>AI Conversations:</strong> Chat messages are stored
                  temporarily to maintain conversation context
                </li>
              </ul>
              <p className="text-text-3">
                No personal data is collected without your explicit consent. All
                data is used solely to improve your browsing experience.
              </p>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center pt-4">
            <Link
              href="/"
              className="text-brand-primary hover:underline font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
