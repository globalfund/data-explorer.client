import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Chat } from "app/pages/ai-explorer/types";
import { MessageList, MessageBubble } from "app/pages/ai-explorer/styles";

interface Props {
  chat: Chat;
  isAssistantLoading: boolean;
}

export const ChatMessageList: React.FC<Props> = ({
  chat,
  isAssistantLoading,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length, isAssistantLoading]);

  return (
    <MessageList>
      {chat.messages.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}
        >
          <MessageBubble
            role={msg.role}
            data-testid={
              msg.role === "assistant" ? "chat-message-assistant" : undefined
            }
          >
            {msg.content}
          </MessageBubble>
        </Box>
      ))}

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
