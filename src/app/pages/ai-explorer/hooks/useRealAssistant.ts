import { useRef } from "react";
import { MockAssistantReply } from "app/pages/ai-explorer/hooks/useMockAssistant";
export type { ProgressEvent } from "app/pages/ai-explorer/types";  // re-exporting type for convenience
import type { ProgressEvent } from "app/pages/ai-explorer/types";

export function useRealAssistant() {
  const abortRef = useRef<AbortController | null>(null);

  const respond = async (
    prompt: string,
    onProgress?: (progress: ProgressEvent) => void,
  ): Promise<MockAssistantReply> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const response = await fetch(
      `${import.meta.env.VITE_API}/flexible-ui-generation/query`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return { content: "Something has gone wrong for the assistant! We have been notified and will look into it as soon as possible. Feel free to check out the demo mode by typing '/demo' into the chat after toggling demo mode on in the top left of this window!" };
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let content = "";
    let currentEventName = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEventName = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            onProgress?.({ event: currentEventName, data: parsed });
            if (
              currentEventName === "text" &&
              typeof parsed.content === "string"
            ) {
              content += parsed.content;
            } else if (
              currentEventName === "rag_chunk" &&
              typeof parsed.chunk === "string"
            ) {
              content += parsed.chunk;
            } else if (
              currentEventName === "rag_done" &&
              typeof parsed.content === "string"
            ) {
              content = parsed.content;
            }
          } catch {
            if (raw) content += raw;
          }
        }
      }
    }

    return { content: content || "No response received." };
  };

  const abort = () => {
    abortRef.current?.abort();
  };

  return { respond, abort };
}
