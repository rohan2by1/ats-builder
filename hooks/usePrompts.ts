import { useState, useCallback, useMemo } from "react";
import { Prompt } from "@/types";
import { BUILT_IN_PROMPTS, DEFAULT_PROMPT_ID } from "@/lib/prompts";
import { useLocalStorage } from "./useLocalStorage";

const CUSTOM_KEY = "rohan_custom_prompts";
const ACTIVE_KEY = "rohan_active_prompt_id";

export function usePrompts() {
  const storage = useLocalStorage();

  const [customPrompts, setCustomPrompts] = useState<Prompt[]>(() =>
    storage.get<Prompt[]>(CUSTOM_KEY, [])
  );

  const [activePromptId, setActivePromptIdState] = useState<string>(
    () => storage.get<string>(ACTIVE_KEY, DEFAULT_PROMPT_ID)
  );

  const allPrompts = useMemo(
    () => {
      const customIds = new Set(customPrompts.map((p) => p.id));
      return [
        ...BUILT_IN_PROMPTS.filter((p) => !customIds.has(p.id)),
        ...customPrompts,
      ];
    },
    [customPrompts]
  );

  const activePrompt = useMemo(
    () => allPrompts.find((p) => p.id === activePromptId) ?? BUILT_IN_PROMPTS[0],
    [allPrompts, activePromptId]
  );

  const setActiveId = useCallback(
    (id: string) => {
      setActivePromptIdState(id);
      storage.set(ACTIVE_KEY, id);
    },
    [storage]
  );

  const saveCustomPrompt = useCallback(
    (prompt: Prompt) => {
      const updated = [
        ...customPrompts.filter((p) => p.id !== prompt.id),
        { ...prompt, isCustom: true },
      ];
      setCustomPrompts(updated);
      storage.set(CUSTOM_KEY, updated);
    },
    [customPrompts, storage]
  );

  const deleteCustomPrompt = useCallback(
    (id: string) => {
      const updated = customPrompts.filter((p) => p.id !== id);
      setCustomPrompts(updated);
      storage.set(CUSTOM_KEY, updated);
      if (activePromptId === id) setActiveId(DEFAULT_PROMPT_ID);
    },
    [customPrompts, activePromptId, setActiveId, storage]
  );

  return {
    allPrompts,
    activePrompt,
    activePromptId,
    setActiveId,
    saveCustomPrompt,
    deleteCustomPrompt,
  };
}