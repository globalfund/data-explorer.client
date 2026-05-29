import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export const SaveAsAssetModal: React.FC<{
  open: boolean;
  nameValue: string;
  onClose: () => void;
  descriptionValue: string;
  setNameValue: (value: string) => void;
  setDescriptionValue: (value: string) => void;
  onSubmit?: () => void;
}> = ({
  open,
  onClose,
  nameValue,
  setNameValue,
  descriptionValue,
  setDescriptionValue,
  onSubmit,
}) => {
  const cmsData = useCMSData({ returnData: true });
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setNameValue(e.target.value);
    }
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 250) {
      setDescriptionValue(e.target.value);
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
        id={"save-as-asset-modal"}
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
              "componentsRBSaveAsAssetModal.saveAsAssetTitle",
              "Save As Asset",
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          paddingLeft="10px"
          marginTop="10px"
          color="#525252"
        >
          {getCMSDataField(
            cmsData,
            "componentsRBSaveAsAssetModal.saveAsAssetDescription",
            "Save component as an asset to reuse.",
          )}
        </Typography>
        <Box
          sx={{
            padding: "10px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" marginBottom="5px" color="#525252">
              {getCMSDataField(
                cmsData,
                "componentsRBSaveAsAssetModal.assetNameLabel",
                "Asset Name",
              )}
            </Typography>
            <Typography variant="body2" marginBottom="5px" color="#525252">
              {nameValue.length}/100
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              marginBottom: "20px",
              input: {
                width: "100%",
                padding: "11px 16px",
                background: "#f1f3f5",
                border: "1px solid #f1f3f5",
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
              onChange={onNameChange}
              placeholder={getCMSDataField(
                cmsData,
                "componentsRBSaveAsAssetModal.assetNamePlaceholder",
                "Asset name",
              )}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" marginBottom="5px" color="#525252">
              {getCMSDataField(
                cmsData,
                "componentsRBSaveAsAssetModal.descriptionLabel",
                "Description",
              )}
            </Typography>
            <Typography variant="body2" marginBottom="5px" color="#525252">
              {descriptionValue.length}/250
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              input: {
                width: "100%",
                padding: "11px 16px",
                background: "#f1f3f5",
                border: "1px solid #f1f3f5",
                borderBottomColor: "#868e96",
                "&:focus, &:active": {
                  borderColor: "#3154f4",
                },
              },
            }}
          >
            <input
              type="text"
              value={descriptionValue}
              onChange={onDescriptionChange}
              placeholder={getCMSDataField(
                cmsData,
                "componentsRBSaveAsAssetModal.descriptionPlaceholder",
                "Description",
              )}
            />
          </Box>
          <Typography variant="body2" color="#525252" fontSize={"12px"}>
            {getCMSDataField(
              cmsData,
              "componentsRBSaveAsAssetModal.assetUseCaseHint",
              "State the asset use case",
            )}
          </Typography>
          <Box
            sx={{
              gap: "10px",
              width: "100%",
              display: "flex",
              marginTop: "24px",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              {getCMSDataField(
                cmsData,
                "componentsRBSaveAsAssetModal.cancelButton",
                "Cancel",
              )}
            </Button>
            <Button
              variant="contained"
              disabled={!nameValue || !descriptionValue}
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#3154f4",
              }}
              onClick={() => {
                if (onSubmit) {
                  onSubmit();
                }
              }}
            >
              {getCMSDataField(
                cmsData,
                "componentsRBSaveAsAssetModal.saveButton",
                "Save",
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
