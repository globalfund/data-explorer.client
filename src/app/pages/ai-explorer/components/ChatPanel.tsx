import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { ChatSidebar } from "app/pages/ai-explorer/components/ChatSidebar";
import { ChatMainPanel } from "app/pages/ai-explorer/components/ChatMainPanel";
import { SlidePanelOverlay } from "app/pages/ai-explorer/styles";

export const ChatPanel: React.FC = () => {
  const isPanelOpen = useStoreState((s) => s.AiExplorerChats.isPanelOpen);
  const closePanel = useStoreActions((a) => a.AiExplorerChats.closePanel);

  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPanelOpen, closePanel]);

  return (
    <SlidePanelOverlay
      role="dialog"
      aria-modal="false"
      data-testid="chat-panel"
      sx={{ position: "relative" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        <Tooltip title="Close chat">
          <IconButton size="small" onClick={() => closePanel()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <ChatSidebar />
      <ChatMainPanel />
    </SlidePanelOverlay>
  );
};
