/**
 * Agent Grounding Data
 *
 * This file contains facts and information about Omer Akben
 * that AI agents can use to answer questions accurately.
 */

export const facts = {
  personal: {
    fullName: "Omer Akben",
    nickname: "Ozzy",
    title: "AI Full Stack Software Developer • QA - SDET",
    location: "Raleigh, NC",
    timezone: "EST (UTC-5)",
    email: "me@omerakben.com",
    phone: "+1 (267) 512-4566",
  },

  professional: {
    yearsOfExperience: 7,
    currentRole: "AI Full Stack Software Developer",
    currentCompany: "Freelancer",
    specializations: [
      "AI/ML Development",
      "Full-Stack Development",
      "QA Test Automation",
      "Test-Driven Development",
      "CI/CD Architecture",
    ],
    availability: "Available for new opportunities",
    workPreferences: {
      remote: true,
      location: "Raleigh, NC or Remote",
      roles: [
        "Senior AI/ML Developer",
        "Full-Stack Developer",
        "QA Automation Architect",
        "SDET",
      ],
    },
  },

  skills: {
    languages: ["TypeScript", "Python", "JavaScript", "SQL", "Go"],
    frameworks: ["React", "Next.js", "Node.js", "FastAPI", "TensorFlow"],
    aiml: [
      "OpenAI API",
      "LangChain",
      "Vector Databases",
      "MLOps",
      "Agentic Workflows",
    ],
    cloud: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    tools: ["Git", "VS Code", "Figma", "Postman"],
  },

  education: [
    {
      degree: "Full Stack Web Developer Bootcamp",
      institution: "Nashville Software School",
      year: "2024 - 2025",
      specialization: "Full-Stack Development",
    },
    {
      degree: "Full Stack Software Development Engineer in Test",
      institution: "TechCenture Academy",
      year: "2017 - 2018",
      specialization: "QA Automation",
    },
    {
      degree: "Master of Science in Healthcare",
      institution: "Istanbul Okan University",
      year: "2014 - 2016",
      specialization: "Healthcare Management",
    },
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2024",
    },
    {
      name: "Nashville Software School Graduate",
      issuer: "Nashville Software School",
      year: "2025",
    },
  ],

  projects: {
    featured: [
      {
        name: "Elon AI Chat Builder",
        description:
          "Enterprise AI chatbot platform for Elon University enabling faculty and staff to create custom AI assistants with knowledge base integration",
        technologies: ["Next.js", "OpenAI", "Supabase", "TypeScript", "Vercel"],
        status: "completed",
        year: "2024",
      },
      {
        name: "AI Toolbar — Chrome Extension",
        description:
          "Productivity Chrome extension with AI-powered tools for text summarization, translation, and content generation",
        technologies: ["Chrome API", "React", "OpenAI", "TypeScript"],
        status: "completed",
        year: "2024",
      },
      {
        name: "Genesis Test Copilot",
        description:
          "AI-powered test automation assistant that generates Playwright tests from natural language descriptions",
        technologies: ["Playwright", "LangChain", "FastAPI", "Python"],
        status: "completed",
        year: "2024",
      },
    ],
    total: 6,
  },

  social: {
    linkedin: "https://linkedin.com/in/omerakben",
    github: "https://github.com/omerakben",
    twitter: "https://twitter.com/omerakben",
    portfolio: "https://omerakben.com",
  },

  interests: [
    "Artificial Intelligence & Machine Learning",
    "Agentic AI Systems",
    "Full-Stack Development",
    "Open Source Contribution",
    "Technical Writing",
    "Mentoring & Teaching",
  ],

  about:
    "Omer 'Ozzy' Akben is a Full-Stack Developer, AI Developer, and QA - SDET with 7+ years of experience building agentic systems, robust QA automation, and full-stack applications. Specializing in test automation frameworks, AI-powered development tools, and enterprise-scale automation solutions. Based in Raleigh, NC and available for remote opportunities.",
};

// Helper functions for agents
export const getContactInfo = () => ({
  email: facts.personal.email,
  phone: facts.personal.phone,
  location: facts.personal.location,
  linkedin: facts.social.linkedin,
  github: facts.social.github,
  twitter: facts.social.twitter,
});
export const getSkillsByCategory = (category: keyof typeof facts.skills) =>
  facts.skills[category];
export const getFeaturedProjects = () => facts.projects.featured;
export const getEducation = () => facts.education;
export const getCertifications = () => facts.certifications;
export const getSocialLinks = () => facts.social;
