import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

type Score = "good" | "neutral" | "bad";

interface FeedbackRequest {
  topic: string;
  score: Score;
  text: string | null;
}

interface FeedbackWidgetProps {
  candidateId: string;
  label: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  candidateId,
  label,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [text, setText] = useState("");

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setScore(null);
    setText("");
  };

  const handleSend = () => {
    if (!score) return;
    const userText = text.trim();
    const payload: FeedbackRequest = {
      topic: candidateId,
      score,
      text: userText ? `${label}: ${userText}` : null,
    };
    fetch(`${import.meta.env.VITE_API}/flexible-ui-generation/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((e) => {
      console.log("error sending feedback", e);
    });
    handleClose();
  };

  return (
    <>
      <Tooltip title="Give feedback" placement="left">
        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label={`Give feedback on ${label}`}
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 2,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid #e0e0e0",
            width: 28,
            height: 28,
            "&:hover": { bgcolor: "#ecf1fa", borderColor: "#b0bec5" },
          }}
        >
          <RateReviewOutlinedIcon sx={{ fontSize: 15, color: "#666" }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e3e3e3",
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            width: 300,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} color="#002561">
            Feedback on &quot;{label}&quot;
          </Typography>

          <TextField
            multiline
            rows={3}
            placeholder="Comments (optional, but preferred)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="small"
            fullWidth
            sx={{ "& .MuiInputBase-root": { fontSize: 13 } }}
          />

          <ToggleButtonGroup
            value={score}
            exclusive
            onChange={(_, v: Score | null) => {
              if (v !== null) setScore(v);
            }}
            fullWidth
            size="small"
            sx={{ gap: 0.5 }}
          >
            <ToggleButton
              value="good"
              sx={{
                flex: 1,
                fontSize: 12,
                fontWeight: 500,
                color: "#3d7a52",
                border: "1px solid #b7dac0 !important",
                borderRadius: "6px !important",
                "&.Mui-selected": {
                  bgcolor: "#c3e6cb",
                  color: "#265c38",
                  borderColor: "#90c9a0 !important",
                  "&:hover": { bgcolor: "#d4edda" },
                },
                "&:hover": { bgcolor: "#edf7f0" },
              }}
            >
              Good
            </ToggleButton>
            <ToggleButton
              value="neutral"
              sx={{
                flex: 1,
                fontSize: 12,
                fontWeight: 500,
                color: "#8a6200",
                border: "1px solid #e8d08a !important",
                borderRadius: "6px !important",
                "&.Mui-selected": {
                  bgcolor: "#ffeaa0",
                  color: "#6d4c00",
                  borderColor: "#d4b050 !important",
                  "&:hover": { bgcolor: "#fff3cd" },
                },
                "&:hover": { bgcolor: "#fffbea" },
              }}
            >
              Neutral
            </ToggleButton>
            <ToggleButton
              value="bad"
              sx={{
                flex: 1,
                fontSize: 12,
                fontWeight: 500,
                color: "#9b3a3a",
                border: "1px solid #f0b8b8 !important",
                borderRadius: "6px !important",
                "&.Mui-selected": {
                  bgcolor: "#f5c6cb",
                  color: "#7a2222",
                  borderColor: "#d98080 !important",
                  "&:hover": { bgcolor: "#f8d7da" },
                },
                "&:hover": { bgcolor: "#fdf0f0" },
              }}
            >
              Needs Work
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="small"
            onClick={handleSend}
            disabled={!score}
            fullWidth
            sx={{
              bgcolor: "#002561",
              fontSize: 13,
              textTransform: "none",
              "&:hover": { bgcolor: "#013B82" },
              "&.Mui-disabled": { bgcolor: "#c5cdd8", color: "#fff" },
            }}
          >
            Send
          </Button>
        </Box>
      </Popover>
    </>
  );
};
