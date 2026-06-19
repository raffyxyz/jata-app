import { useState, useEffect, useMemo, useCallback } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { ResumeFile } from "../types";
import { readPdfBytes, base64ToUint8Array } from "../services/pdf";

import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs";
globalThis.pdfjsWorker = pdfjsWorker;

interface PdfViewerModalProps {
  resume: ResumeFile | null;
  onClose: () => void;
}

export function PdfViewerModal({ resume, onClose }: PdfViewerModalProps) {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fileObj = useMemo(
    () => (pdfBytes ? { data: pdfBytes.slice() } : null),
    [pdfBytes]
  );

  useEffect(() => {
    if (!resume) {
      setPdfBytes(null);
      setNumPages(null);
      setPageNumber(1);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setPageNumber(1);

    const load = async () => {
      try {
        if (resume.filePath) {
          const bytes = await readPdfBytes(resume.filePath);
          setPdfBytes(bytes);
        } else if (resume.data) {
          setPdfBytes(base64ToUint8Array(resume.data));
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [resume]);

  const handlePrevious = useCallback(
    () => setPageNumber((p) => Math.max(1, p - 1)),
    []
  );

  const handleNext = useCallback(
    () => setPageNumber((p) => Math.min(numPages ?? p, p + 1)),
    [numPages]
  );

  if (!resume) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal pdf-viewer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pdf-viewer-header">
          <h3 className="modal-title">{resume.name}</h3>
          <button className="table-action" onClick={onClose}>
            <IconX size={16} />
          </button>
        </div>
        <div className="pdf-viewer-body">
          {error ? (
            <div className="react-pdf__message">Failed to load PDF.</div>
          ) : loading ? (
            <div className="react-pdf__message">Loading PDF...</div>
          ) : fileObj ? (
            <Document
              file={fileObj}
              onLoadSuccess={({ numPages: np }) => setNumPages(np)}
              loading={
                <div className="react-pdf__message">Loading PDF...</div>
              }
              error={
                <div className="react-pdf__message">Failed to load PDF.</div>
              }
            >
              <Page pageNumber={pageNumber} width={800} />
            </Document>
          ) : null}
        </div>
        {numPages && numPages > 1 && (
          <div className="pdf-viewer-footer">
            <button
              className="btn-secondary"
              disabled={pageNumber <= 1}
              onClick={handlePrevious}
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
              onClick={handleNext}
            >
              Next
              <IconChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
