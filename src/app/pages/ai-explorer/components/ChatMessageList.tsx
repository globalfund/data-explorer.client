import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Chat } from "app/pages/ai-explorer/types";
import { MessageList, MessageBubble } from "app/pages/ai-explorer/styles";
import { InlineReportCard } from "app/pages/ai-explorer/components/InlineReportCard";
import { useStoreState } from "app/state/store/hooks";

interface Props {
  chat: Chat;
  isAssistantLoading: boolean;
}

export const ChatMessageList: React.FC<Props> = ({
  chat,
  isAssistantLoading,
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={14} sx={{ color: "#002561" }} />
          <Typography variant="caption" color="text.secondary">
            Thinking…
          </Typography>
        </Box>
      )}

      <div ref={bottomRef} />
    </MessageList>
  );
};
