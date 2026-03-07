"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  mounted: boolean;
}

export function CVInput({ value, onChange }: Props) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: 14,
      boxSizing: "border-box",
    }}>
      {/* Label row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        flexShrink: 0,
      }}>
        <div className="cv-label">
          <span className="cv-label-dot" style={{ background: "var(--accent)" }} />
          LaTeX CV
        </div>
        <span style={{
          fontSize: 11,
          color: "var(--text-faint)",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {value.length.toLocaleString()} chars
        </span>
      </div>

      {/* Textarea fills remaining height */}
      <textarea
        className="cv-textarea cv-scrollbar"
        style={{ flex: 1, minHeight: 0 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your LaTeX CV here…"
      />
    </div>
  );
}