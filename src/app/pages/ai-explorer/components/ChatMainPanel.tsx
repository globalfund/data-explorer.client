import React from "react";
import { ChatAreaRoot } from "app/pages/ai-explorer/styles";
import { ChatEmptyState } from "app/pages/ai-explorer/components/ChatEmptyState";
import { ChatMessageList } from "app/pages/ai-explorer/components/ChatMessageList";
import { ChatComposer } from "app/pages/ai-explorer/components/ChatComposer";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { useMockAssistant } from "app/pages/ai-explorer/hooks/useMockAssistant";

export const ChatMainPanel: React.FC = () => {
  const chats = useStoreState((s) => s.AiExplorerChats.chats);
  const activeChatId = useStoreState((s) => s.AiExplorerChats.activeChatId);
  const inputValue = useStoreState((s) => s.AiExplorerChats.inputValue);
  const isAssistantLoading = useStoreState(
    (s) => s.AiExplorerChats.isAssistantLoading,
  );

  const setInputValue = useStoreActions((a) => a.AiExplorerChats.setInputValue);
  const appendUserMessage = useStoreActions(
    (a) => a.AiExplorerChats.appendUserMessage,
  );
  const appendAssistantMessage = useStoreActions(
    (a) => a.AiExplorerChats.appendAssistantMessage,
  );
  const setAssistantLoading = useStoreActions(
    (a) => a.AiExplorerChats.setAssistantLoading,
  );

  const { respond } = useMockAssistant();

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const handleSubmit = async () => {
    const text = inputValue.trim();
    if (!text || !activeChatId) return;
    appendUserMessage(text);
    try {
      const reply = await respond(text);
      appendAssistantMessage(reply);
    } catch {
      setAssistantLoading(false);
    }
  };

  if (!activeChat || activeChat.messages.length === 0) {
    return (
      <ChatAreaRoot>
        <ChatEmptyState />
      </ChatAreaRoot>
    );
  }

  return (
    <ChatAreaRoot>
      <ChatMessageList
        chat={activeChat}
        isAssistantLoading={isAssistantLoading}
      />
      <ChatComposer
        value={inputValue}
        loading={isAssistantLoading}
        onChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </ChatAreaRoot>
  );
};
