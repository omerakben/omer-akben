"use client";

import {
  CalendarContactCard,
  EmailContactCard,
  GitHubContactCard,
  LinkedInContactCard,
  PhoneContactCard,
} from "@/components/contact/contact-cards";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Note: Metadata export not supported in Client Components
// SEO handled by root layout

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! I'll get back to you soon.");

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Page Header */}
        <PageHeader
          icon={MessageSquare}
          title="Let's Connect"
          description="Interested in collaboration, consulting, or just want to chat about AI and automation?"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <p className="text-text-2 text-sm">
                Fill out the form below and I&apos;ll get back to you as soon as
                possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-1 mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-1 mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-text-1 mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-1 mb-2"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      placeholder="Tell me more..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2 text-brand-primary"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Editor
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-brand-primary to-accent-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
                <p className="text-text-2 text-sm">
                  Choose your preferred way to connect
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <LinkedInContactCard delay={0} />
                <GitHubContactCard delay={0.05} />
                <EmailContactCard delay={0.1} />
                <PhoneContactCard delay={0.15} />
              </CardContent>
            </Card>

            {/* Schedule a Call */}
            <CalendarContactCard delay={0.2} />

            {/* Quick FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Quick FAQs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-text-1 mb-1">
                    Response Time?
                  </div>
                  <div className="text-sm text-text-3">
                    Usually within 24-48 hours
                  </div>
                </div>
                <div>
                  <div className="font-medium text-text-1 mb-1">
                    Availability?
                  </div>
                  <div className="text-sm text-text-3">
                    Open to consulting projects
                  </div>
                </div>
                <div>
                  <div className="font-medium text-text-1 mb-1">
                    Best Way to Reach?
                  </div>
                  <div className="text-sm text-text-3">
                    Email or LinkedIn message
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
