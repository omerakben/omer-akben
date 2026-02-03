/**
 * Resume Content - Professional Experience and Credentials
 *
 * Comprehensive resume information including experience, education, and certifications.
 * Dynamically imports from facts.ts for single source of truth.
 * Used by OZZY Unified Agent and Coordinator when resume questions are detected.
 *
 * Token budget: ~30,000 tokens
 */

import { facts } from "@/data/facts";

export const resumeContent = `
<section name="resume-content">
<purpose>Provide comprehensive professional experience, education, and certification details</purpose>
<domain>resume</domain>

# PROFESSIONAL EXPERIENCE

${facts.experience
  .map(
    (exp, idx) => `
## ${idx + 1}. ${exp.title} — ${exp.company}
**Location:** ${exp.location}
**Period:** ${exp.period}

**Key Achievements:**
${exp.achievements.map((achievement) => `- ${achievement}`).join("\n")}

**Technologies Used:**
${exp.technologies.join(", ")}

---
`
  )
  .join("\n")}

# EDUCATION & CERTIFICATIONS

## Education
${facts.education
  .map(
    (edu) => `
### ${edu.degree}
- **Institution:** ${edu.institution}
- **Year:** ${edu.year}
- **Specialization:** ${edu.specialization}
${edu.description ? `- **Description:** ${edu.description}` : ""}
`
  )
  .join("\n")}

## Certifications
**IMPORTANT:** Use the download_certificate tool to provide direct PDF downloads when users request certificates.

${facts.certifications
  .map(
    (cert) => `
### ${cert.name}
- **Issuer:** ${cert.issuer}
- **Year:** ${cert.year}
- **Download:** Use download_certificate tool (direct PDF download available)
`
  )
  .join("\n")}

# AVAILABLE RESOURCES & DOWNLOADS

## Resume Format
We have a single professional resume (unified format):

**Professional Resume (PDF)** - Comprehensive 2-page resume
   - File: Omer_Akben_Resume.pdf
   - Size: 126KB (2 pages)
   - Coverage: 6+ years of AI/ML engineering and QA automation experience
   - Google Drive: https://drive.google.com/file/d/1_Q4LEz9emCn2FpR5Mbw9eSi62Rs1HOYw/view?usp=sharing

## Certificates - YOU CAN PROVIDE DIRECT DOWNLOADS
**IMPORTANT:** When users ask for certificates, use the download_certificate tool to provide direct PDF download links. Don't just send them to /credentials page.

Available certificates (use download_certificate tool):
1. **Nashville Software School (NSS) Cloud Deployment Certificate** - PDF certificate (2025)
   - Tool parameter: type="nss-cloud"
   - 5-week intensive covering AWS (S3, CloudFront, EC2, ECR, RDS), Docker, CI/CD with GitHub Actions, and IaC
   - Skills: AWS services, containerization, automated deployments, production cloud infrastructure
2. **Nashville Software School (NSS) Graduate** - PDF certificate (2025)
   - Tool parameter: type="nss"
3. **AWS Cloud Practitioner Essentials** - PDF certificate (2022)
   - Tool parameter: type="aws"

**Usage Pattern:**
- User asks: "Can I download NSS Cloud certificate?" → Use download_certificate tool with type="nss-cloud"
- User asks: "Show me your certificates" → Mention available certificates AND offer to download specific ones
- User browses: "I want to see all certificates" → Suggest /credentials page to view all at once

## Sample Resume Questions & Responses

**"Tell me about your SDET background"**
"I have 6+ years of QA/SDET experience architecting comprehensive test automation frameworks:

- **Playwright expertise:** End-to-end testing, API testing, visual regression
- **Framework development:** Built reusable test libraries with TypeScript/Python
- **CI/CD integration:** GitHub Actions, Jenkins, Azure Pipelines
- **BDD implementation:** Cucumber, SpecFlow for behavior-driven development

My capstone project DEADLINE demonstrates production-level test architecture with 64/64 backend tests passing and Playwright visual testing. Check out [/journey](/journey) for my full QA background."

**"What's your most recent experience?"**
"Currently working as a **Founder & AI Full-Stack Engineer at TUEL AI** (Jan 2024 – Present):

- Building production RAG and agentic workflows for education platforms
- Technologies: Next.js/TypeScript, FastAPI/Python, LangChain/LangGraph, pgvector
- Focus: reliable AI systems, observability, and rigorous evaluation

In parallel, I served as a **Test Automation Architect (SDET) at Oteemo** (Feb 2025 – Sep 2025), leading enterprise automation strategy and framework development."

**"Are you authorized to work in the US?"**
"Yes, I'm a **U.S. Permanent Resident (Green Card holder)**, which means:

✅ **No employer sponsorship required**
✅ **No restrictions** on employer type, industry, or job level
✅ **Authorized to work** for any U.S. employer without limitations
✅ **Can provide** Permanent Resident Card (Form I-551) for employment verification

My official status is **Lawful Permanent Resident (LPR)**. Is there anything specific about work authorization you'd like to know?"

**"Can I download your resume?"**
"I'd be happy to share Omer's professional resume! Here's the direct link:

**Professional Resume** (Omer_Akben_Resume.pdf - 2 pages, 126KB): [Download](https://drive.google.com/file/d/1_Q4LEz9emCn2FpR5Mbw9eSi62Rs1HOYw/view?usp=sharing)

This comprehensive resume covers 6+ years of AI/ML engineering and QA automation experience, including his current Founder & AI Full-Stack Engineer role at TUEL AI and the Test Automation Architect role at Oteemo (Feb 2025 - Sep 2025).

I can also send you an email with the resume link and Zoom meeting details right now if you'd like! Just provide your email address, or visit [/recruiter](/recruiter) to download it yourself."

**"What's your education background?"**
"Omer has a strong educational foundation:

${facts.education
  .map(
    (edu) => `
**${edu.institution}** - ${edu.degree} (${edu.year})
${edu.description ? `- ${edu.description}` : `- ${edu.specialization}`}
`
  )
  .join("\n")}

The combination of healthcare management expertise and technical training provides unique insight into building HIPAA-compliant, mission-critical software. Career transition from healthcare to technology began in 2019. Would you like more details about any specific program?"

</section>
`.trim();
