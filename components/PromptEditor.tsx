"use client";

import { useState } from "react";
import { Prompt } from "@/types";

const ICONS    = ["✨","🎯","🪶","🔄","👑","🚀","⚡","🧠","💡","🔥","🎨","🛠️","🌟","🦾","📐"];
const COLORS   = [
  { id: "cyan",    hex: "#3E6AE1", label: "Blue"    },
  { id: "rose",    hex: "#DC2626", label: "Red"     },
  { id: "emerald", hex: "#12A252", label: "Green"   },
  { id: "purple",  hex: "#7C3AED", label: "Purple"  },
  { id: "amber",   hex: "#D97706", label: "Amber"   },
];
const VARS = ["JOB_TITLE","COMPANY","SENIORITY","TONE","INDUSTRY"];

interface Props {
  initial: Prompt | null;
  onSave: (p: Prompt) => void;
  onClose: () => void;
}

export function PromptEditor({ initial, onSave, onClose }: Props) {
  const isNew    = !initial;
  const [label,  setLabel]  = useState(initial?.label          ?? "");
  const [desc,   setDesc]   = useState(initial?.description    ?? "");
  const [icon,   setIcon]   = useState(initial?.icon           ?? "✨");
  const [color,  setColor]  = useState(initial?.color          ?? "cyan");
  const [prompt, setPrompt] = useState(initial?.systemPrompt   ?? "");
  const [error,  setError]  = useState("");

  const handleSave = () => {
    if (!label.trim())  { setError("Please add a name."); return; }
    if (!prompt.trim()) { setError("System prompt cannot be empty."); return; }
    setError("");
    onSave({
      id:           initial ? initial.id : `custom_${Date.now()}`,
      label:        label.trim(),
      description:  desc.trim() || "Custom prompt",
      icon, color,
      systemPrompt: prompt.trim(),
      isCustom:     true,
      isEditable:   true,
    });
  };

  const selectedColor = COLORS.find((c) => c.id === color);

  return (
    <div className="cv-modal-bg" onClick={onClose}>
      <div
        className="cv-modal cv-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cv-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
                background: `${selectedColor?.hex}12`,
                border: `1px solid ${selectedColor?.hex}25`,
              }}
            >
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                {isNew ? "Create Custom Mode" : `Edit — ${initial?.label}`}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {isNew ? "Build a reusable optimization persona" : "Edits are saved locally"}
              </div>
            </div>
          </div>
          <button className="cv-btn cv-btn-icon" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cv-modal-body cv-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Name + Desc */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div className="cv-field-label">Name *</div>
              <input
                className="cv-input"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Startup Mode"
                maxLength={30}
              />
            </div>
            <div>
              <div className="cv-field-label">Description</div>
              <input
                className="cv-input"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Short summary of what this does"
                maxLength={70}
              />
            </div>
          </div>

          {/* Icon + Color */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div className="cv-field-label">Icon</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ICONS.map((i) => (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    style={{
                      width: 32, height: 32,
                      borderRadius: 4,
                      fontSize: 16,
                      border: icon === i ? "2px solid var(--accent)" : "1px solid var(--border-default)",
                      background: icon === i ? "var(--accent-dim)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      transform: icon === i ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="cv-field-label">Color</div>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    title={c.label}
                    className="cv-color-swatch"
                    style={{
                      background: c.hex,
                      ...(color === c.id
                        ? { borderColor: "var(--dark)", transform: "scale(1.25)", boxShadow: `0 0 8px ${c.hex}60` }
                        : { opacity: 0.5 }),
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <div className="cv-field-label">
              <span>System Prompt *</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: prompt.length > 3500 ? "var(--rose)" : "var(--text-faint)",
              }}>
                {prompt.length.toLocaleString()} / 4000
              </span>
            </div>

            {/* Variables */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>Insert:</span>
              {VARS.map((v) => (
                <button
                  key={v}
                  onClick={() => setPrompt((p) => p + `{{${v}}}`)}
                  className="cv-var-tag"
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={12}
              maxLength={4000}
              placeholder={`You are a CV optimization expert...\n\n## OUTPUT RULES\n1. Raw LaTeX only.\n2. Start with \\documentclass\n3. End with \\end{document}`}
              className="cv-textarea cv-scrollbar"
              style={{ resize: "vertical", minHeight: 220 }}
            />
          </div>

          {/* Preview */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 6,
              border: `1px solid ${selectedColor?.hex}20`,
              background: `${selectedColor?.hex}08`,
            }}
          >
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              Preview
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  {label || "Untitled"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {desc || "No description"}
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 14px",
              borderRadius: 4,
              background: "var(--rose-dim)",
              border: "1px solid rgba(220,38,38,0.15)",
              fontSize: 12,
              color: "var(--rose)",
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cv-modal-footer">
          <button className="cv-btn cv-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="cv-btn" onClick={handleSave} style={{
            background: "var(--accent)",
            color: "#fff",
            borderColor: "var(--accent)",
            padding: "9px 20px",
            fontWeight: 600,
          }}>
            {isNew ? "Create Mode" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}