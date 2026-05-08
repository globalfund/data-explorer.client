import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Chat, ProgressEvent } from "app/pages/ai-explorer/types";
import { MessageList, MessageBubble } from "app/pages/ai-explorer/styles";
import { InlineReportCard } from "app/pages/ai-explorer/components/InlineReportCard";
import { useStoreState } from "app/state/store/hooks";

interface Props {
  chat: Chat;
  isAssistantLoading: boolean;
  progressLog?: ProgressEvent[];
  streamingContent?: string;
}

function stepLabel(p: ProgressEvent): string {
  if (typeof p.data.reasoning === "string") return p.data.reasoning;
  const step = typeof p.data.step === "string" ? ` (${p.data.step})` : "";
  return `${p.event}${step}`;
}

function ProgressLogBubble({ log }: { log: ProgressEvent[] }) {
  const [expanded, setExpanded] = React.useState(false);

  const last = log.at(-1);
  if (!last) return null;

  const label = stepLabel(last);
  const truncated =
    label.length > 40 ? `${label.slice(0, 40)}...` : label;

  if (!expanded) {
    return (
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontSize: "0.65rem", cursor: "pointer" }}
        onClick={() => setExpanded(true)}
      >
        {truncated}. Click to view full reasoning.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.25,
        cursor: "pointer",
      }}
      onClick={() => setExpanded(false)}
    >
      {log.map((p, i) => (
        <Typography
          key={`${p.event}-${i}`}
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.65rem" }}
        >
          ✓ {stepLabel(p)}
        </Typography>
      ))}
    </Box>
  );
}

export const ChatMessageList: React.FC<Props> = ({
  chat,
  isAssistantLoading,
  progressLog = [],
  streamingContent = "",
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const activeChatId = useStoreState((s) => s.AiExplorerChats.activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length, isAssistantLoading]);

  return (
    <MessageList>
      {chat.messages.map((msg) => {
        const hasInlineReport =
          msg.role === "assistant" &&
          !!msg.report &&
          (msg.reportPlacement ?? "inline") === "inline";

        return (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 1,
            }}
          >
            {msg.role === "assistant" && msg.progressLog && (
              <ProgressLogBubble log={msg.progressLog} />
            )}

            {msg.content && (
              <MessageBubble
                role={msg.role}
                data-testid={
                  msg.role === "assistant"
                    ? "chat-message-assistant"
                    : undefined
                }
              >
                {msg.content}
              </MessageBubble>
            )}

            {hasInlineReport && activeChatId && (
              <InlineReportCard report={msg.report!} chatId={activeChatId} />
            )}
          </Box>
        );
      })}

      {isAssistantLoading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {progressLog.length > 1 && (
            <Box
              sx={{
                pl: "22px",
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
              }}
            >
              {progressLog.slice(0, -1).map((p, i) => (
                <Typography
                  key={`${p.event}-${i}`}
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: "0.65rem" }}
                >
                  ✓ {stepLabel(p)}
                </Typography>
              ))}
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={14} sx={{ color: "#002561" }} />
            {!streamingContent && (
              <Typography variant="caption" color="text.secondary">
                {progressLog.length > 0
                  ? stepLabel(progressLog.at(-1)!)
                  : "Thinking…"}
              </Typography>
            )}
          </Box>
          {streamingContent && (
            <MessageBubble role="assistant" sx={{ whiteSpace: "pre-wrap" }}>
              {streamingContent}
            </MessageBubble>
          )}
        </Box>
      )}

      <div ref={bottomRef} />
    </MessageList>
  );
};
