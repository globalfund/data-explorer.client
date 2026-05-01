import { useMemo } from "react";
import { Chat } from "app/pages/ai-explorer/types";

export function useFilteredChats(chats: Chat[], query: string): Chat[] {
  return useMemo(() => {
    if (!query.trim()) return chats;
    const lower = query.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(lower) ||
        chat.messages.some((m) => m.content.toLowerCase().includes(lower)),
    );
  }, [chats, query]);
}
