"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, MessageSquare, Sparkles, Calendar, Clock } from "lucide-react";
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-1 mb-6 flex items-center justify-center gap-4">
            <MessageSquare className="w-12 h-12 text-brand-primary" />
            Let&apos;s Connect
          </h1>
          <p className="text-lg text-text-2 max-w-2xl mx-auto">
            Interested in collaboration, consulting, or just want to chat about AI and automation?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <p className="text-text-2 text-sm">
                Fill out the form below and I&apos;ll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-1 mb-2">
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
                  <label htmlFor="email" className="block text-sm font-medium text-text-1 mb-2">
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
                  <label htmlFor="subject" className="block text-sm font-medium text-text-1 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What&apos;s this about?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-1 mb-2">
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
                  className="w-full bg-gradient-to-r from-brand-primary to-[#2563EB]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-text-2">
                  <Mail className="w-5 h-5 text-brand-primary" />
                  <a href={`mailto:${facts.personal.email}`} className="hover:text-brand-primary">
                    {facts.personal.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-text-2">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                  <span>{facts.personal.location}</span>
                </div>
                <div className="flex items-center gap-3 text-text-2">
                  <Clock className="w-5 h-5 text-brand-primary" />
                  <span>{facts.personal.timezone}</span>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={facts.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-2 hover:text-brand-primary"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                  <a
                    href={facts.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-text-2 hover:text-brand-primary"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub Profile
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Schedule a Call */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Call</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-2 mb-4">
                  Book a 30-minute consultation to discuss your project or needs.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-brand-primary to-[#2563EB]"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Meeting
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Quick FAQs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-text-1 mb-1">Response Time?</div>
                  <div className="text-sm text-text-3">Usually within 24-48 hours</div>
                </div>
                <div>
                  <div className="font-medium text-text-1 mb-1">Availability?</div>
                  <div className="text-sm text-text-3">Open to consulting projects</div>
                </div>
                <div>
                  <div className="font-medium text-text-1 mb-1">Best Way to Reach?</div>
                  <div className="text-sm text-text-3">Email or LinkedIn message</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
