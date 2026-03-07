"use client";

import {
  useState, useEffect,
  useCallback, useMemo,
} from "react";
import { useDebouncedCallback } from "use-debounce";

import { Header }              from "@/components/Header";
import { CVInput }             from "@/components/CVInput";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { ResultPanel }         from "@/components/ResultPanel";
import { HistoryPanel }        from "@/components/HistoryPanel";
import { PromptSelector }      from "@/components/PromptSelector";
import { Dialog }              from "@/components/Dialog";

import { useLocalStorage }     from "@/hooks/useLocalStorage";
import { useHistory }          from "@/hooks/useHistory";
import { usePrompts }          from "@/hooks/usePrompts";
import { useCVOptimizer }      from "@/hooks/useCVOptimizer";
import { useTheme }            from "@/hooks/useTheme";

import { HistoryItem, ViewType, DialogOptions } from "@/types";

const KEY_CV     = "rohan_cv_draft";
const KEY_JD     = "rohan_jd";
const KEY_RESULT = "rohan_result";
const KEY_MASTER = "rohan_master_cv";

export default function Home() {
  const storage = useLocalStorage();
  const { theme, toggleTheme } = useTheme();

  const [cvText,         setCvText]         = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [view,           setView]           = useState<ViewType>("current");
  const [statusMsg,      setStatusMsg]      = useState("");
  const [isLoaded,       setIsLoaded]       = useState(false);
  const [mounted,        setMounted]        = useState(false);
  const [dialog, setDialog] = useState<
    (DialogOptions & { onConfirm: () => void }) | null
  >(null);

  const { history, addToHistory, deleteItem, clearAll } = useHistory();
  const {
    allPrompts, activePrompt, activePromptId,
    setActiveId, saveCustomPrompt, deleteCustomPrompt,
  } = usePrompts();

  const showStatus = useCallback((msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  }, []);

  const { loading, result, optimize, setResult } = useCVOptimizer({
    onSuccess: useCallback(
      (res: string) => {
        storage.set(KEY_RESULT, res);
        addToHistory(res, jobDescription, activePrompt.id, activePrompt.label);
        showStatus("✓ Optimization complete");
      },
      [storage, addToHistory, jobDescription, activePrompt, showStatus],
    ),
    onError: useCallback(
      (msg: string) => showStatus(`✕ ${msg}`),
      [showStatus],
    ),
  });

  useEffect(() => {
    setMounted(true);
    const draft  = storage.get<string>(KEY_CV,     "");
    const master = storage.get<string>(KEY_MASTER, "");
    const jd     = storage.get<string>(KEY_JD,     "");
    const saved  = storage.get<string>(KEY_RESULT, "");
    setCvText(draft || master);
    setJobDescription(jd);
    if (saved) setResult(saved);
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDraft = useDebouncedCallback(() => {
    storage.set(KEY_CV, cvText);
    storage.set(KEY_JD, jobDescription);
  }, 800);

  useEffect(() => {
    if (isLoaded) saveDraft();
  }, [cvText, jobDescription, isLoaded, saveDraft]);

  const saveAsMaster = useCallback(() => {
    storage.set(KEY_MASTER, cvText);
    showStatus("✓ Saved as default CV");
  }, [cvText, storage, showStatus]);

  const resetToMaster = useCallback(() => {
    const master = storage.get<string>(KEY_MASTER, "");
    if (!master) { showStatus("No default CV saved yet"); return; }
    setDialog({
      title: "Reset CV?",
      message: "Discard edits and reload your saved default CV?",
      confirmLabel: "Reset",
      cancelLabel: "Keep Editing",
      danger: true,
      onConfirm: () => {
        setCvText(master);
        setDialog(null);
        showStatus("↺ Reset to default");
      },
    });
  }, [storage, showStatus]);

  const handleSubmit = useCallback(async () => {
    setView("current");
    await optimize(cvText, jobDescription, activePrompt.systemPrompt);
  }, [optimize, cvText, jobDescription, activePrompt]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !loading)
        handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit, loading]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result);
    showStatus("Copied to clipboard");
  }, [result, showStatus]);

  const handleExport = useCallback(() => {
    const blob = new Blob([result], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `cv_optimized_${Date.now()}.tex`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus("Exported as .tex");
  }, [result, showStatus]);

  const loadHistoryItem = useCallback(
    (item: HistoryItem) => {
      setResult(item.result);
      setView("current");
      showStatus(`Loaded: ${item.label}`);
    },
    [setResult, showStatus],
  );

  const handleDeleteHistory = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      deleteItem(id);
    },
    [deleteItem],
  );

  const handleClearAll = useCallback(() => {
    setDialog({
      title: "Clear All History?",
      message: "Permanently delete all saved optimizations?",
      confirmLabel: "Clear All",
      cancelLabel: "Cancel",
      danger: true,
      onConfirm: () => {
        clearAll();
        setDialog(null);
        showStatus("History cleared");
      },
    });
  }, [clearAll, showStatus]);

  const stats = useMemo(() => ({
    cvLength: cvText.length,
    jdLength: jobDescription.length,
  }), [cvText, jobDescription]);

  if (!isLoaded) return null;

  return (
    <>
      {/* ── Background ──────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "var(--bg-surface)",
      }} />

      {/* ── App Shell ───────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <Header
          cvLength={stats.cvLength}
          jdLength={stats.jdLength}
          historyCount={history.length}
          onSaveMaster={saveAsMaster}
          onResetMaster={resetToMaster}
          mounted={mounted}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* ── Two-column layout ──────────────────────────────── */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: 20,
          padding: 20,
          overflow: "hidden",
          maxWidth: 1600,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}>

          {/* ── LEFT column ─────────────────────────────────── */}
          <div style={{
            width: "40%",
            minWidth: 320,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minHeight: 0,
            overflow: "hidden",
          }}>
            {/* Prompt Selector */}
            <div style={{ flexShrink: 0 }}>
              <PromptSelector
                prompts={allPrompts}
                activeId={activePromptId}
                onSelect={setActiveId}
                onSaveCustom={saveCustomPrompt}
                onDelete={deleteCustomPrompt}
              />
            </div>

            {/* CV Input — flex 2 */}
            <div style={{
              flex: 2, minHeight: 0,
              display: "flex", flexDirection: "column",
            }}>
              <CVInput
                value={cvText}
                onChange={setCvText}
                mounted={mounted}
              />
            </div>

            {/* JD Input — flex 2 */}
            <div style={{
              flex: 2, minHeight: 0,
              display: "flex", flexDirection: "column",
            }}>
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                mounted={mounted}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cv-btn-primary"
              style={{ flexShrink: 0 }}
              title="Ctrl + Enter"
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span className="cv-spinner" />
                  Optimizing…
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 17 }}>{activePrompt.icon}</span>
                  Optimize with {activePrompt.label}
                  <span style={{
                    marginLeft: 6,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>⌘↵</span>
                </span>
              )}
            </button>
          </div>

          {/* ── RIGHT column ────────────────────────────────── */}
          <div style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}>
            <ResultPanel
              result={result}
              loading={loading}
              view={view}
              onViewChange={setView}
              onCopy={handleCopy}
              onExport={handleExport}
              historyCount={history.length}
              mounted={mounted}
            >
              <HistoryPanel
                history={history}
                onLoad={loadHistoryItem}
                onDelete={handleDeleteHistory}
                onClearAll={handleClearAll}
              />
            </ResultPanel>
          </div>
        </div>
      </div>

      {/* ── Toast ───────────────────────────────────────────── */}
      {statusMsg && (
        <div style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999,
          animation: "toast-in 0.3s ease-out forwards",
        }}>
          <div className="cv-toast">{statusMsg}</div>
        </div>
      )}

      {/* ── Dialog ──────────────────────────────────────────── */}
      {dialog && (
        <Dialog
          {...dialog}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  );
}