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
    href: facts.social.twitter || "https://x.com/mrfrkkbn",
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
    <footer className="border-t border-border-line bg-surf-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold text-text-1 mb-4">Omer Akben</h2>
            <p className="text-text-2 mb-6">
              Building intelligent systems and elegant solutions. Specializing
              in AI/ML engineering, full-stack development, and agentic
              workflows.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-2 hover:text-brand-primary transition-colors"
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
            <h3 className="text-sm font-semibold text-text-1 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-2 hover:text-text-1 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-sm font-semibold text-text-1 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-2 hover:text-text-1 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border-line">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-3">
              © {currentYear} Omer Akben. All rights reserved.
            </p>
            <p className="text-sm text-text-3">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
