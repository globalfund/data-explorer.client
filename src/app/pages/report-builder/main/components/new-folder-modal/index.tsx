import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export const ReportBuilderNewFolderModal: React.FC<{
  open: boolean;
  nameValue: string;
  onClose: () => void;
  setNameValue: (value: string) => void;
}> = ({ open, onClose, nameValue, setNameValue }) => {
  const cmsData = useCMSData({ returnData: true });

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
              "pagesReportBuilderMain.createFolderTitle",
              "Create Folder",
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
          <Typography variant="body2" marginBottom="5px" color="#525252">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.folderNameLabel",
              "Folder Name",
            )}
          </Typography>
          <Box
            sx={{
              width: "100%",
              input: {
                width: "100%",
                padding: "11px 16px",
                background: "#f1f3f5",
                border: "2px solid #f1f3f5",
                borderBottomColor: "#868e96",
                "&:focus, &:active": {
                  borderColor: "#3154f4",
                },
              },
            }}
          >
            <input
              type="text"
              value={nameValue}
              placeholder={getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.folderNamePlaceholder",
                "Folder name",
              )}
              onChange={(e) => setNameValue(e.target.value)}
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
                "pagesReportBuilderMain.cancelButton",
                "Cancel",
              )}
            </Button>
            <Button
              variant="contained"
              disabled={!nameValue}
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#3154f4",
              }}
            >
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.createFolderButton",
                "Create Folder",
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
