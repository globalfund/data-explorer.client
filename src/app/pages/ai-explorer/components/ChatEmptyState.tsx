import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { ChatComposer } from "app/pages/ai-explorer/components/ChatComposer";
import { EmptyStateRoot, HintChipsRow } from "app/pages/ai-explorer/styles";
import { HINT_CHIPS } from "app/pages/ai-explorer/data";
import { useStoreState, useStoreActions } from "app/state/store/hooks";

interface ChatEmptyStateProps {
  onSubmit: () => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onSubmit }) => {
  const inputValue = useStoreState((s) => s.AiExplorerChats.inputValue);
  const loading = useStoreState((s) => s.AiExplorerChats.isAssistantLoading);

  const setInputValue = useStoreActions((a) => a.AiExplorerChats.setInputValue);

  return (
    <EmptyStateRoot>
      <Typography variant="h6" fontWeight={600} color="#002561">
        What would you like to explore?
      </Typography>

      <Box sx={{ width: "66%" }}>
        <ChatComposer
          value={inputValue}
          loading={loading}
          onChange={setInputValue}
          onSubmit={onSubmit}
          placeholder="Ask anything…"
          multilineFull
        />
      </Box>

      <HintChipsRow>
        {HINT_CHIPS.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            variant="outlined"
            size="small"
            clickable
            onClick={() => setInputValue(chip)}
            sx={{ cursor: "pointer", borderColor: "#BCC6D6", fontSize: 12 }}
          />
        ))}
      </HintChipsRow>
    </EmptyStateRoot>
  );
};
