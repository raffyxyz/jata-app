import { useState, useEffect, useRef, useMemo } from "react";
import {
  IconFileText,
  IconPlus,
  IconTrash,
  IconEye,
  IconDotsVertical,
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api/core";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { ResumeFile } from "../types";
import { getResumes, saveResume, deleteResume } from "../db";
import { notify } from "../notification";

import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs";
globalThis.pdfjsWorker = pdfjsWorker;

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
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState<ResumeFile | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileObj = useMemo(
    () => (pdfBytes ? { data: pdfBytes.slice() } : null),
    [pdfBytes]
  );

  useEffect(() => {
    getResumes()
      .then(setResumes)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  const handleView = async (resume: ResumeFile) => {
    if (resume.filePath) {
      setViewing(resume);
      setPdfBytes(null);
      setPageNumber(1);
      setNumPages(null);
      try {
        const data = await invoke<number[]>("read_pdf", {
          filePath: resume.filePath,
        });
        setPdfBytes(new Uint8Array(data));
      } catch {
        await notify("Error", "Failed to read the PDF file.");
        setViewing(null);
      }
    } else if (resume.data) {
      const byteString = atob(resume.data.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      setViewing(resume);
      setPdfBytes(ia);
      setPageNumber(1);
      setNumPages(null);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      await notify("Invalid File", "Only PDF files are supported.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const fileData = Array.from(new Uint8Array(buffer));

      const filePath = await invoke<string>("save_pdf", {
        fileName: file.name,
        fileData,
      });

      await saveResume(file.name, "", filePath);
      const updated = await getResumes();
      setResumes(updated);
      await notify("Resume Uploaded", file.name);
    } catch {
      await notify("Upload Failed", "Could not upload the resume file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteResume(id);
    if (result?.filePath) {
      try {
        await invoke("delete_pdf_file", { filePath: result.filePath });
      } catch {
        /* file may already be gone */
      }
    }
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirm(null);
    await notify("Resume Deleted", "");
  };

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
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPlus size={16} strokeWidth={2.5} />
            {uploading ? "Uploading..." : "Upload Resume"}
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

      {loading ? (
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
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPlus size={16} />
            Upload Resume
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
                  {resume.size > 0 && ` · ${formatSize(resume.size)}`}
                </span>
              </div>
              <div className="action-menu">
                <button
                  className="table-action"
                  onClick={() =>
                    setOpenMenu(openMenu === resume.id ? null : resume.id)
                  }
                >
                  <IconDotsVertical size={14} />
                </button>
                {openMenu === resume.id && (
                  <div className="action-dropdown">
                    <button
                      className="action-dropdown-item"
                      onClick={() => {
                        setOpenMenu(null);
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
                        setOpenMenu(null);
                        setDeleteConfirm(resume.id);
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

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Resume</h3>
            <p className="modal-desc">
              Are you sure you want to delete this resume? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                <IconTrash size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div
          className="modal-overlay"
          onClick={() => {
            setViewing(null);
            setPdfBytes(null);
          }}
        >
          <div
            className="modal pdf-viewer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pdf-viewer-header">
              <h3 className="modal-title">{viewing.name}</h3>
              <button
                className="table-action"
                onClick={() => {
                  setViewing(null);
                  setPdfBytes(null);
                }}
              >
                <IconX size={16} />
              </button>
            </div>
            <div className="pdf-viewer-body">
              {fileObj ? (
                <Document
                  file={fileObj}
                  onLoadSuccess={({ numPages: np }) => setNumPages(np)}
                  loading={
                    <div className="react-pdf__message">Loading PDF...</div>
                  }
                  error={
                    <div className="react-pdf__message">
                      Failed to load PDF.
                    </div>
                  }
                >
                  <Page pageNumber={pageNumber} width={800} />
                </Document>
              ) : (
                <div className="react-pdf__message">Loading PDF...</div>
              )}
            </div>
            {numPages && numPages > 1 && (
              <div className="pdf-viewer-footer">
                <button
                  className="btn-secondary"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                >
                  <IconChevronLeft size={14} />
                  Previous
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  className="btn-secondary"
                  disabled={pageNumber >= numPages}
                  onClick={() =>
                    setPageNumber((p) => Math.min(numPages, p + 1))
                  }
                >
                  Next
                  <IconChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
