/**
 * Credentials Data
 *
 * Education, certifications, and professional qualifications.
 * Organized by category with verification links and details.
 */

export interface Credential {
  id: string;
  title: string;
  institution: string;
  institutionUrl?: string;
  date: string;
  dateRange?: { start: string; end: string };
  description: string;
  type: "education" | "certification" | "award";
  category:
    | "bootcamp"
    | "university"
    | "professional"
    | "cloud"
    | "ai-ml"
    | "recognition";
  status: "completed" | "in-progress";
  certificateUrl?: string;
  verificationUrl?: string;
  skills?: string[];
  highlights?: string[];
  credentialId?: string;
  logo?: string;
}

export const credentials: Credential[] = [
  // Education - Bootcamps & Training
  {
    id: "nss-fullstack",
    title: "Full Stack Web Developer Bootcamp",
    institution: "Nashville Software School",
    institutionUrl: "https://nashvillesoftwareschool.com/",
    date: "2024 - 2025",
    dateRange: { start: "2024", end: "2025" },
    description:
      "Intensive full-stack web development program covering modern JavaScript frameworks, React, Node.js, databases, and full-stack architecture. Built production-ready applications with focus on clean code, testing, and deployment.",
    type: "education",
    category: "bootcamp",
    status: "completed",
    certificateUrl: "/assets/Omer-Akben-NSS-Certificate.pdf",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "RESTful APIs",
      "Git",
      "Agile/Scrum",
    ],
    highlights: [
      "Built 6+ full-stack applications from scratch",
      "Collaborated on team projects using Git workflows",
      "Implemented CI/CD pipelines and deployment strategies",
      "Mastered modern React patterns and state management",
    ],
  },
  {
    id: "techcenture-sdet",
    title: "Full Stack Software Development Engineer in Test",
    institution: "TechCenture Academy",
    institutionUrl: "https://techcenture.com/",
    date: "2017 - 2018",
    dateRange: { start: "2017", end: "2018" },
    description:
      "Comprehensive training in QA automation, test frameworks, and software development engineering in test practices. Specialized in Selenium, automation architecture, and enterprise testing strategies.",
    type: "education",
    category: "bootcamp",
    status: "completed",
    skills: [
      "Selenium WebDriver",
      "Java",
      "TestNG",
      "JUnit",
      "Maven",
      "Jenkins",
      "Page Object Model",
      "API Testing",
    ],
    highlights: [
      "Designed enterprise test automation frameworks",
      "Implemented CI/CD pipeline integration for automated testing",
      "Achieved 80% test coverage on client projects",
      "Mentored junior QA engineers in automation best practices",
    ],
  },

  // Education - University
  {
    id: "okan-healthcare",
    title: "Master of Science in Healthcare Management",
    institution: "Istanbul Okan University",
    institutionUrl: "https://www.okan.edu.tr/en/",
    date: "2014 - 2016",
    dateRange: { start: "2014", end: "2016" },
    description:
      "Advanced degree focused on healthcare management, operations, and strategic planning. Developed analytical and leadership skills applicable to technology project management and systems thinking.",
    type: "education",
    category: "university",
    status: "completed",
    skills: [
      "Healthcare Systems",
      "Project Management",
      "Data Analysis",
      "Strategic Planning",
      "Operations Management",
    ],
    highlights: [
      "Graduated with honors",
      "Led healthcare systems analysis projects",
      "Published research on healthcare technology integration",
    ],
  },

  // Certifications - Cloud & Infrastructure
  {
    id: "nss-cloud-deployment",
    title: "NSS Cloud Deployment Certificate",
    institution: "Nashville Software School",
    institutionUrl: "https://nashvillesoftwareschool.com/",
    date: "2025",
    description:
      "5-week intensive cloud deployment program covering AWS services (S3, CloudFront, EC2, ECR, RDS), Docker containerization, CI/CD pipelines with GitHub Actions, and infrastructure as code practices for production cloud deployments.",
    type: "certification",
    category: "cloud",
    status: "completed",
    certificateUrl: "/assets/Omer-Akben-NSS-Cloud-Certificate.pdf",
    skills: [
      "AWS S3",
      "CloudFront",
      "AWS EC2",
      "AWS ECR",
      "AWS RDS",
      "AWS CLI",
      "Docker",
      "CI/CD",
      "GitHub Actions",
      "Infrastructure as Code",
    ],
    highlights: [
      "Deployed front-end apps to S3 with CloudFront CDN distribution",
      "Built CI/CD pipelines using GitHub Actions for automated deployments",
      "Containerized back-end APIs with Docker and deployed to EC2 instances",
      "Configured RDS databases and integrated with production applications",
    ],
  },
  {
    id: "ibm-cloud-computing",
    title: "Introduction to Cloud Computing",
    institution: "IBM via Coursera",
    institutionUrl: "https://www.coursera.org",
    date: "2024",
    description:
      "Comprehensive introduction to cloud computing concepts, service models (IaaS, PaaS, SaaS), deployment models, and major cloud platforms. Covered cloud architecture, security, and emerging trends.",
    type: "certification",
    category: "cloud",
    status: "completed",
    verificationUrl:
      "https://www.coursera.org/account/accomplishments/verify/T450ZUT1K82P",
    credentialId: "T450ZUT1K82P",
    skills: [
      "Cloud Computing Fundamentals",
      "IaaS/PaaS/SaaS",
      "Cloud Architecture",
      "Cloud Security",
      "AWS/Azure/GCP Basics",
    ],
  },
  {
    id: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner Essentials",
    institution: "Amazon Web Services",
    institutionUrl: "https://aws.amazon.com/certification/",
    date: "2022",
    description:
      "Foundational understanding of AWS Cloud concepts, services, security, architecture, pricing, and support. Covers core AWS services including compute, storage, networking, and databases.",
    type: "certification",
    category: "cloud",
    status: "completed",
    certificateUrl: "/assets/Omer-Akben-AWS-Certificate.pdf",
    skills: [
      "AWS Cloud Fundamentals",
      "EC2 & S3",
      "AWS Global Infrastructure",
      "Cloud Security & Compliance",
      "AWS Pricing Models",
      "Cloud Architecture Basics",
    ],
  },
];

// Helper functions
export const getCredentialsByType = (type: Credential["type"]) =>
  credentials.filter((cred) => cred.type === type);

export const getCredentialsByCategory = (category: Credential["category"]) =>
  credentials.filter((cred) => cred.category === category);

export const getEducation = () => getCredentialsByType("education");

export const getCertifications = () => getCredentialsByType("certification");

export const getAwards = () => getCredentialsByType("award");

export const getCompletedCredentials = () =>
  credentials.filter((cred) => cred.status === "completed");

export const getInProgressCredentials = () =>
  credentials.filter((cred) => cred.status === "in-progress");

export const credentialStats = {
  totalCredentials: credentials.length,
  education: getEducation().length,
  certifications: getCertifications().length,
  awards: getAwards().length,
  skills: Array.from(new Set(credentials.flatMap((cred) => cred.skills || [])))
    .length,
};
