import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import { useTitle } from "react-use";
import { BasicAuthGuard } from "app/components/basic-auth-guard";
import { IntroSection } from "app/pages/ai-explorer/components/IntroSection";
import { FeatureSection } from "app/pages/ai-explorer/components/FeatureSection";
import { ChatPanel } from "app/pages/ai-explorer/components/ChatPanel";
import { PageRoot, CHAT_PANEL_WIDTH } from "app/pages/ai-explorer/styles";
import { useStoreState, useStoreActions } from "app/state/store/hooks";

const AiExplorerContent: React.FC = () => {
  useTitle("The Data Explorer - AI Explorer");

  const isPanelOpen = useStoreState((s) => s.AiExplorerChats.isPanelOpen);
  const togglePanel = useStoreActions((a) => a.AiExplorerChats.togglePanel);
  const createChat = useStoreActions((a) => a.AiExplorerChats.createChat);
  const chats = useStoreState((s) => s.AiExplorerChats.chats);
  const activeChatId = useStoreState((s) => s.AiExplorerChats.activeChatId);

  const handleOpenChat = () => {
    if (chats.length === 0 || activeChatId === null) {
      createChat();
    }
    togglePanel();
  };

  return (
    <PageRoot sx={{ display: "flex", flexDirection: "row", gap: 0, p: 0 }}>
      <Box
        sx={{
          width: isPanelOpen ? CHAT_PANEL_WIDTH : 0,
          minWidth: isPanelOpen ? CHAT_PANEL_WIDTH : 0,
          overflow: "hidden",
          height: "calc(100vh - 78px)",
          position: "fixed",
          top: 78,
          left: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          <ChatPanel />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          width: isPanelOpen ? "calc(100vw - 50vw)" : "100%",
          p: "40px 48px",
          minWidth: 0,
          ml: isPanelOpen ? CHAT_PANEL_WIDTH : 0,
          maxWidth: isPanelOpen ? "none" : "100%",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#002561"
            gutterBottom
          >
            AI Explorer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Machine learning and AI capabilities built on Global Fund datasets.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <IntroSection />
          <FeatureSection />
        </Box>

        <Tooltip
          title={isPanelOpen ? "Close chat" : "Open chat"}
          placement="left"
        >
          <Fab
            data-testid="open-chat-fab"
            aria-label={isPanelOpen ? "Close chat" : "Open chat"}
            onClick={handleOpenChat}
            sx={{
              position: "fixed",
              bottom: 32,
              left: 32,
              bgcolor: "#002561",
              color: "#ffffff",
              "&:hover": { bgcolor: "#013B82" },
              zIndex: 100,
            }}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      </Box>
    </PageRoot>
  );
};

export const AiExplorerPage: React.FC = () => (
  <BasicAuthGuard>
    <AiExplorerContent />
  </BasicAuthGuard>
);
