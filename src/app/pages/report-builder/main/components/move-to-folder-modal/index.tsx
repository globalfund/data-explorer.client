import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ReportBuilderMoveToFolderModalProps } from "app/pages/report-builder/main/components/move-to-folder-modal/data";

export const ReportBuilderMoveToFolderModal: React.FC<
  ReportBuilderMoveToFolderModalProps
> = ({ open, onClose }) => {
  return (
    <Modal disableScrollLock open={open} onClose={onClose}>
      <Box
        sx={{
          top: "50%",
          left: "50%",
          width: "500px",
          position: "absolute",
          background: "#ffffff",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            padding: "4px 10px",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #cfd4da",
          }}
        >
          <Typography variant="h6" fontSize="16px">
            Move to Folder
          </Typography>
          <IconButton onClick={onClose} sx={{ mr: "-12px" }}>
            <CloseIcon fontSize="small" htmlColor="#000" />
          </IconButton>
        </Box>
        <Box
          sx={{
            padding: "10px",
          }}
        >
          <Box
            sx={{
              gap: "10px",
              width: "100%",
              display: "flex",
              marginTop: "20px",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              //   disabled={!nameValue}
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#3154f4",
              }}
              //   onClick={onSubmit}
            >
              Move
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
