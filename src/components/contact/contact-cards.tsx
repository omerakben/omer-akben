"use client";

import { facts } from "@/data/facts";
import { Calendar, Github, Linkedin, Mail, Phone } from "lucide-react";
import { ContactMethodCard } from "./contact-method-card";

export function LinkedInContactCard({ delay = 0 }: { delay?: number }) {
  return (
    <ContactMethodCard
      icon={Linkedin}
      label="LinkedIn"
      value="Omer AKBEN"
      subtitle={facts.personal.title}
      href={facts.social.linkedin}
      brandColor="#0077B5"
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
      brandColor="#24292e"
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
  return (
    <ContactMethodCard
      icon={Calendar}
      label="Schedule"
      value="Book a Meeting"
      subtitle="30-minute consultation"
      href="#"
      brandColor="#4285F4"
      delay={delay}
    />
  );
}
