"use client";

import { useState } from "react";
import { Prompt } from "@/types";
import { PromptEditor } from "./PromptEditor";

interface Props {
  prompts: Prompt[];
  activeId: string;
  onSelect: (id: string) => void;
  onSaveCustom: (p: Prompt) => void;
  onDelete: (id: string) => void;
}

const ACTIVE_CLASS: Record<string, string> = {
  cyan:    "cv-preset-active",
  rose:    "cv-preset-active-rose",
  emerald: "cv-preset-active-emerald",
  purple:  "cv-preset-active-purple",
  amber:   "cv-preset-active-amber",
};

const DOT_COLOR: Record<string, string> = {
  cyan:    "#3E6AE1",
  rose:    "#DC2626",
  emerald: "#12A252",
  purple:  "#7C3AED",
  amber:   "#D97706",
};

export function PromptSelector({ prompts, activeId, onSelect, onSaveCustom, onDelete }: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Prompt | null>(null);

  const activePrompt = prompts.find((p) => p.id === activeId);

  const openEdit = (p: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTarget(p);
    setEditorOpen(true);
  };

  return (
    <>
      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        padding: 14,
        flexShrink: 0,
      }}>
        {/* Header row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 12,
        }}>
          <div className="cv-label">
            <span className="cv-label-dot" style={{ background: "var(--purple)" }} />
            Optimization Mode
          </div>
        </div>

        {/* Preset Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}>
          {prompts.map((p) => {
            const isActive = p.id === activeId;
            return (
              <div
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`cv-preset ${isActive ? (ACTIVE_CLASS[p.color] ?? "cv-preset-active") : ""}`}
              >
                {/* Actions */}
                <div className="cv-preset-actions">
                  <button
                    className="cv-preset-action-btn"
                    onClick={(e) => openEdit(p, e)}
                    title="Edit"
                  >✎</button>
                  {p.isCustom && (
                    <button
                      className="cv-preset-action-btn del"
                      onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                      title="Delete"
                    >✕</button>
                  )}
                </div>

                <div className="cv-preset-icon">{p.icon}</div>
                <div className="cv-preset-name">{p.label}</div>
                <div className="cv-preset-desc">{p.description}</div>

                {p.isCustom && <span className="cv-custom-badge">CUSTOM</span>}

                {/* Active indicator */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      width: 6,
                      height: 6,
                      borderRadius: 2,
                      background: DOT_COLOR[p.color] ?? "#3E6AE1",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Active mode bar */}
        {activePrompt && (
          <div className="cv-active-bar">
            <div className="cv-active-dot" style={{
              background: DOT_COLOR[activePrompt.color] ?? "#3E6AE1",
            }} />
            <span style={{ fontSize: "13px", marginRight: 4 }}>{activePrompt.icon}</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
              {activePrompt.label}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              — {activePrompt.description}
            </span>
          </div>
        )}
      </div>

      {editorOpen && (
        <PromptEditor
          initial={editTarget}
          onSave={(p) => { onSaveCustom(p); setEditorOpen(false); }}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </>
  );
}