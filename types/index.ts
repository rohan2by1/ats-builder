export interface HistoryItem {
  id: string;
  timestamp: string;
  label: string;
  result: string;
  promptId: string;
  promptLabel: string;
}

export type ViewType = "current" | "history";

export interface OptimizeRequest {
  cvText: string;
  jobDescription: string;
  systemPrompt: string;
}

export interface OptimizeResponse {
  result?: string;
  error?: string;
}

export interface Prompt {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  isCustom?: boolean;
  isEditable?: boolean;
}

export interface DialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}