import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import SelectField from "app/pages/report-builder/builder/components/panel/elements-controller/components/selectfield";

export const ReportBuilderSelectGridModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (rows: number, columns: number) => void;
}> = ({ open, onClose, onSelect }) => {
  const [rows, setRows] = React.useState(2);
  const [columns, setColumns] = React.useState(2);
  const cmsData = useCMSData({ returnData: true });

  const handleRowsChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (parsedValue >= 1 && parsedValue <= 10) {
      setRows(parsedValue);
    }
  };

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
            {getCMSDataField(
              cmsData,
              "componentsRBSelectGridModal.selectGridStructureTitle",
              "Select Grid Structure",
            )}
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
              label={getCMSDataField(
                cmsData,
                "componentsRBSelectGridModal.numberOfColumnsLabel",
                "Number of Columns",
              )}
              value={String(columns)}
              onChange={handleColumnsChange}
              options={Array.from({ length: 10 }, (_, i) => ({
                label: String(i + 1),
                value: String(i + 1),
              }))}
              width={"100%"}
            />
            <SelectField
              label={getCMSDataField(
                cmsData,
                "componentsRBSelectGridModal.numberOfRowsLabel",
                "Number of Rows",
              )}
              value={String(rows)}
              onChange={handleRowsChange}
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
              {getCMSDataField(
                cmsData,
                "componentsRBSelectGridModal.cancelButton",
                "Cancel",
              )}
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
                onSelect(rows, columns);
                onClose();
              }}
            >
              {getCMSDataField(
                cmsData,
                "componentsRBSelectGridModal.applyButton",
                "Apply",
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
