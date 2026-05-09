import React from "react";
import { ChatAreaRoot } from "app/pages/ai-explorer/styles";
import { ChatEmptyState } from "app/pages/ai-explorer/components/ChatEmptyState";
import { ChatMessageList } from "app/pages/ai-explorer/components/ChatMessageList";
import { ChatComposer } from "app/pages/ai-explorer/components/ChatComposer";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { useMockAssistant } from "app/pages/ai-explorer/hooks/useMockAssistant";
import { useRealAssistant } from "app/pages/ai-explorer/hooks/useRealAssistant";
import { ProgressEvent } from "app/pages/ai-explorer/types";
import { FeedbackWidget } from "./FeedbackWidget";
import { DemoToggle } from "./DemoToggle";

export const ChatMainPanel: React.FC = () => {
  const chats = useStoreState((s) => s.AiExplorerChats.chats);
  const activeChatId = useStoreState((s) => s.AiExplorerChats.activeChatId);
  const inputValue = useStoreState((s) => s.AiExplorerChats.inputValue);
  const isAssistantLoading = useStoreState(
    (s) => s.AiExplorerChats.isAssistantLoading,
  );
  const demoMode = useStoreState((s) => s.AiExplorerChats.demoMode);

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
  const setDemoMode = useStoreActions((a) => a.AiExplorerChats.setDemoMode);

  const [progressLog, setProgressLog] = React.useState<ProgressEvent[]>([]);
  const [streamingContent, setStreamingContent] = React.useState("");

  const mockAssistant = useMockAssistant();
  const realAssistant = useRealAssistant();

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const handleSubmit = async () => {
    const text = inputValue.trim();
    if (!text || !activeChatId) return;
    const localProgressLog: ProgressEvent[] = [];
    setProgressLog([]);
    setStreamingContent("");
    appendUserMessage(text);
    try {
      const reply = demoMode
        ? await mockAssistant.respond(text)
        : await realAssistant.respond(text, (p) => {
            if (p.event === "rag_chunk" && typeof p.data.chunk === "string") {
              setStreamingContent((prev) => prev + (p.data.chunk as string));
            } else if (
              p.event === "rag_done" &&
              typeof p.data.content === "string"
            ) {
              setStreamingContent(p.data.content as string);
              // if RAG is done, store all the result key/value pairs into the progress log.
              Object.entries(p.data).forEach(([key, value]) => {
                const entry: ProgressEvent = {
                  event: "rag_done",
                  data: { key, value, reasoning: `${key}: ${JSON.stringify(value)}` },
                };
                localProgressLog.push(entry);
                setProgressLog((prev) => [...prev, entry]);
              });
            } else {
              localProgressLog.push(p);
              setProgressLog((prev) => [...prev, p]);
            }
          });
      appendAssistantMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply.content,
        createdAt: Date.now(),
        report: reply.report,
        reportPlacement: reply.reportPlacement,
        progressLog: localProgressLog.length > 0 ? localProgressLog : undefined,
      });
    } catch {
      setAssistantLoading(false);
    }
  };

  const isEmpty = !activeChat || activeChat.messages.length === 0;

  return (
    <ChatAreaRoot sx={{ position: "relative" }}>
      <DemoToggle demoMode={demoMode} setDemoMode={setDemoMode} />
      <FeedbackWidget
        candidateId={isEmpty ? "chat-empty-state" : "chat-main-panel"}
        label={isEmpty ? "Chat Empty State" : "Chat Main Panel"}
      />
      {isEmpty ? (
        <ChatEmptyState onSubmit={handleSubmit} />
      ) : (
        <>
          <ChatMessageList
            chat={activeChat}
            isAssistantLoading={isAssistantLoading}
            progressLog={progressLog}
            streamingContent={streamingContent}
          />
          <ChatComposer
            value={inputValue}
            loading={isAssistantLoading}
            onChange={setInputValue}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </ChatAreaRoot>
  );
};
