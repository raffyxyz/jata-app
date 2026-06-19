export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected" | "withdrawn";

export type DocumentType = "cover-letter" | "follow-up" | "resume-tips" | "interview-prep" | "salary-negotiation";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  location: string;
  salary?: string;
  notes?: string;
  logo?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

export interface AppDocument {
  id: string;
  title: string;
  type: DocumentType;
  generatedDate: string;
  applicationId?: string;
  applicationCompany?: string;
  content: string;
}

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviews: number;
  offers: number;
  rejected: number;
}

export interface ResumeFile {
  id: string;
  name: string;
  data: string;
  size: number;
  createdAt: string;
  filePath: string;
  parsedText?: string;
}

export type Page = "dashboard" | "applications" | "resume" | "documents" | "settings" | "new-application";
