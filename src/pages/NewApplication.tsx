import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Send,
  Notebook,
  Check,
  ChevronRight,
  Upload,
  Brain,
  Target,
  BookOpen,
  AlertCircle,
  Link,
} from "lucide-react";
import type { Page, ApplicationStatus } from "../types";
import { saveApplication } from "../db";

interface NewApplicationProps {
  onNavigate: (page: Page) => void;
}

const steps = [
  { id: 1, label: "Job Post", icon: Upload },
  { id: 2, label: "ATS Score", icon: Target },
  { id: 3, label: "Documents", icon: FileText },
  { id: 4, label: "Review", icon: Check },
];

const mockAnalysis = {
  score: 78,
  summary:
    "Your profile is a strong match for this position. Key strengths in React and TypeScript align well with the requirements. Consider highlighting your experience with large-scale systems.",
  categories: [
    { name: "Keywords Match", score: 82, color: "#22C55E" },
    { name: "Experience", score: 75, color: "#D97706" },
    { name: "Education", score: 90, color: "#22C55E" },
    { name: "Skills Alignment", score: 70, color: "#D97706" },
  ],
  matchedSkills: [
    "React",
    "TypeScript",
    "Frontend Architecture",
    "System Design",
    "Performance Optimization",
  ],
  missingSkills: ["GraphQL", "Python", "AWS"],
  tips: [
    "Add a project that demonstrates your GraphQL experience",
    "Quantify your impact with more metrics in your resume",
    "Consider getting an AWS certification to stand out",
  ],
};

const mockDocuments = [
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: FileText,
    description: "Tailored cover letter highlighting your relevant experience",
    color: "#78716C",
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at Stripe. With over 7 years of experience building performant, accessible web applications, I am confident that my skills align perfectly with what you are looking for.

At Lumina Labs, I led a frontend architecture redesign that improved Core Web Vitals by 40%, demonstrating my ability to drive meaningful improvements at scale. I have extensive experience with React, TypeScript, and system design — all key requirements for this role.

I am particularly drawn to Stripe's mission to increase the GDP of the internet. My background in building developer-friendly tools and payment-adjacent infrastructure makes me well-suited to contribute from day one.

I would welcome the opportunity to discuss how my experience aligns with your team's goals.

Best regards,
Alex Chen`,
  },
  {
    id: "follow-up",
    label: "Follow-Up Email",
    icon: Send,
    description: "Professional follow-up to send after application submission",
    color: "#D97706",
    content: `Subject: Following Up on Senior Frontend Engineer Application

Hi [Hiring Manager Name],

I hope this message finds you well. I wanted to follow up on my application for the Senior Frontend Engineer position at Stripe, which I submitted on [date].

I remain very enthusiastic about the opportunity to join your team. My experience leading frontend architecture at Lumina Labs and my deep expertise in React and TypeScript align closely with the requirements for this role.

Please let me know if there are any additional materials I can provide to support my application.

Thank you for your time and consideration.

Best regards,
Alex Chen`,
  },
  {
    id: "interview-prep",
    label: "Interview Prep",
    icon: Notebook,
    description: "AI-generated preparation guide with likely topics",
    color: "#22C55E",
    content: `Interview Preparation Guide — Stripe Senior Frontend Engineer

Topics to Review:

1. System Design
   - Design a payment checkout flow
   - Real-time dashboard architecture
   - State management at scale

2. React Deep Dive
   - Reconciliation and rendering optimization
   - Custom hooks patterns
   - Error boundaries and recovery

3. Coding Challenges
   - Implement a virtual scroll component
   - Debounce/throttle implementation
   - Promise-based rate limiter

4. Behavioral
   - Describe a time you improved performance
   - How do you handle technical disagreements?
   - Tell me about a complex project you led`,
  },
];

export function NewApplication({ onNavigate }: NewApplicationProps) {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("cover-letter");

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("saved");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [jobPost, setJobPost] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDoc, setShowDoc] = useState(false);

  const selectedDoc = mockDocuments.find((d) => d.id === docType);

  const handleAnalyze = () => {
    if (!jobPost.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep(2);
    }, 1500);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowDoc(true);
    }, 1200);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveApplication({
        company,
        position,
        status,
        location,
        salary: salary || undefined,
        notes: notes || undefined,
        jobUrl: jobUrl || undefined,
      });
      onNavigate("applications");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (aiEnabled && step > 1) {
      setStep((s) => s - 1);
    } else {
      onNavigate("applications");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <button className="icon-button" onClick={handleBack}>
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="page-title">New Application</h1>
            <p className="page-subtitle">
              Add a job application to start tracking
            </p>
          </div>
        </div>
        <div className="ai-toggle-header">
          <Sparkles size={14} strokeWidth={1.5} className="ai-toggle-header-icon" />
          <span className="ai-toggle-header-label">AI Assistant</span>
          <button
            className={`toggle-switch compact ${aiEnabled ? "active" : ""}`}
            onClick={() => {
              setAiEnabled(!aiEnabled);
              setStep(1);
              setShowDoc(false);
            }}
            role="switch"
            aria-checked={aiEnabled}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>
      </div>

      {aiEnabled && (
        <div className="wizard-steps">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = step === s.id;
            const isPast = step > s.id;
            return (
              <div
                key={s.id}
                className={`wizard-step ${isActive ? "active" : ""} ${isPast ? "past" : ""}`}
              >
                <div className="wizard-step-indicator">
                  <div className="wizard-step-circle">
                    {isPast ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      <StepIcon size={14} strokeWidth={1.5} />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`wizard-step-line ${isPast ? "filled" : ""}`}
                    />
                  )}
                </div>
                <span className="wizard-step-label">{s.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {!aiEnabled ? (
        <div className="card-section">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSave();
            }}
          >
            <div className="card-section-body">
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job URL (optional)</label>
                <div className="input-with-icon">
                  <Link size={14} strokeWidth={1.5} className="input-icon" />
                  <input
                    type="url"
                    className="form-input has-icon"
                    placeholder="https://boards.greenhouse.io/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ApplicationStatus)
                    }
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Salary (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. $180k - $220k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Any notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="card-section-footer">
              <button type="submit" className="btn-primary" disabled={saving}>
                <Check size={16} strokeWidth={2.5} />
                {saving ? "Saving..." : "Save Application"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="wizard-content">
          {step === 1 && (
            <div className="card-section">
              <div className="card-section-header">
                <div className="card-section-header-icon" style={{ background: "#78716C18", color: "#78716C" }}>
                  <Upload size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="card-section-title">Paste Job Description</h3>
                  <p className="card-section-desc">
                    Paste the full job posting below. The AI will analyze it
                    against your resume.
                  </p>
                </div>
              </div>
              <div className="card-section-body">
                <div className="form-group">
                  <label className="form-label">Job URL (optional)</label>
                  <div className="input-with-icon">
                    <Link size={14} strokeWidth={1.5} className="input-icon" />
                    <input
                      type="url"
                      className="form-input has-icon"
                      placeholder="https://boards.greenhouse.io/..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-divider">
                  <span className="form-divider-label">or paste the description</span>
                </div>
                <div className="form-group">
                  <textarea
                    className="form-input form-textarea job-post-input"
                    placeholder={`Paste the full job description here...

Example:
Senior Frontend Engineer at Stripe

We are looking for a Senior Frontend Engineer to join our Payments team. You will be responsible for building and maintaining the core checkout experience used by millions of users.

Requirements:
- 5+ years of frontend development experience
- Strong proficiency in React and TypeScript
- Experience with system design and architecture
- Familiarity with GraphQL and REST APIs
- Understanding of web performance optimization
- Excellent problem-solving skills

Nice to have:
- Experience with payment systems or fintech
- Knowledge of AWS or cloud infrastructure
- Background in developer tools or APIs`}
                    value={jobPost}
                    onChange={(e) => setJobPost(e.target.value)}
                    rows={12}
                  />
                </div>
              </div>
              <div className="card-section-footer">
                <button
                  className="btn-primary"
                  onClick={handleAnalyze}
                  disabled={!jobPost.trim() || analyzing}
                >
                  {analyzing ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Brain size={16} strokeWidth={2.5} />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card-section">
              <div className="card-section-header">
                <div className="card-section-header-icon" style={{ background: "#22C55E18", color: "#22C55E" }}>
                  <Target size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="card-section-title">ATS Score Analysis</h3>
                  <p className="card-section-desc">
                    AI-powered analysis of your resume against the job
                    description
                  </p>
                </div>
              </div>

              <div className="ats-score-section">
                <div className="ats-score-ring">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={
                        2 * Math.PI * 60 - (2 * Math.PI * 60 * mockAnalysis.score) / 100
                      }
                      transform="rotate(-90 70 70)"
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                    <text
                      x="70"
                      y="60"
                      textAnchor="middle"
                      fill="var(--color-foreground)"
                      fontSize="28"
                      fontWeight="700"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {mockAnalysis.score}
                    </text>
                    <text
                      x="70"
                      y="78"
                      textAnchor="middle"
                      fill="var(--color-secondary)"
                      fontSize="11"
                      fontWeight="500"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      / 100
                    </text>
                  </svg>
                  <div className="ats-score-badge good-match">
                    <Check size={12} strokeWidth={3} />
                    Good Match
                  </div>
                </div>

                <div className="ats-breakdown">
                  <p className="ats-summary">{mockAnalysis.summary}</p>
                  <div className="ats-categories">
                    {mockAnalysis.categories.map((cat) => (
                      <div key={cat.name} className="ats-category">
                        <div className="ats-category-header">
                          <span className="ats-category-name">{cat.name}</span>
                          <span
                            className="ats-category-score"
                            style={{ color: cat.color }}
                          >
                            {cat.score}%
                          </span>
                        </div>
                        <div className="ats-category-bar">
                          <div
                            className="ats-category-fill"
                            style={{
                              width: `${cat.score}%`,
                              background: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ats-details-grid">
                <div className="ats-detail-card">
                  <div className="ats-detail-header">
                    <Check size={14} strokeWidth={2.5} style={{ color: "#22C55E" }} />
                    <span>Matched Skills</span>
                  </div>
                  <div className="ats-tags">
                    {mockAnalysis.matchedSkills.map((s) => (
                      <span key={s} className="ats-tag match">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ats-detail-card">
                  <div className="ats-detail-header">
                    <AlertCircle size={14} strokeWidth={2.5} style={{ color: "#D97706" }} />
                    <span>Missing Skills</span>
                  </div>
                  <div className="ats-tags">
                    {mockAnalysis.missingSkills.map((s) => (
                      <span key={s} className="ats-tag missing">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ats-tips">
                <div className="ats-tips-header">
                  <BookOpen size={14} strokeWidth={1.5} />
                  Tips to Improve Your Score
                </div>
                <ul className="ats-tips-list">
                  {mockAnalysis.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="card-section-footer">
                <button
                  className="btn-primary"
                  onClick={() => setStep(3)}
                >
                  Continue to Documents
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card-section">
              <div className="card-section-header">
                <div className="card-section-header-icon" style={{ background: "#D9770618", color: "#D97706" }}>
                  <FileText size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="card-section-title">Generate Documents</h3>
                  <p className="card-section-desc">
                    AI-generated documents tailored to this job application
                  </p>
                </div>
              </div>

              <div className="doc-types">
                {mockDocuments.map((doc) => {
                  const DocIcon = doc.icon;
                  return (
                    <button
                      key={doc.id}
                      className={`doc-type-card ${docType === doc.id ? "selected" : ""}`}
                      onClick={() => {
                        setDocType(doc.id);
                        setShowDoc(false);
                      }}
                    >
                      <div
                        className="doc-type-icon"
                        style={{ background: `${doc.color}18`, color: doc.color }}
                      >
                        <DocIcon size={18} strokeWidth={1.5} />
                      </div>
                      <div className="doc-type-info">
                        <span className="doc-type-label">{doc.label}</span>
                        <span className="doc-type-desc">{doc.description}</span>
                      </div>
                      {docType === doc.id && (
                        <div className="doc-type-check">
                          <Check size={14} strokeWidth={2.5} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="doc-preview-section">
                <button
                  className="btn-primary"
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{ marginBottom: showDoc ? "var(--space-md)" : 0 }}
                >
                  {generating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles size={16} strokeWidth={2.5} />
                      {showDoc ? "Regenerate" : `Generate ${selectedDoc?.label}`}
                    </>
                  )}
                </button>

                {showDoc && selectedDoc && (
                  <div className="doc-preview">
                    <div className="doc-preview-header">
                      <div className="doc-preview-title">
                        <FileText size={14} strokeWidth={1.5} />
                        {selectedDoc.label}
                      </div>
                      <span className="doc-preview-badge">AI Generated</span>
                    </div>
                    <div className="doc-preview-content">
                      {selectedDoc.content.split("\n").map((line, i) => (
                        <p key={i}>{line || "\u00A0"}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="card-section-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setStep(4)}
                >
                  Continue to Review
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="card-section">
              <div className="card-section-header">
                <div className="card-section-header-icon" style={{ background: "#D9770618", color: "#D97706" }}>
                  <Check size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="card-section-title">Review & Save</h3>
                  <p className="card-section-desc">
                    Fill in the application details and save
                  </p>
                </div>
              </div>

              <div className="review-summary">
                <div className="review-summary-item">
                  <span className="review-summary-label">ATS Score</span>
                  <span className="review-summary-value" style={{ color: "#22C55E" }}>
                    {mockAnalysis.score}/100 — Good Match
                  </span>
                </div>
                <div className="review-summary-item">
                  <span className="review-summary-label">Documents</span>
                  <span className="review-summary-value">
                    {showDoc ? `${selectedDoc?.label} ✓` : "Not generated"}
                  </span>
                </div>
              </div>

              <div className="card-section-body">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job URL (optional)</label>
                  <div className="input-with-icon">
                    <Link size={14} strokeWidth={1.5} className="input-icon" />
                    <input
                      type="url"
                      className="form-input has-icon"
                      placeholder="https://boards.greenhouse.io/..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as ApplicationStatus)
                      }
                    >
                      <option value="saved">Saved</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Salary (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. $180k - $220k"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Any notes about this application..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="card-section-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  <Check size={16} strokeWidth={2.5} />
                  {saving ? "Saving..." : "Save Application"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
