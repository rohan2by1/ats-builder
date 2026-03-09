"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  initialContent: string;
  onClose: () => void;
  onExportTex: (content: string, filename: string) => void;
  onExportPdf: (content: string, filename: string) => Promise<void>;
}

export function ExportModal({
  initialContent, onClose, onExportTex, onExportPdf,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState("CV-Sk_Md_Rohan-2026");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handlePdf = async () => {
    setError("");
    setPdfLoading(true);
    try {
      await onExportPdf(content, filename);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "PDF export failed");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="cv-modal-bg" onClick={onClose}>
      <div
        className="cv-modal cv-modal-lg cv-export-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ────────────────────────────────── */}
        <div className="cv-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 6,
              background: "var(--accent-dim)",
              border: "1px solid rgba(62,106,225,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--accent)" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                Export LaTeX
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Review &amp; edit before downloading
              </div>
            </div>
          </div>

          <button className="cv-btn cv-btn-icon" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Filename input ─────────────────────── */}
        <div style={{
          padding: "12px 22px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}>
          <label style={{
            fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
            letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>Filename</label>
          <input
            className="cv-input"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename…"
            style={{ flex: 1, padding: "7px 11px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        {/* ── Body (editable textarea) ─────────────── */}
        <div className="cv-modal-body" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
          <textarea
            ref={textareaRef}
            className="cv-export-textarea cv-scrollbar"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* ── Error banner ─────────────────────────── */}
        {error && (
          <div style={{
            padding: "10px 22px",
            background: "var(--rose-dim)",
            borderTop: "1px solid rgba(220,38,38,0.15)",
            color: "var(--rose)",
            fontSize: 12,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Footer ───────────────────────────────── */}
        <div className="cv-modal-footer" style={{ justifyContent: "space-between" }}>
          <button className="cv-btn cv-btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            {/* Download .tex */}
            <button
              className="cv-btn cv-btn-subtle"
              onClick={() => onExportTex(content, filename)}
              style={{ padding: "9px 18px", fontWeight: 600 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download .tex
            </button>

            {/* Export PDF */}
            <button
              className="cv-btn cv-btn-success"
              onClick={handlePdf}
              disabled={pdfLoading}
              style={{ padding: "9px 20px", fontWeight: 600 }}
            >
              {pdfLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="cv-spinner" style={{
                    width: 14, height: 14,
                    borderColor: "rgba(255,255,255,0.25)",
                    borderTopColor: "#fff",
                  }} />
                  Compiling…
                </span>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
