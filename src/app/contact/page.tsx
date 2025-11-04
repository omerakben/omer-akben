"use client";

import { AIEditorModal } from "@/components/contact/ai-editor-modal";
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

// Validation limits (matching API schema)
const VALIDATION_LIMITS = {
  name: { min: 1, max: 100 },
  subject: { min: 1, max: 200 },
  message: { min: 10, max: 5000 },
} as const;

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  // Validation helper functions
  const validateField = (field: keyof typeof formData, value: string) => {
    if (field === "email") {
      if (!value) return "Email is required";
      if (!EMAIL_REGEX.test(value)) return "Invalid email address";
      return null;
    }

    if (field === "name") {
      if (!value || value.length < VALIDATION_LIMITS.name.min)
        return "Name is required";
      if (value.length > VALIDATION_LIMITS.name.max)
        return `Name too long (max ${VALIDATION_LIMITS.name.max} characters)`;
      return null;
    }

    if (field === "subject") {
      if (!value || value.length < VALIDATION_LIMITS.subject.min)
        return "Subject is required";
      if (value.length > VALIDATION_LIMITS.subject.max)
        return `Subject too long (max ${VALIDATION_LIMITS.subject.max} characters)`;
      return null;
    }

    if (field === "message") {
      if (!value || value.length < VALIDATION_LIMITS.message.min)
        return `Message must be at least ${VALIDATION_LIMITS.message.min} characters`;
      if (value.length > VALIDATION_LIMITS.message.max)
        return `Message too long (max ${VALIDATION_LIMITS.message.max} characters)`;
      return null;
    }

    return null;
  };

  const isFormValid = () => {
    return (
      !validateField("name", formData.name) &&
      !validateField("email", formData.email) &&
      !validateField("subject", formData.subject) &&
      !validateField("message", formData.message)
    );
  };

  const handleFieldBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
          {/* Contact Form */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <p className="text-text-2 text-sm">
                Fill out the form below and I&apos;ll get back to you as soon as
                possible.
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col h-full space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text-1"
                    >
                      Name
                    </label>
                    <span
                      className={`text-xs ${
                        formData.name.length > VALIDATION_LIMITS.name.max
                          ? "text-destructive"
                          : "text-text-3"
                      }`}
                    >
                      {formData.name.length}/{VALIDATION_LIMITS.name.max}
                    </span>
                  </div>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    onBlur={() => handleFieldBlur("name")}
                    className={
                      touched.name && validateField("name", formData.name)
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    required
                  />
                  {touched.name && validateField("name", formData.name) && (
                    <p className="text-xs text-destructive mt-1">
                      {validateField("name", formData.name)}
                    </p>
                  )}
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
                    onBlur={() => handleFieldBlur("email")}
                    className={
                      touched.email && validateField("email", formData.email)
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    required
                  />
                  {touched.email && validateField("email", formData.email) && (
                    <p className="text-xs text-destructive mt-1">
                      {validateField("email", formData.email)}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-text-1"
                    >
                      Subject
                    </label>
                    <span
                      className={`text-xs ${
                        formData.subject.length > VALIDATION_LIMITS.subject.max
                          ? "text-destructive"
                          : "text-text-3"
                      }`}
                    >
                      {formData.subject.length}/{VALIDATION_LIMITS.subject.max}
                    </span>
                  </div>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    onBlur={() => handleFieldBlur("subject")}
                    className={
                      touched.subject &&
                      validateField("subject", formData.subject)
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    required
                  />
                  {touched.subject &&
                    validateField("subject", formData.subject) && (
                      <p className="text-xs text-destructive mt-1">
                        {validateField("subject", formData.subject)}
                      </p>
                    )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-1"
                    >
                      Message
                    </label>
                    <span
                      className={`text-xs ${
                        formData.message.length < VALIDATION_LIMITS.message.min
                          ? "text-text-3"
                          : formData.message.length >
                              VALIDATION_LIMITS.message.max
                            ? "text-destructive"
                            : "text-text-3"
                      }`}
                    >
                      {formData.message.length}/{VALIDATION_LIMITS.message.max}
                    </span>
                  </div>
                  <div className="relative flex-1 flex flex-col">
                    <Textarea
                      id="message"
                      placeholder="Tell me more..."
                      className={`flex-1 resize-none min-h-[300px] pr-28 leading-7 ${
                        touched.message &&
                        validateField("message", formData.message)
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      onBlur={() => handleFieldBlur("message")}
                      required
                    />
                    {touched.message &&
                      validateField("message", formData.message) && (
                        <p className="text-xs text-destructive mt-1">
                          {validateField("message", formData.message)}
                        </p>
                      )}
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-brand-primary to-accent-primary hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      onClick={() => setIsEditorOpen(true)}
                      disabled={!formData.message.trim() || isSubmitting}
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
                  disabled={isSubmitting || !isFormValid()}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Editor Modal */}
          <AIEditorModal
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            originalText={formData.message}
            onApply={(editedText) => {
              setFormData({ ...formData, message: editedText });
              setIsEditorOpen(false);
            }}
          />

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
