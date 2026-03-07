import { useState, useCallback } from "react";
import { HistoryItem } from "@/types";
import { useLocalStorage } from "./useLocalStorage";

const HISTORY_KEY = "rohan_history_list";
const MAX_HISTORY = 10;

export function useHistory() {
  const storage = useLocalStorage();

  const [history, setHistory] = useState<HistoryItem[]>(() =>
    storage.get<HistoryItem[]>(HISTORY_KEY, [])
  );

  const addToHistory = useCallback(
    (result: string, jobDescription: string, promptId: string, promptLabel: string) => {
      const label = jobDescription.split("\n")[0].substring(0, 45).trim() || "Optimization";
      const timeString = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: timeString,
        label: label + (label.length >= 45 ? "..." : ""),
        result,
        promptId,
        promptLabel,
      };

      const updated = [newItem, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      storage.set(HISTORY_KEY, updated);
    },
    [history, storage]
  );

  const deleteItem = useCallback(
    (id: string) => {
      const updated = history.filter((h) => h.id !== id);
      setHistory(updated);
      storage.set(HISTORY_KEY, updated);
    },
    [history, storage]
  );

  const clearAll = useCallback(() => {
    setHistory([]);
    storage.remove(HISTORY_KEY);
  }, [storage]);

  return { history, addToHistory, deleteItem, clearAll };
}