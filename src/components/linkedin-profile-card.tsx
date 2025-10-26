"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { facts } from "@/data/facts";
import { Linkedin } from "lucide-react";

export function LinkedInProfileCard() {
  return (
    <Card className="overflow-hidden border-border-line hover:border-brand-primary/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* LinkedIn Icon */}
          <div className="flex-shrink-0">
            <div className="p-3 rounded-xl bg-[#0077B5]">
              <Linkedin className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-text-1 font-semibold text-lg">Omer AKBEN</h3>
            <p className="text-text-2 text-sm line-clamp-2">
              {facts.personal.title}
            </p>
          </div>
        </div>

        {/* View Profile Button */}
        <Button
          asChild
          className="w-full mt-4 bg-[#0077B5] hover:bg-[#006399] text-white"
        >
          <a
            href="https://www.linkedin.com/in/omerakben"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="w-4 h-4 mr-2" />
            View LinkedIn Profile
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
