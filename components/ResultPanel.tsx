"use client";

import { ViewType } from "@/types";

interface Props {
  result: string;
  loading: boolean;
  view: ViewType;
  onViewChange: (v: ViewType) => void;
  onCopy: () => void;
  onExport: () => void;
  historyCount: number;
  mounted: boolean;
  children: React.ReactNode;
}

export function ResultPanel({
  result, loading, view, onViewChange,
  onCopy, onExport, historyCount, children,
}: Props) {
  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
    }}>
      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}>
        <div className="cv-tabs">
          <button
            onClick={() => onViewChange("current")}
            className={`cv-tab ${view === "current" ? "cv-tab-active" : ""}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            Output
            {loading && (
              <span style={{
                width: 6, height: 6, borderRadius: 2,
                background: "var(--accent)",
                display: "inline-block",
                animation: "pulse-dot 1.2s ease-in-out infinite",
              }} />
            )}
          </button>

          <button
            onClick={() => onViewChange("history")}
            className={`cv-tab ${view === "history" ? "cv-tab-active" : ""}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            History
            {historyCount > 0 && (
              <span className="cv-tab-badge">{historyCount}</span>
            )}
          </button>
        </div>

        {/* Action buttons */}
        {view === "current" && result && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onCopy}
              className="cv-btn cv-btn-subtle"
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </button>
            <button
              onClick={onExport}
              className="cv-btn cv-btn-subtle"
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export .tex
            </button>
          </div>
        )}
      </div>

      {/* ── Content area ────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* Output tab */}
        {view === "current" && (
          <div style={{ height: "100%", overflow: "auto" }} className="cv-scrollbar">
            {result ? (
              <div style={{ padding: 18 }}>
                <div className="cv-result-wrap">
                  <div className="cv-result-header">
                    <div style={{
                      width: 28, height: 28, borderRadius: 4, flexShrink: 0,
                      background: "var(--green-dim)",
                      border: "1px solid rgba(18,162,82,0.15)",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 14,
                      color: "var(--green)", fontWeight: 700,
                    }}>✓</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green)" }}>
                        Optimized Output
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        Ready to copy or export
                      </div>
                    </div>
                  </div>
                  <pre className="cv-result-pre">{result}</pre>
                </div>
              </div>
            ) : (
              <div className="cv-empty" style={{ height: "100%" }}>
                {loading ? (
                  <>
                    <div style={{
                      width: 56, height: 56, borderRadius: 8,
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(62,106,225,0.12)",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 24,
                    }}>⚡</div>
                    <div className="cv-empty-title" style={{ marginTop: 10 }}>
                      Optimizing your CV…
                    </div>
                    <div className="cv-loading-dots" style={{ marginTop: 8 }}>
                      <div className="cv-dot" />
                      <div className="cv-dot" />
                      <div className="cv-dot" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cv-empty-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                    <div className="cv-empty-title">No output yet</div>
                    <div className="cv-empty-sub">
                      Fill in your CV and job description, then click Optimize
                    </div>
                    <div style={{
                      marginTop: 10, fontSize: 11,
                      color: "var(--text-faint)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      Ctrl + Enter to run
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* History tab */}
        {view === "history" && (
          <div style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}