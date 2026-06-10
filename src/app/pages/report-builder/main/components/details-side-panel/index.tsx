import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";
import FolderIcon from "app/assets/vectors/Folder.svg?react";
import { getMonthFromNumber } from "app/utils/getMonthFromNumber";
import EmptyFolderIcon from "app/assets/vectors/EmptyFolder.svg?react";

export const ReportBuilderDetailsSidePanel: React.FC<{
  onClose: () => void;
  details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    type: "asset" | "report" | "folder";
    content?: {
      assetCount: number;
      reportCount: number;
      folderCount: number;
    };
  };
}> = ({ onClose, details }) => {
  const created = new Date(details.createdDate);
  const updated = new Date(details.updatedDate);
  const cmsData = useCMSData({ returnData: true });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const text = React.useMemo(() => {
    const assetCount = details.content?.assetCount ?? 0;
    const reportCount = details.content?.reportCount ?? 0;
    const folderCount = details.content?.folderCount ?? 0;

    if (assetCount === 0 && reportCount === 0 && folderCount === 0) {
      return "Empty Folder";
    }
    if (assetCount > 0 && reportCount === 0 && folderCount === 0) {
      return `${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount > 0 && reportCount > 0 && folderCount === 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount > 0 && reportCount === 0 && folderCount > 0) {
      return `${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount === 0 && reportCount > 0 && folderCount === 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} inside`;
    }
    if (assetCount === 0 && reportCount > 0 && folderCount > 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} inside`;
    }
    return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"}, ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} and ${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} inside`;
  }, [
    details.content?.assetCount,
    details.content?.reportCount,
    details.content?.folderCount,
  ]);

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box
      sx={{
        minWidth: "400px",
        overflowY: "auto",
        borderRadius: "4px 0 0 4px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #cfd4da",
        minHeight: "calc(100% - 194px)",
        maxHeight: "calc(100% - 194px)",
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
          {getCMSDataField(
            cmsData,
            "pagesReportBuilderMain.fileDetailsTitle",
            "File Details",
          )}
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
            justifyContent: "center",
          }}
        >
          {details.type === "folder" ? (
            <Box
              sx={{
                gap: "10px",
                width: "100%",
                height: "180px",
                display: "flex",
                paddingTop: "8px",
                alignItems: "center",
                bgcolor: "#f8f9fa",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {details.content?.assetCount === 0 &&
              details.content?.reportCount === 0 &&
              details.content?.folderCount === 0 ? (
                <React.Fragment>
                  <EmptyFolderIcon />
                  <Typography fontSize="14px">{text}</Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FolderIcon />
                  <Typography fontSize="14px">{text}</Typography>
                </React.Fragment>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                width: "calc(100% - 10px)",
                backgroundImage: `url(${import.meta.env.VITE_API}/report-thumbnail/${details.id}.png)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            />
          )}
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.nameLabel",
              "Name",
            )}
          </Typography>
          <Typography fontSize="14px">{details.name}</Typography>
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.descriptionLabel",
              "Description",
            )}
          </Typography>
          <Typography fontSize="14px">
            {details.description ??
              getCMSDataField(
                cmsData,
                "pagesReportBuilderMain.noDescriptionProvided",
                "No description provided.",
              )}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.createdLabel",
              "Created",
            )}
          </Typography>
          <Typography fontSize="14px">
            {getMonthFromNumber(created.getMonth() + 1, true)}{" "}
            {created.getDate()}, {created.getFullYear()}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="14px" fontWeight="700">
            {getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.modifiedLabel",
              "Modified",
            )}
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
