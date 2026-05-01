import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SendIcon from "@mui/icons-material/Send";
import { ComposerRoot } from "app/pages/ai-explorer/styles";

interface Props {
  value: string;
  loading: boolean;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  multilineFull?: boolean;
}

export const ChatComposer: React.FC<Props> = ({
  value,
  loading,
  onChange,
  onSubmit,
  placeholder = "Ask anything…",
  multilineFull = false,
}) => {
  const canSubmit = value.trim().length > 0 && !loading;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  return (
    <ComposerRoot
      sx={
        multilineFull
          ? {
              border: "1px solid #BCC6D6",
              borderRadius: 2,
              p: 1.5,
              bgcolor: "#ffffff",
            }
          : {}
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          border: multilineFull ? "none" : "1px solid #BCC6D6",
          borderRadius: multilineFull ? 0 : 2,
          p: multilineFull ? 0 : 1,
          bgcolor: "#ffffff",
        }}
      >
        <InputBase
          fullWidth
          multiline
          maxRows={multilineFull ? 12 : 6}
          minRows={multilineFull ? 4 : 1}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          sx={{ fontSize: 14, flex: 1 }}
          inputProps={{
            "aria-label": "Chat input",
            "data-testid": "chat-composer-input",
          }}
        />
        <IconButton
          size="small"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Send message"
          data-testid="chat-composer-send"
          sx={{
            bgcolor: canSubmit ? "#002561" : undefined,
            color: canSubmit ? "#ffffff" : undefined,
            "&:hover": { bgcolor: canSubmit ? "#013B82" : undefined },
            flexShrink: 0,
            mb: 0.25,
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </ComposerRoot>
  );
};
