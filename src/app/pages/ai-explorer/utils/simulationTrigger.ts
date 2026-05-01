import { ReportPlacement } from "app/pages/ai-explorer/types";

/**
 * Typing either of these exact strings triggers the simulated report response.
 * /demo        → inline placement (collapsible card in the chat bubble)
 * /demo main   → main_view placement (replaces the main canvas area)
 *
 * @param text - the input text to check for simulation trigger commands
 * @returns an object with the placement type if a trigger is detected, or null otherwise
 */
export function detectSimulationTrigger(
  text: string,
): { placement: ReportPlacement } | null {
  const t = text.trim().toLowerCase();
  if (t === "/demo main") return { placement: "main_view" };
  if (t === "/demo") return { placement: "inline" };
  return null;
}
