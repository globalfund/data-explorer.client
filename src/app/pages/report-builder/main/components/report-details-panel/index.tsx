import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { getMonthFromNumber } from "app/utils/getMonthFromNumber";

export const ReportBuilderReportDetailsPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
  };
}> = ({ open, onClose, details }) => {
  const created = new Date(details.createdDate);
  const updated = new Date(details.updatedDate);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box
      sx={{
        zIndex: 1,
        top: "194px",
        width: "400px",
        overflowY: "auto",
        position: "fixed",
        right: open ? 0 : "-100%",
        borderRadius: "4px 0 0 4px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #cfd4da",
        minHeight: "calc(100% - 194px)",
        maxHeight: "calc(100% - 194px)",
        transition: "right 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          padding: "5px 10px",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #cfd4da",
        }}
      >
        <Typography variant="h6" fontSize="16px">
          File Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="small" htmlColor="#000" />
        </IconButton>
      </Box>
      <Box
        sx={{
          gap: "16px",
          width: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "180px",
            display: "flex",
            paddingTop: "8px",
            cursor: "pointer",
            justifyContent: "center",
            div: {
              width: "calc(100% - 10px)",
              backgroundImage: `url(${import.meta.env.VITE_API}/report-thumbnail/${details.id}.png)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            },
          }}
        >
          <div />
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            Name
          </Typography>
          <Typography fontSize="14px">{details.name}</Typography>
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            Description
          </Typography>
          <Typography fontSize="14px">
            {details.description ?? "No description provided."}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            Created
          </Typography>
          <Typography fontSize="14px">
            {getMonthFromNumber(created.getMonth() + 1, true)}{" "}
            {created.getDate()}, {created.getFullYear()}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            Modified
          </Typography>
          <Typography fontSize="14px">
            {getMonthFromNumber(updated.getMonth() + 1, true)}{" "}
            {updated.getDate()}, {updated.getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
