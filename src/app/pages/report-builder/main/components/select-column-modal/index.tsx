import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import SelectField from "app/pages/report-builder/builder/components/panel/elements-controller/components/selectfield";

export const ReportBuilderSelectColumnModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (columns: number) => void;
}> = ({ open, onClose, onSelect }) => {
  const [columns, setColumns] = React.useState(2);

  const handleColumnsChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (parsedValue >= 1 && parsedValue <= 10) {
      setColumns(parsedValue);
    }
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
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #cfd4da",
          }}
        >
          <Typography variant="h6" fontSize="16px">
            Select Column Structure
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            padding: "10px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              marginBottom: "20px",
              display: "flex",
              gap: "24px",
            }}
          >
            <SelectField
              label="Number of Columns"
              value={String(columns)}
              onChange={handleColumnsChange}
              options={Array.from({ length: 10 }, (_, i) => ({
                label: String(i + 1),
                value: String(i + 1),
              }))}
              width={"100%"}
            />
          </Box>
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
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#3154f4",
              }}
              onClick={() => {
                onSelect(columns);
                onClose();
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
