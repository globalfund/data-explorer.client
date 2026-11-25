import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import WarningIcon from "app/assets/vectors/WarningIconBig.svg?react";
import {
  getRemovedDimensions,
  getRemovedFieldsWarning,
  RemovedField,
} from "app/pages/report-builder/builder/components/panel/elements-controller/chart/mapping/switch-mapping";

interface Props {
  open: boolean;
  /** The name of the chart type being switched to. */
  chartName: string;
  removed: RemovedField[];
  onCancel: () => void;
  onConfirm: () => void;
}

/** Asks before switching to a chart type that has no place for some fields. */
export const ConfirmTypeSwitch: React.FC<Props> = ({
  open,
  chartName,
  removed,
  onCancel,
  onConfirm,
}) => (
  <Modal disableScrollLock open={open} onClose={onCancel}>
    <Box
      role="alertdialog"
      aria-labelledby="rb-confirm-type-switch-title"
      aria-describedby="rb-confirm-type-switch-description"
      data-cy="rb-confirm-type-switch"
      sx={{
        top: "50%",
        left: "50%",
        width: "500px",
        position: "absolute",
        background: "#ffffff",
        borderRadius: "4px",
        transform: "translate(-50%, -50%)",
        "@media (max-width: 600px)": {
          width: "90%",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          padding: "10px",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid #cfd4da",
        }}
      >
        <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
          <WarningIcon />
          <Box>
            <Typography
              id="rb-confirm-type-switch-title"
              variant="h6"
              fontSize="16px"
            >
              Switch to {chartName}?
            </Typography>
            <Typography fontSize="14px">
              Some of your fields don&apos;t fit this chart type.
            </Typography>
          </Box>
        </Box>
        <IconButton aria-label="Close" onClick={onCancel}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ padding: "16px" }}>
        <Typography
          id="rb-confirm-type-switch-description"
          fontSize="14px"
          color="#252C34"
        >
          {getRemovedFieldsWarning(chartName, removed)}
        </Typography>
        <Box
          component="ul"
          sx={{
            margin: "12px 0 0",
            paddingLeft: "20px",
            fontSize: "14px",
            color: "#525252",
            li: { marginBottom: "4px" },
          }}
        >
          {getRemovedDimensions(removed).map((dimension) => (
            <li key={dimension}>
              <b>{dimension}:</b>{" "}
              {removed
                .filter((field) => field.from === dimension)
                .map((field) => field.field)
                .join(", ")}
            </li>
          ))}
        </Box>
        <Box
          sx={{
            gap: "10px",
            width: "100%",
            display: "flex",
            marginTop: "25px",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={onCancel}
            sx={{
              height: "35px",
              padding: "6px 14px",
              borderRadius: "4px",
              border: "0.5px solid #98A1AA",
              bgcolor: "#FFFFFF",
              color: "#000000",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            data-cy="rb-confirm-type-switch-continue"
            onClick={onConfirm}
            sx={{
              height: "35px",
              padding: "6px 14px",
              borderRadius: "4px",
              bgcolor: "#3154F4",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: "400",
              textTransform: "none",
              "&:hover": { bgcolor: "#2444D8" },
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  </Modal>
);
