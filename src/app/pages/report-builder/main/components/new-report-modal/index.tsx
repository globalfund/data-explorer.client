import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { PageLoader } from "app/components/page-loader";
import { useCMSData } from "app/hooks/useCMSData";
import { useCreateReport } from "app/hooks/queries/report-builder";
import { getCMSDataField } from "app/utils/getCMSDataField";
import { ReportBuilderNewReportModalProps } from "app/pages/report-builder/main/components/new-report-modal/data";

export const ReportBuilderNewReportModal: React.FC<
  ReportBuilderNewReportModalProps
> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const cmsData = useCMSData({ returnData: true });
  const [nameValue, setNameValue] = React.useState("");
  const [descriptionValue, setDescriptionValue] = React.useState("");

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setNameValue(e.target.value);
    }
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) {
      setDescriptionValue(e.target.value);
    }
  };

  const createReport = useCreateReport();

  const onSubmit = () => {
    const assetToInsertInNewReport = localStorage.getItem(
      "assetToInsertInNewReport",
    );
    let asset = null;
    if (assetToInsertInNewReport) {
      asset = JSON.parse(assetToInsertInNewReport).asset;
      localStorage.removeItem("assetToInsertInNewReport");
    }
    if (nameValue && descriptionValue) {
      const newReport = {
        name: nameValue,
        description: descriptionValue,
        items: asset ? [{ ...asset, open: false }] : [],
        settings: {
          width: (window.innerWidth > 1440
            ? 1392
            : window.innerWidth - 32
          ).toString(),
          height: (window.innerHeight - 160).toString(),
          padding: ["50", "50", "50", "50"],
          stroke: "0",
          strokeColor: "#000000",
          backgroundColor: "#ffffff",
          borderRadius: "0",
        },
      };

      createReport.mutate(newReport, {
        onSuccess: (data) => {
          navigate(`/report-builder/reports/${data?.data?.id}/edit`);
        },
      });
    }
  };

  React.useEffect(() => {
    return () => {
      localStorage.removeItem("assetToInsertInNewReport");
    };
  }, []);

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
        {createReport.isPending && <PageLoader />}
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
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.createNewReportTitle",
              "Create a New Report",
            )}
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
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" marginBottom="5px">
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.reportNameLabel",
                "Report Name",
              )}
            </Typography>
            <Typography fontSize="12px" marginBottom="5px">
              {nameValue.length}/100
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              marginBottom: "20px",
              input: {
                width: "100%",
                borderRadius: "4px",
                padding: "11px 16px",
                background: "#fff",
                border: "1px solid #98a1aa",
                "&:focus, &:active": {
                  borderColor: "#3154f4",
                },
              },
            }}
          >
            <input
              autoFocus
              type="text"
              value={nameValue}
              onChange={onNameChange}
              placeholder={getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.reportNamePlaceholder",
                "Report name",
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
            <Typography variant="body2" marginBottom="5px">
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.reportDescriptionLabel",
                "Report Description",
              )}
            </Typography>
            <Typography fontSize="12px" marginBottom="5px">
              {descriptionValue.length}/250
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              textarea: {
                width: "100%",
                height: "129px",
                padding: "16px",
                borderRadius: "4px",
                background: "#fff",
                border: "1px solid #98a1aa",
                "&:focus, &:active": {
                  borderColor: "#3154f4",
                },
              },
            }}
          >
            <textarea
              value={descriptionValue}
              onChange={onDescriptionChange}
              placeholder={getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.reportDescriptionPlaceholder",
                "Report description",
              )}
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
              disabled={!nameValue || !descriptionValue}
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#3154f4",
              }}
              onClick={onSubmit}
            >
              {getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.createReportButton",
                "Create Report",
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
