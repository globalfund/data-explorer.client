import { useRef } from "react";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";
import { ReportPlacement } from "app/pages/ai-explorer/types";
import { detectSimulationTrigger } from "app/pages/ai-explorer/utils/simulationTrigger";
import { buildSimulatedAssistantMessage } from "app/pages/ai-explorer/fixtures/simulatedReport";

const MOCK_RESPONSES = [
  "I can help you explore the Global Fund datasets. What would you like to know?",
  "Based on the available data, I can analyze trends across allocations, disbursements, results, and eligibility data. Could you be more specific about what you'd like to explore?",
  "The Global Fund Data Explorer provides access to financial and results data for grants fighting AIDS, tuberculosis, and malaria. Which dataset interests you most?",
  "I see you're asking about the data. Let me analyze the relevant information and provide a detailed response.",
  "That's an interesting question about the Global Fund data. The datasets cover multiple dimensions including country-level financials, disease results, and procurement data.",
];

let responseIndex = 0;

export interface MockAssistantReply {
  content: string;
  report?: RBReportModel;
  reportPlacement?: ReportPlacement;
}

export function useMockAssistant() {
  const abortRef = useRef<AbortController | null>(null);

  const respond = (prompt: string): Promise<MockAssistantReply> => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    return new Promise((resolve, reject) => {
      const simulation = detectSimulationTrigger(prompt);

      // Simulated report: longer delay so the typing indicator is visible.
      const delay = simulation
        ? 1200 + Math.random() * 600
        : 200 + Math.random() * 100;

      const timeoutId = setTimeout(() => {
        if (controller.signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        if (simulation) {
          const msg = buildSimulatedAssistantMessage(simulation.placement);
          resolve({
            content: msg.content,
            report: msg.report,
            reportPlacement: msg.reportPlacement,
          });
          return;
        }

        const content =
          MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length] +
          (prompt.length > 0
            ? `\n\nYou asked: "${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`
            : "");
        responseIndex += 1;
        resolve({ content });
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
