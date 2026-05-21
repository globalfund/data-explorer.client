import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export const Empty: React.FC = () => {
  const cmsData = useCMSData({ returnData: true });

  return (
    <Box
      sx={{
        gap: "20px",
        width: "100%",
        display: "flex",
        paddingTop: "82px",
        textAlign: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography fontSize="24px" color="#495057">
        {getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.emptyTitle",
          "Start building your report",
        )}
      </Typography>
      <Typography fontSize="16px" color="#495057">
        {getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.emptyDescriptionLine1",
          "Click on the elements you would like to add",
        )}
        <br />
        {getCMSDataField(
          cmsData,
          "pagesReportBuilderBuilder.emptyDescriptionLine2",
          "Or start typing to add text directly",
        )}
      </Typography>
    </Box>
  );
};
