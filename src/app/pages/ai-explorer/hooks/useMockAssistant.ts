import { useRef } from "react";

const MOCK_RESPONSES = [
  "I can help you explore the Global Fund datasets. What would you like to know?",
  "Based on the available data, I can analyze trends across allocations, disbursements, results, and eligibility data. Could you be more specific about what you'd like to explore?",
  "The Global Fund Data Explorer provides access to financial and results data for grants fighting AIDS, tuberculosis, and malaria. Which dataset interests you most?",
  "I see you're asking about the data. Let me analyze the relevant information and provide a detailed response.",
  "That's an interesting question about the Global Fund data. The datasets cover multiple dimensions including country-level financials, disease results, and procurement data.",
];

let responseIndex = 0;

export function useMockAssistant() {
  const abortRef = useRef<AbortController | null>(null);

  const respond = (prompt: string): Promise<string> => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    return new Promise((resolve, reject) => {
      const delay = 200 + Math.random() * 100;  // Simulate variable response time between 200-300ms
      const timeoutId = setTimeout(() => {
        if (controller.signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        const response =
          MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length] +
          (prompt.length > 0
            ? `\n\nYou asked: "${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`
            : "");
        responseIndex += 1;
        resolve(response);
      }, delay);

      controller.signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
  };

  const abort = () => {
    abortRef.current?.abort();
  };

  return { respond, abort };
}
