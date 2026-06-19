import { useState, useRef, useEffect, useCallback } from "react";
import {
  IconFileText,
  IconPlus,
  IconTrash,
  IconEye,
  IconDotsVertical,
} from "@tabler/icons-react";
import { notify } from "../notification";
import type { ResumeFile } from "../types";
import { useResumesQuery, useUploadResumeMutation, useDeleteResumeMutation } from "../hooks/useResumes";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { PdfViewerModal } from "../components/PdfViewerModal";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Resume() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingResume, setViewingResume] = useState<ResumeFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: resumes = [], isLoading } = useResumesQuery();
  const uploadMutation = useUploadResumeMutation();
  const deleteMutation = useDeleteResumeMutation();

  useEffect(() => {
    if (!openMenuId) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".action-menu")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        await notify("Invalid File", "Only PDF files are supported.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      uploadMutation.mutate(file, {
        onSettled: () => {
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      });
    },
    [uploadMutation]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirmId) return;
    deleteMutation.mutate(deleteConfirmId);
    setDeleteConfirmId(null);
  }, [deleteConfirmId, deleteMutation]);

  const handleView = useCallback((resume: ResumeFile) => {
    setViewingResume(resume);
  }, []);

  const deleting = deleteMutation.isPending;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resume</h1>
          <p className="page-subtitle">Upload and manage your resume PDFs.</p>
        </div>
        {resumes.length > 0 && (
          <button
            className="btn-primary"
            disabled={uploadMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPlus size={16} strokeWidth={2.5} />
            {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>

      {isLoading ? (
        <div
          className="table-empty"
          style={{ padding: "40px 0", textAlign: "center" }}
        >
          Loading...
        </div>
      ) : resumes.length === 0 ? (
        <div className="empty-state">
          <IconFileText size={40} strokeWidth={1.5} />
          <h3 className="empty-state-title">No resumes uploaded</h3>
          <p className="empty-state-desc">
            Upload your first resume PDF to get started.
          </p>
          <button
            className="btn-primary"
            disabled={uploadMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPlus size={16} />
            {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      ) : (
        <div className="resume-grid">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              <div className="resume-card-icon">
                <IconFileText size={24} strokeWidth={1.5} />
              </div>
              <div className="resume-card-info">
                <span className="resume-card-name">{resume.name}</span>
                <span className="resume-card-meta">
                  {formatDate(resume.createdAt)}
                  {resume.size > 0 && ` \u00B7 ${formatSize(resume.size)}`}
                </span>
              </div>
              <div className="action-menu">
                <button
                  className="table-action"
                  onClick={() =>
                    setOpenMenuId(
                      openMenuId === resume.id ? null : resume.id
                    )
                  }
                >
                  <IconDotsVertical size={14} />
                </button>
                {openMenuId === resume.id && (
                  <div className="action-dropdown">
                    <button
                      className="action-dropdown-item"
                      onClick={() => {
                        setOpenMenuId(null);
                        handleView(resume);
                      }}
                    >
                      <IconEye size={14} />
                      Open
                    </button>
                    <div className="action-dropdown-divider" />
                    <button
                      className="action-dropdown-item danger"
                      onClick={() => {
                        setOpenMenuId(null);
                        setDeleteConfirmId(resume.id);
                      }}
                    >
                      <IconTrash size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        open={!!deleteConfirmId}
        title="Delete Resume"
        description="Are you sure you want to delete this resume? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        isLoading={deleting}
      />

      {uploadMutation.isPending && (
        <div className="upload-overlay">
          <div className="upload-loader">
            <div className="upload-spinner" />
            <div className="upload-loader-text">Uploading resume...</div>
            <div className="upload-loader-file">{uploadMutation.variables?.name ?? ""}</div>
          </div>
        </div>
      )}

      <PdfViewerModal
        resume={viewingResume}
        onClose={() => setViewingResume(null)}
      />
    </div>
  );
}
