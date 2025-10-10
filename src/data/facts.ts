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
    title: "Full-Stack Developer / AI Engineer • QA - SDET",
    location: "Raleigh, NC",
    timezone: "EST (UTC-5)",
    email: "akbenof@gmail.com",
    phone: "+1 (919) 555-0123",
  },

  professional: {
    yearsOfExperience: 6,
    currentRole: "AI Full Stack Software Engineer",
    currentCompany: "Freelancer",
    specializations: [
      "AI/ML Engineering",
      "Full-Stack Development",
      "QA Test Automation",
      "Test-Driven Development",
      "CI/CD Architecture",
    ],
    availability: "Available for new opportunities",
    workPreferences: {
      remote: true,
      location: "Raleigh, NC or Remote",
      roles: ["Senior AI/ML Engineer", "Full-Stack Engineer", "QA Automation Architect", "SDET"],
    },
  },

  skills: {
    languages: ["TypeScript", "Python", "JavaScript", "SQL", "Go"],
    frameworks: ["React", "Next.js", "Node.js", "FastAPI", "TensorFlow"],
    aiml: ["OpenAI API", "LangChain", "Vector Databases", "MLOps", "Agentic Workflows"],
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
      name: "Machine Learning Specialization",
      issuer: "Stanford University / Coursera",
      year: "2023",
    },
    {
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      year: "2023",
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
    "Omer 'Ozzy' Akben is a Full-Stack Developer, AI Engineer, and QA - SDET with 6+ years of experience building agentic systems, robust QA automation, and full-stack applications. Specializing in test automation frameworks, AI-powered development tools, and enterprise-scale automation solutions. Based in Raleigh, NC and available for remote opportunities.",
};

// Helper functions for agents
export const getContactInfo = () => facts.personal;
export const getSkillsByCategory = (category: keyof typeof facts.skills) =>
  facts.skills[category];
export const getFeaturedProjects = () => facts.projects.featured;
export const getEducation = () => facts.education;
export const getCertifications = () => facts.certifications;
export const getSocialLinks = () => facts.social;
