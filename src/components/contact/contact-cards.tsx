"use client";

import { CONTACT_BRANDS } from "@/config/contact-brands";
import { facts } from "@/data/facts";
import { Github, Linkedin } from "@/components/brand-icons";
import { Calendar, Mail, Phone } from "lucide-react";
import { ContactMethodCard } from "./contact-method-card";

export function LinkedInContactCard({ delay = 0 }: { delay?: number }) {
  return (
    <ContactMethodCard
      icon={Linkedin}
      label="LinkedIn"
      value="Omer AKBEN"
      subtitle={facts.personal.title}
      href={facts.social.linkedin}
      brandColor={CONTACT_BRANDS.linkedin}
      external
      delay={delay}
    />
  );
}

export function GitHubContactCard({ delay = 0 }: { delay?: number }) {
  return (
    <ContactMethodCard
      icon={Github}
      label="GitHub"
      value="@omerakben"
      subtitle="Open Source Projects"
      href={facts.social.github}
      brandColor={CONTACT_BRANDS.github}
      external
      delay={delay}
    />
  );
}

export function EmailContactCard({ delay = 0 }: { delay?: number }) {
  return (
    <ContactMethodCard
      icon={Mail}
      label="Email"
      value={facts.personal.email}
      href={`mailto:${facts.personal.email}`}
      brandColor="brand"
      delay={delay}
    />
  );
}

export function PhoneContactCard({ delay = 0 }: { delay?: number }) {
  return (
    <ContactMethodCard
      icon={Phone}
      label="Phone"
      value={facts.personal.phone}
      href={`tel:${facts.personal.phone.replace(/[^0-9+]/g, "")}`}
      brandColor="accent"
      delay={delay}
    />
  );
}

export function CalendarContactCard({ delay = 0 }: { delay?: number }) {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK ||
    "https://calendly.com/omerakben/30min";

  return (
    <ContactMethodCard
      icon={Calendar}
      label="Schedule"
      value="Let's Chat"
      subtitle="30-min casual conversation"
      href={calendlyLink}
      brandColor={CONTACT_BRANDS.calendar}
      external
      delay={delay}
    />
  );
}
