import { useState } from "react";
import {
  FileText,
  Send,
  FileCheck,
  Notebook,
  DollarSign,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { mockDocuments, documentTypeLabels } from "../data/mock";
import type { DocumentType } from "../types";

const typeIcons: Record<string, React.ReactNode> = {
  "cover-letter": <FileText size={18} />,
  "follow-up": <Send size={18} />,
  "resume-tips": <FileCheck size={18} />,
  "interview-prep": <Notebook size={18} />,
  "salary-negotiation": <DollarSign size={18} />,
};

const typeFilters: (DocumentType | "all")[] = [
  "all",
  "cover-letter",
  "follow-up",
  "interview-prep",
  "salary-negotiation",
  "resume-tips",
];

export function Documents() {
  const [filter, setFilter] = useState<DocumentType | "all">("all");

  const filtered =
    filter === "all"
      ? mockDocuments
      : mockDocuments.filter((d) => d.type === filter);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">
            AI-generated documents tailored to each application.
          </p>
        </div>
        <button className="btn-primary">
          <Sparkles size={16} />
          Generate New
        </button>
      </div>

      <div className="status-tabs">
        {typeFilters.map((type) => (
          <button
            key={type}
            className={`status-tab ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type === "all" ? "All" : documentTypeLabels[type]}
          </button>
        ))}
      </div>

      <div className="documents-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">No documents found</div>
        ) : (
          filtered.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-card-top">
                <div
                  className="document-type-icon"
                  style={{
                    backgroundColor:
                      doc.type === "cover-letter"
                        ? "#78716C18"
                        : doc.type === "follow-up"
                          ? "#D9770618"
                          : doc.type === "interview-prep"
                            ? "#22C55E18"
                            : doc.type === "salary-negotiation"
                              ? "#8B5CF618"
                              : "#78716C18",
                    color:
                      doc.type === "cover-letter"
                        ? "#78716C"
                        : doc.type === "follow-up"
                          ? "#D97706"
                          : doc.type === "interview-prep"
                            ? "#22C55E"
                            : doc.type === "salary-negotiation"
                              ? "#8B5CF6"
                              : "#78716C",
                  }}
                >
                  {typeIcons[doc.type]}
                </div>
                <div className="document-card-info">
                  <h3 className="document-card-title">{doc.title}</h3>
                  <span className="document-card-type">
                    {documentTypeLabels[doc.type]}
                  </span>
                </div>
                <ArrowUpRight size={16} className="document-card-link" />
              </div>
              <p className="document-card-desc">{doc.content}</p>
              <div className="document-card-footer">
                <div className="document-card-meta">
                  {doc.applicationCompany && (
                    <span className="document-card-company">
                      {doc.applicationCompany}
                    </span>
                  )}
                  <span className="document-card-date">
                    {doc.generatedDate}
                  </span>
                </div>
                <span className="document-ai-badge">
                  <Sparkles size={12} />
                  AI
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
