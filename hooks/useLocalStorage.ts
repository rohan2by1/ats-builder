import { useCallback } from "react";

export function useLocalStorage() {
  const get = useCallback(<T>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return fallback;
    }
  }, []);

  const set = useCallback((key: string, value: unknown): boolean => {
    try {
      const serialized =
        typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      console.warn(`localStorage write failed for key: ${key}`);
      return false;
    }
  }, []);

  const remove = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }, []);

  return { get, set, remove };
}