import { facts } from "@/data/facts";
import { Github, Linkedin, Twitter } from "@/components/brand-icons";
import { Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/journey", label: "Journey" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
  ],
  resources: [
    { href: "/credentials", label: "Credentials" },
    { href: "/contact", label: "Contact" },
    { href: "/recruiter", label: "Recruiters" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;

const socialLinks = [
  {
    href: facts.social.github,
    label: "GitHub",
    icon: Github,
  },
  {
    href: facts.social.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: facts.social.twitter || "https://x.com/oakben",
    label: "Twitter",
    icon: Twitter,
  },
  {
    href: `mailto:${facts.personal.email}`,
    label: "Email",
    icon: Mail,
  },
] as const;

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-border-line bg-surf-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="mb-4 inline-block bg-synth-volt px-2 py-0.5 font-mono text-sm font-bold tracking-wider text-synth-volt-fg">
              OMER.AKBEN
            </h2>
            <p className="text-text-2 mb-6">
              AI full-stack engineer and founder of TUEL AI. Verified AI for
              learning, built with production test discipline.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center border-2 border-border-line text-text-2 transition-colors hover:bg-surf-2 hover:text-text-1"
                    aria-label={social.label}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-text-1">
              Navigation
            </h3>
            <ul className="md:space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-text-2 transition-colors hover:text-text-1 md:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-text-1">
              Resources
            </h3>
            <ul className="md:space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-text-2 transition-colors hover:text-text-1 md:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t-2 border-border-line pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-text-3">
              © {currentYear} Omer Akben. All rights reserved.
            </p>
            <p className="font-mono text-xs text-text-3">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
