import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { useFilteredChats } from "app/pages/ai-explorer/hooks/useFilteredChats";
import {
  SidebarRoot,
  ChatListItem,
  SIDEBAR_WIDTH_COLLAPSED,
} from "app/pages/ai-explorer/styles";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export const ChatSidebar: React.FC = () => {
  const collapsed = useStoreState((s) => s.AiExplorerChats.sidebarCollapsed);
  const chats = useStoreState((s) => s.AiExplorerChats.chats);
  const activeChatId = useStoreState((s) => s.AiExplorerChats.activeChatId);
  const searchQuery = useStoreState((s) => s.AiExplorerChats.searchQuery);

  const toggleSidebar = useStoreActions((a) => a.AiExplorerChats.toggleSidebar);
  const createChat = useStoreActions((a) => a.AiExplorerChats.createChat);
  const setActiveChat = useStoreActions((a) => a.AiExplorerChats.setActiveChat);
  const setSearchQuery = useStoreActions(
    (a) => a.AiExplorerChats.setSearchQuery,
  );

  const filtered = useFilteredChats(chats, searchQuery);

  return (
    <SidebarRoot collapsed={collapsed}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          p: collapsed ? "8px 0" : "8px 8px 8px 12px",
          borderBottom: "1px solid #e3e3e3",
          gap: 0.5,
          minHeight: 52,
        }}
      >
        {!collapsed && (
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ flexShrink: 0, color: "#002561" }}
          >
            Chats
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {collapsed && (
            <>
              <Tooltip title="Expand" placement="right">
                <IconButton
                  data-testid="sidebar-toggle"
                  size="small"
                  onClick={() => toggleSidebar()}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Chat" placement="right">
                <IconButton size="small" onClick={() => createChat()}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {!collapsed && (
            <Tooltip title="Collapse">
              <IconButton
                data-testid="sidebar-toggle"
                size="small"
                onClick={() => toggleSidebar()}
              >
                <MenuOpenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {!collapsed && (
        <>
          <Box sx={{ p: 1 }}>
            <Button
              data-testid="new-chat-button"
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              size="small"
              disableElevation
              onClick={() => createChat()}
              sx={{
                bgcolor: "#3154f4",
                "&:hover": { bgcolor: "#013B82" },
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              New Chat
            </Button>
          </Box>

          <Box
            sx={{
              mx: 1,
              mb: 1,
              display: "flex",
              alignItems: "center",
              bgcolor: "#ffffff",
              border: "1px solid #e3e3e3",
              borderRadius: 1.5,
              px: 1,
              gap: 0.5,
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: "#888888" }} />
            <InputBase
              fullWidth
              placeholder="Search chats…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ fontSize: 13, py: 0.5 }}
              inputProps={{
                "aria-label": "Search chats",
                "data-testid": "chat-search-input",
              }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 1, pb: 1 }}>
            {filtered.length === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 1, py: 2, display: "block", textAlign: "center" }}
              >
                {chats.length === 0 ? "No chats yet" : "No results"}
              </Typography>
            )}
            {filtered.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              return (
                <ChatListItem
                  key={chat.id}
                  active={chat.id === activeChatId}
                  onClick={() => setActiveChat(chat.id)}
                  sx={{ mb: 0.25 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={chat.id === activeChatId ? 600 : 400}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 13,
                    }}
                  >
                    {chat.title}
                  </Typography>
                  {lastMsg && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        mt: 0.25,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {lastMsg.content.slice(0, 40)}
                        {lastMsg.content.length > 40 ? "…" : ""}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ flexShrink: 0, fontSize: 10 }}
                      >
                        {formatTime(chat.updatedAt)}
                      </Typography>
                    </Box>
                  )}
                </ChatListItem>
              );
            })}
          </Box>
        </>
      )}

      {collapsed && (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 1,
            gap: 0.5,
          }}
        >
          {chats.map((chat) => (
            <Tooltip key={chat.id} title={chat.title} placement="right">
              <Box
                onClick={() => {
                  setActiveChat(chat.id);
                  toggleSidebar();
                }}
                sx={{
                  width: SIDEBAR_WIDTH_COLLAPSED - 16,
                  height: 32,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: chat.id === activeChatId ? "#ECF1FA" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { bgcolor: "#e0e8f5" },
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: "#002561" }}
                >
                  {chat.title.slice(0, 1).toUpperCase()}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      )}
    </SidebarRoot>
  );
};
