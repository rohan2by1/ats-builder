"use client";

interface Props {
  cvLength: number;
  jdLength: number;
  historyCount: number;
  onSaveMaster: () => void;
  onResetMaster: () => void;
  mounted: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({
  cvLength, jdLength, historyCount,
  onSaveMaster, onResetMaster, mounted,
  theme, onToggleTheme,
}: Props) {
  return (
    <header className={`cv-header ${mounted ? "cv-anim-in" : "opacity-0"}`}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src="/logo.png" alt="CV Optimizer" width={36} height={36} style={{ borderRadius: 4 }} />
        <div>
          <div className="cv-logo-title">CV Optimizer</div>
          <div className="cv-logo-sub">AI-Powered Resume Enhancement</div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

        {/* Theme Toggle */}
        <button
          className="cv-theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <div className="cv-theme-toggle-icons">
            <svg
              className={`cv-theme-icon ${theme === "light" ? "cv-theme-icon--active" : ""}`}
              width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg
              className={`cv-theme-icon ${theme === "dark" ? "cv-theme-icon--active" : ""}`}
              width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
          <div className="cv-theme-toggle-knob" />
        </button>

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="cv-stat">
            <span className="cv-stat-value" style={{ color: "var(--accent)" }}>
              {cvLength > 0 ? `${(cvLength / 1000).toFixed(1)}k` : "0"}
            </span>
            <span className="cv-stat-label">cv</span>
          </div>

          <div className="cv-stat">
            <span className="cv-stat-value" style={{ color: "var(--green)" }}>
              {jdLength > 0 ? `${(jdLength / 1000).toFixed(1)}k` : "0"}
            </span>
            <span className="cv-stat-label">jd</span>
          </div>

          <div className="cv-stat">
            <span className="cv-stat-value" style={{ color: "var(--amber)" }}>
              {historyCount}
            </span>
            <span className="cv-stat-label">saved</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "var(--border-default)" }} />

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onSaveMaster}
            className="cv-btn cv-btn-subtle"
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Default
          </button>

          <button
            onClick={onResetMaster}
            className="cv-btn cv-btn-ghost"
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.49" />
            </svg>
            Reset
          </button>
        </div>

      </div>
    </header>
  );
}