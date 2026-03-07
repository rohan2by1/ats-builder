"use client";

import { HistoryItem } from "@/types";

interface Props {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onClearAll: () => void;
}

const TAG_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  standard:       { color: "#3E6AE1", bg: "rgba(62,106,225,0.06)",  border: "rgba(62,106,225,0.15)"  },
  aggressive:     { color: "#DC2626", bg: "rgba(220,38,38,0.05)",   border: "rgba(220,38,38,0.15)"   },
  conservative:   { color: "#12A252", bg: "rgba(18,162,82,0.05)",   border: "rgba(18,162,82,0.15)"   },
  "career-switch":{ color: "#7C3AED", bg: "rgba(124,58,237,0.05)",  border: "rgba(124,58,237,0.15)"  },
  senior:         { color: "#D97706", bg: "rgba(217,119,6,0.05)",   border: "rgba(217,119,6,0.15)"   },
};

export function HistoryPanel({ history, onLoad, onDelete, onClearAll }: Props) {
  if (history.length === 0) {
    return (
      <div className="cv-empty" style={{ padding: "40px 20px" }}>
        <div className="cv-empty-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div className="cv-empty-title">No history yet</div>
        <div className="cv-empty-sub">Your optimizations will appear here</div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
          {history.length} optimization{history.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={onClearAll}
          className="cv-btn cv-btn-danger"
          style={{ padding: "4px 10px", fontSize: 11 }}
        >
          Clear All
        </button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: "auto", padding: 12 }} className="cv-scrollbar">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {history.map((item) => {
            const tag = TAG_STYLE[item.promptId] ?? TAG_STYLE.standard;
            return (
              <div key={item.id} onClick={() => onLoad(item)} className="cv-history-item">
                <div className="cv-history-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="cv-history-name">{item.label}</div>
                  <div className="cv-history-meta">
                    <span>{item.timestamp}</span>
                    {item.promptLabel && (
                      <span
                        className="cv-history-tag"
                        style={{ color: tag.color, background: tag.bg, borderColor: tag.border }}
                      >
                        {item.promptLabel}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="cv-history-delete"
                  onClick={(e) => onDelete(e, item.id)}
                  title="Delete"
                >✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}