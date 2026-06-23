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
import { Add } from "@mui/icons-material";
import { useGetAsset, useGetReports } from "app/hooks/queries/report-builder";
import { useNavigate } from "react-router-dom";

export const ReportBuilderUseAssetModal: React.FC<{
  open: boolean;
  onClose: () => void;
  assetId: string | null;

  setNewReportModalOpen: (open: boolean) => void;
}> = ({ open, onClose, assetId, setNewReportModalOpen }) => {
  const reportsQuery = useGetReports({
    search: "",
    sort: "createdDate DESC",
  });
  const reports = reportsQuery.data?.data ?? [];

  const [selectedReport, setSelectedReport] = React.useState("");
  const cmsData = useCMSData({ returnData: true });

  const assetQuery = useGetAsset(assetId ?? "");
  const asset = assetQuery.data?.data;

  const handleColumnsChange = (value: string) => {
    setSelectedReport(value);
  };

  const navigate = useNavigate();

  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={() => {
        setSelectedReport("");
        onClose();
      }}
    >
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
            Use an Asset
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
              label={"Choose the report"}
              value={selectedReport}
              onChange={handleColumnsChange}
              options={
                reports?.map((report) => ({
                  label: report.name,
                  value: report.id,
                })) || []
              }
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
                "componentsRBSelectColumnModal.cancelButton",
                "Cancel",
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                localStorage.setItem(
                  "assetToInsertInNewReport",
                  JSON.stringify({ asset }),
                );
                setNewReportModalOpen(true);
              }}
              disabled={!asset}
              startIcon={<Add />}
            >
              Insert to New Report
            </Button>
            <Button
              variant="contained"
              sx={{
                fontWeight: "400",
                color: "#ffffff",
                textTransform: "none",
                background: "#3154f4",
              }}
              disabled={!selectedReport || !asset}
              onClick={() => {
                localStorage.setItem(
                  "assetToInsert",
                  JSON.stringify({ asset, reportId: selectedReport }),
                );
                navigate(`/report-builder/reports/${selectedReport}/edit`);
                onClose();
              }}
            >
              Insert
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
