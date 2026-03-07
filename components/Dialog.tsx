"use client";

import { DialogOptions } from "@/types";

interface Props extends DialogOptions {
  onConfirm: () => void;
  onCancel: () => void;
}

export function Dialog({
  title, message,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  danger       = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="cv-modal-bg" onClick={onCancel}>
      <div
        className="cv-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cv-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36, height: 36,
                borderRadius: 6,
                background: danger ? "var(--rose-dim)" : "var(--accent-dim)",
                border: `1px solid ${danger ? "rgba(220,38,38,0.15)" : "rgba(62,106,225,0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {danger ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={danger ? "var(--rose)" : "var(--accent)"} strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                {title}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>
                {message}
              </div>
            </div>
          </div>

          <button className="cv-btn cv-btn-icon" onClick={onCancel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="cv-modal-footer">
          <button className="cv-btn cv-btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="cv-btn"
            style={{
              background:   danger ? "var(--rose)"   : "var(--accent)",
              borderColor:  danger ? "var(--rose)"   : "var(--accent)",
              color:        "#fff",
              padding:      "9px 20px",
              fontWeight:   600,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}