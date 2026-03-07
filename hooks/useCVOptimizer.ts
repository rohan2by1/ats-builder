import { useState, useCallback } from "react";

interface UseOptimizerOptions {
  onSuccess: (result: string) => void;
  onError: (msg: string) => void;
}

export function useCVOptimizer({ onSuccess, onError }: UseOptimizerOptions) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const optimize = useCallback(
    async (cvText: string, jobDescription: string, systemPrompt: string) => {
      if (!cvText.trim() || !jobDescription.trim()) {
        onError("Please fill in both CV and Job Description fields.");
        return;
      }

      setLoading(true);
      setResult("");

      try {
        const response = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText, jobDescription, systemPrompt }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error ?? `Server error (${response.status})`);
        }

        // Handle streaming
        if (response.headers.get("content-type")?.includes("text/plain")) {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            accumulated += chunk;
            setResult(accumulated);
          }

          onSuccess(accumulated);
        } else {
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          setResult(data.result ?? "");
          onSuccess(data.result ?? "");
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        onError(msg);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const clearResult = useCallback(() => setResult(""), []);

  return { loading, result, optimize, clearResult, setResult };
}