import { action, Action } from "easy-peasy";
import { Chat, ChatMessage, ChatRole } from "app/pages/ai-explorer/types";
import { RBReportModel } from "app/state/api/action-reducers/report-builder/sync";

const MAX_CHATS = 50;

export interface AiExplorerChatsModel {
  chats: Chat[];
  activeChatId: string | null;
  inputValue: string;
  isAssistantLoading: boolean;
  sidebarCollapsed: boolean;
  isPanelOpen: boolean;
  searchQuery: string;
  mainViewMode: "explore" | "report";
  generatedReports: Record<string, RBReportModel>;
  demoMode: boolean;

  openPanel: Action<AiExplorerChatsModel>;
  closePanel: Action<AiExplorerChatsModel>;
  togglePanel: Action<AiExplorerChatsModel>;
  toggleSidebar: Action<AiExplorerChatsModel>;
  createChat: Action<AiExplorerChatsModel>;
  setActiveChat: Action<AiExplorerChatsModel, string | null>;
  appendUserMessage: Action<AiExplorerChatsModel, string>;
  appendAssistantMessage: Action<AiExplorerChatsModel, ChatMessage>;
  setInputValue: Action<AiExplorerChatsModel, string>;
  setSearchQuery: Action<AiExplorerChatsModel, string>;
  setAssistantLoading: Action<AiExplorerChatsModel, boolean>;
  deleteChat: Action<AiExplorerChatsModel, string>;
  setGeneratedReport: Action<
    AiExplorerChatsModel,
    { chatId: string; report: RBReportModel }
  >;
  clearGeneratedReport: Action<AiExplorerChatsModel>;
  setDemoMode: Action<AiExplorerChatsModel, boolean>;
}

function makeId(): string {
  return crypto.randomUUID();
}

function makeMessage(role: ChatRole, content: string): ChatMessage {
  return { id: makeId(), role, content, createdAt: Date.now() };
}

function updateChatInList(
  chats: Chat[],
  chatId: string,
  updater: (chat: Chat) => Chat,
): Chat[] {
  return chats.map((c) => (c.id === chatId ? updater(c) : c));
}

export const AiExplorerChats: AiExplorerChatsModel = {
  chats: [],
  activeChatId: null,
  inputValue: "",
  isAssistantLoading: false,
  sidebarCollapsed: false,
  isPanelOpen: false,
  searchQuery: "",
  mainViewMode: "explore",
  generatedReports: {},
  demoMode: false,
  openPanel: action((state) => {
    state.isPanelOpen = true;
  }),
  closePanel: action((state) => {
    state.isPanelOpen = false;
  }),
  togglePanel: action((state) => {
    state.isPanelOpen = !state.isPanelOpen;
  }),
  toggleSidebar: action((state) => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
  }),
  createChat: action((state) => {
    const newChat: Chat = {
      id: makeId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const trimmed = state.chats.slice(0, MAX_CHATS - 1);
    state.chats = [newChat, ...trimmed];
    state.activeChatId = newChat.id;
    state.inputValue = "";
  }),
  setActiveChat: action((state, chatId) => {
    state.activeChatId = chatId;
    state.inputValue = "";
    state.mainViewMode =
      chatId && state.generatedReports[chatId] ? "report" : "explore";
  }),
  appendUserMessage: action((state, content) => {
    if (!state.activeChatId) return;
    const message = makeMessage("user", content);
    const now = Date.now();
    const updated = updateChatInList(state.chats, state.activeChatId, (c) => {
      const title =
        c.messages.length === 0
          ? content.slice(0, 60) + (content.length > 60 ? "…" : "")
          : c.title;
      return {
        ...c,
        messages: [...c.messages, message],
        updatedAt: now,
        title,
      };
    });
    state.chats = [...updated].sort((a, b) => b.updatedAt - a.updatedAt);
    state.inputValue = "";
    state.isAssistantLoading = true;
  }),
  appendAssistantMessage: action((state, message) => {
    if (!state.activeChatId) return;
    const now = Date.now();
    const updated = updateChatInList(state.chats, state.activeChatId, (c) => ({
      ...c,
      messages: [...c.messages, message],
      updatedAt: now,
    }));
    state.chats = [...updated].sort((a, b) => b.updatedAt - a.updatedAt);
    state.isAssistantLoading = false;

    if (message.report) {
      const placement = message.reportPlacement ?? "inline";
      if (placement === "main_view") {
        state.generatedReports[state.activeChatId] = message.report;
        state.mainViewMode = "report";
      }
      // "inline": report lives in the message itself; no main-view switch
    }
  }),
  setInputValue: action((state, value) => {
    state.inputValue = value;
  }),
  setSearchQuery: action((state, query) => {
    state.searchQuery = query;
  }),
  setAssistantLoading: action((state, loading) => {
    state.isAssistantLoading = loading;
  }),
  deleteChat: action((state, chatId) => {
    state.chats = state.chats.filter((c) => c.id !== chatId);
    if (state.activeChatId === chatId) {
      state.activeChatId = state.chats[0]?.id ?? null;
      state.mainViewMode = "explore";
    }
    delete state.generatedReports[chatId];
  }),
  setGeneratedReport: action((state, { chatId, report }) => {
    state.generatedReports[chatId] = report;
    state.mainViewMode = "report";
  }),
  clearGeneratedReport: action((state) => {
    state.mainViewMode = "explore";
  }),
  setDemoMode: action((state, value) => {
    state.demoMode = value;
  }),
};
