import type { JobApplication, ResumeData, AppDocument, DashboardStats } from "../types";

export const mockStats: DashboardStats = {
  totalApplications: 24,
  activeApplications: 12,
  interviews: 4,
  offers: 2,
  rejected: 6,
};

export const mockApplications: JobApplication[] = [
  {
    id: "1",
    company: "Stripe",
    position: "Senior Frontend Engineer",
    status: "interview",
    appliedDate: "2026-06-10",
    location: "San Francisco, CA (Remote)",
    salary: "$180k - $220k",
    notes: "Had a great initial call with the recruiter. Technical screen scheduled.",
  },
  {
    id: "2",
    company: "Figma",
    position: "Product Engineer",
    status: "interview",
    appliedDate: "2026-06-01",
    location: "New York, NY (Hybrid)",
    salary: "$170k - $200k",
    notes: "Portfolio review passed. Next round: system design.",
  },
  {
    id: "3",
    company: "Linear",
    position: "Software Engineer - Growth",
    status: "offer",
    appliedDate: "2026-05-20",
    location: "Remote",
    salary: "$190k - $230k",
    notes: "Offer received! Negotiating equity.",
  },
  {
    id: "4",
    company: "Vercel",
    position: "Frontend Platform Engineer",
    status: "applied",
    appliedDate: "2026-06-14",
    location: "San Francisco, CA (Remote)",
    salary: "$175k - $210k",
  },
  {
    id: "5",
    company: "GitHub",
    position: "UI Engineer",
    status: "rejected",
    appliedDate: "2026-05-28",
    location: "Remote",
    notes: "Rejected after take-home assignment. Good feedback though.",
  },
  {
    id: "6",
    company: "Notion",
    position: "Design Engineer",
    status: "applied",
    appliedDate: "2026-06-12",
    location: "New York, NY (Remote)",
    salary: "$165k - $195k",
  },
  {
    id: "7",
    company: "Railway",
    position: "Full Stack Engineer",
    status: "saved",
    appliedDate: "",
    location: "Remote",
    salary: "$160k - $190k",
  },
  {
    id: "8",
    company: "Datadog",
    position: "Software Engineer - DX",
    status: "interview",
    appliedDate: "2026-05-15",
    location: "New York, NY",
    salary: "$185k - $215k",
    notes: "Final round coming up next week.",
  },
  {
    id: "9",
    company: "Supabase",
    position: "Frontend Engineer",
    status: "withdrawn",
    appliedDate: "2026-05-10",
    location: "Remote",
  },
  {
    id: "10",
    company: "Railway",
    position: "Platform Engineer",
    status: "offer",
    appliedDate: "2026-04-28",
    location: "Remote",
    salary: "$175k - $200k",
    notes: "Second offer! Good leverage for negotiations.",
  },
  {
    id: "11",
    company: "Cloudflare",
    position: "Workers Engineer",
    status: "rejected",
    appliedDate: "2026-05-05",
    location: "Austin, TX (Remote)",
  },
  {
    id: "12",
    company: "Anthropic",
    position: "Applied AI Engineer",
    status: "saved",
    appliedDate: "",
    location: "San Francisco, CA",
    salary: "$200k - $260k",
  },
];

export const mockResume: ResumeData = {
  id: "1",
  name: "Alex Chen",
  email: "alex.chen@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  title: "Senior Frontend Engineer",
  summary:
    "Product-minded engineer with 7+ years building performant, accessible web applications. Passionate about developer experience, design systems, and crafting interfaces that users love. Most recently led frontend architecture at a Series B startup serving 500k+ users.",
  experience: [
    {
      id: "exp1",
      company: "Lumina Labs",
      position: "Senior Frontend Engineer",
      startDate: "Jan 2023",
      endDate: "Present",
      description:
        "Led frontend architecture redesign improving Core Web Vitals by 40%. Built a component library used across 3 product teams. Mentored 4 junior engineers through structured code reviews and pair programming.",
    },
    {
      id: "exp2",
      company: "CodeStream",
      position: "Frontend Engineer",
      startDate: "Mar 2021",
      endDate: "Dec 2022",
      description:
        "Developed real-time collaborative editing features using CRDTs. Reduced bundle size by 60% through code splitting and tree shaking. Implemented comprehensive E2E testing suite with Cypress.",
    },
    {
      id: "exp3",
      company: "WebForge Agency",
      position: "Junior Developer",
      startDate: "Jun 2019",
      endDate: "Feb 2021",
      description:
        "Built 15+ client websites and web applications using React, Next.js, and TypeScript. Established coding standards and automated deployment pipelines.",
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "UC Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2015",
      endDate: "2019",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "GraphQL",
    "PostgreSQL",
    "Figma",
    "Storybook",
    "Playwright",
    "Vite",
    "CSS-in-JS",
    "Webpack",
    "Rust",
  ],
  languages: ["English (Native)", "Mandarin (Conversational)"],
};

export const mockDocuments: AppDocument[] = [
  {
    id: "doc1",
    title: "Senior Frontend Engineer - Stripe",
    type: "cover-letter",
    generatedDate: "2026-06-10",
    applicationId: "1",
    applicationCompany: "Stripe",
    content:
      "Crafted cover letter highlighting payments infrastructure experience and interest in fintech.",
  },
  {
    id: "doc2",
    title: "Interview Prep: Stripe Technical Screen",
    type: "interview-prep",
    generatedDate: "2026-06-12",
    applicationId: "1",
    applicationCompany: "Stripe",
    content:
      "AI-generated preparation guide for Stripe's frontend technical screen, including system design and React coding challenges.",
  },
  {
    id: "doc3",
    title: "Follow-Up Email - Vercel Application",
    type: "follow-up",
    generatedDate: "2026-06-15",
    applicationId: "4",
    applicationCompany: "Vercel",
    content:
      "Professional follow-up email to send 7 days after application submission.",
  },
  {
    id: "doc4",
    title: "Resume Optimization Report",
    type: "resume-tips",
    generatedDate: "2026-06-08",
    content:
      "Analysis of your resume against top tech companies: 8/10 match score. Suggested improvements for ATS compatibility.",
  },
  {
    id: "doc5",
    title: "Salary Negotiation Strategy",
    type: "salary-negotiation",
    generatedDate: "2026-06-16",
    applicationId: "3",
    applicationCompany: "Linear",
    content:
      "AI-optimized negotiation script leveraging your competing offer from Railway. Target: $210k base + 0.5% equity.",
  },
  {
    id: "doc6",
    title: "Cover Letter - Figma Product Engineer",
    type: "cover-letter",
    generatedDate: "2026-06-01",
    applicationId: "2",
    applicationCompany: "Figma",
    content:
      "Cover letter emphasizing design tool expertise and collaborative product development experience.",
  },
  {
    id: "doc7",
    title: "Interview Prep: Figma System Design",
    type: "interview-prep",
    generatedDate: "2026-06-05",
    applicationId: "2",
    applicationCompany: "Figma",
    content:
      "Preparation guide for Figma's system design round, focusing on real-time collaboration architecture.",
  },
  {
    id: "doc8",
    title: "Salary Negotiation - Railway Platform Engineer",
    type: "salary-negotiation",
    generatedDate: "2026-06-16",
    applicationId: "10",
    applicationCompany: "Railway",
    content:
      "Negotiation script targeting $190k base + infrastructure budget. Leverage Linear offer.",
  },
];

export const statusColors: Record<string, string> = {
  saved: "#A8A29E",
  applied: "#78716C",
  interview: "#D97706",
  offer: "#22C55E",
  rejected: "#DC2626",
  withdrawn: "#A8A29E",
};

export const statusLabels: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const documentTypeLabels: Record<string, string> = {
  "cover-letter": "Cover Letter",
  "follow-up": "Follow-Up Email",
  "resume-tips": "Resume Tips",
  "interview-prep": "Interview Prep",
  "salary-negotiation": "Salary Negotiation",
};

export const documentTypeIcons: Record<string, string> = {
  "cover-letter": "FileText",
  "follow-up": "Send",
  "resume-tips": "FileCheck",
  "interview-prep": "Notebook",
  "salary-negotiation": "DollarSign",
};
