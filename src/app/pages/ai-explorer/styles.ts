import Box from "@mui/material/Box";
import styled from "styled-components";

export const SIDEBAR_WIDTH_EXPANDED = 220;
export const SIDEBAR_WIDTH_COLLAPSED = 56;
export const CHAT_PANEL_WIDTH = "50vw";
export const CHAT_TRANSITION = "all 0.25s ease";

export const PageRoot = styled(Box)`
  width: 100%;
  min-height: calc(100vh - 58px);
  box-sizing: border-box;
  display: flex;
  position: relative;
  max-width: 100%;
`;

export const SlidePanelOverlay = styled(Box)`
  width: ${CHAT_PANEL_WIDTH};
  min-width: ${CHAT_PANEL_WIDTH};
  height: 100%;
  display: flex;
  background: #ffffff;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 24px;
    width: 1px;
    background: #e3e3e3;
  }
`;

export const PanelBackdrop = styled(Box)<{ open: boolean }>`
  display: none;
`;

export const SidebarRoot = styled(Box)<{ collapsed: boolean }>`
  width: ${({ collapsed }) =>
    collapsed ? `${SIDEBAR_WIDTH_COLLAPSED}px` : `${SIDEBAR_WIDTH_EXPANDED}px`};
  min-width: ${({ collapsed }) =>
    collapsed ? `${SIDEBAR_WIDTH_COLLAPSED}px` : `${SIDEBAR_WIDTH_EXPANDED}px`};
  border-right: 1px solid #e3e3e3;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: ${CHAT_TRANSITION};
  background: #f8f8f8;
`;

export const ChatAreaRoot = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
`;

export const MessageList = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MessageBubble = styled(Box)<{ role: "user" | "assistant" }>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: ${({ role }) =>
    role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px"};
  background: ${({ role }) => (role === "user" ? "#002561" : "#ECF1FA")};
  color: ${({ role }) => (role === "user" ? "#ffffff" : "#000000")};
  align-self: ${({ role }) => (role === "user" ? "flex-end" : "flex-start")};
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
`;

export const ComposerRoot = styled(Box)`
  border-top: 1px solid #e3e3e3;
  padding: 16px;
  background: #ffffff;
`;

export const EmptyStateRoot = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  gap: 24px;
`;

export const HintChipsRow = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

export const ChatListItem = styled(Box)<{ active: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  background: ${({ active }) => (active ? "#ECF1FA" : "transparent")};
  border-left: {
    ${({ active }) => (active ? "3px solid #002561" : "3px solid transparent")}
  }
  &:hover {
    background: ${({ active }) => (active ? "#ECF1FA" : "#f0f0f0")};
  }
`;
