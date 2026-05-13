import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useDeleteReport } from "app/hooks/queries/report-builder";
import WarningIcon from "app/assets/vectors/WarningIconBig.svg?react";

export const ReportBuilderDeleteReportModal: React.FC<{
  open: boolean;
  reportId: string;
  reportName: string;
  onClose: () => void;
  refetch: () => void;
}> = ({ open, onClose, reportName, refetch, reportId }) => {
  const deleteReport = useDeleteReport();

  const handleDelete = () => {
    deleteReport.mutate(reportId, {
      onSuccess: () => {
        refetch();
        onClose();
      },
    });
  };

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
            padding: "10px",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: "1px solid #cfd4da",
          }}
        >
          <Box
            sx={{
              gap: "10px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <WarningIcon />
            <Box>
              <Typography variant="h6" fontSize="16px">
                Delete report?
              </Typography>
              <Typography fontSize="14px">
                This action cannot be undone.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            padding: "16px",
          }}
        >
          <Typography variant="body2" marginBottom="5px" color="#525252">
            Are you sure you want to delete <b>{reportName}</b>?
          </Typography>
          <Box
            sx={{
              gap: "10px",
              width: "100%",
              display: "flex",
              marginTop: "25px",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#ea1541",
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
