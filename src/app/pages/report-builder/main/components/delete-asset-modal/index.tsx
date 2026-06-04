import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { useDeleteAsset } from "app/hooks/queries/report-builder";
import WarningIcon from "app/assets/vectors/WarningIconBig.svg?react";
import { ReportBuilderDeleteAssetModalProps } from "app/pages/report-builder/main/components/delete-asset-modal/data";

export const ReportBuilderDeleteAssetModal: React.FC<
  ReportBuilderDeleteAssetModalProps
> = ({ open, onClose, assetName, refetch, assetId }) => {
  const deleteAsset = useDeleteAsset();
  const cmsData = useCMSData({ returnData: true });

  const handleDelete = () => {
    deleteAsset.mutate(assetId, {
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
                {getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.deleteAssetTitle",
                  "Delete asset?",
                )}
              </Typography>
              <Typography fontSize="14px">
                {getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.deleteActionCannotBeUndone",
                  "This action cannot be undone.",
                )}
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
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.deleteAssetConfirmationPrefix",
              "Are you sure you want to delete",
            )}{" "}
            <b>{assetName}</b>?
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
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.cancelButton",
                "Cancel",
              )}
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
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.deleteButton",
                "Delete",
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
