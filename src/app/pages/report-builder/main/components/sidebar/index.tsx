import React from "react";
import Box from "@mui/material/Box";
import { appColors } from "app/theme";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AllAssetsIcon from "app/assets/vectors/ReportBuilderSidebarAllAssets.svg?react";
import TutorialsIcon from "app/assets/vectors/ReportBuilderSidebarTutorials.svg?react";
import AllReportsIcon from "app/assets/vectors/ReportBuilderSidebarAllReports.svg?react";
import TemplatesLibrariesIcon from "app/assets/vectors/ReportBuilderSidebarTemplatesLibraries.svg?react";

export const ReportBuilderSidebar: React.FC<{
  selectedItem: string | null;
  setSelectedItem: (item: string) => void;
}> = ({ selectedItem, setSelectedItem }) => {
  const handleItemClick = (item: string) => () => {
    if (item !== selectedItem) {
      setSelectedItem(item);
    }
  };

  const items = [
    {
      name: "All Reports",
      icon: <AllReportsIcon />,
    },
    {
      name: "All Assets",
      icon: <AllAssetsIcon />,
    },
    {
      name: "Tutorials",
      icon: <TutorialsIcon />,
    },
    {
      name: "Templates and Layouts",
      icon: <TemplatesLibrariesIcon />,
    },
  ];

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon htmlColor={appColors.COMMON.SECONDARY_COLOR_1} />
          }
          sx={{
            minHeight: "30px",
            maxHeight: "30px",
            justifyContent: "flex-start",
            ".MuiAccordionSummary-content": {
              flexGrow: 0,
            },
          }}
        >
          <Typography
            variant="h6"
            fontSize="16px"
            fontWeight="700"
            padding="9px 12px"
          >
            Jane&apos;s Workspace
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              button: {
                color: "#000",
                fontSize: "16px",
                fontWeight: "400",
                padding: "12px 14px",
                borderRadius: "4px",
                lineHeight: "normal",
                textTransform: "none",
                justifyContent: "flex-start",
                ".MuiButton-startIcon": { ml: 0, mr: "10px" },
                "&:hover": {
                  background: "#eff1fe",
                },
              },
            }}
          >
            {items.map((item) => (
              <Button
                key={item.name}
                startIcon={item.icon}
                onClick={handleItemClick(item.name)}
                sx={{
                  background:
                    selectedItem === item.name ? "#eff1fe" : "transparent",
                  border:
                    selectedItem === item.name
                      ? "1px solid #3154f4"
                      : "1px solid transparent",
                  ...(item.name === "All Reports" && {
                    path: { stroke: "#252c34" },
                  }),
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
