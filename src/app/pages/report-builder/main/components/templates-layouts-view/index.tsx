import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import { Table } from "app/components/table";
import Typography from "@mui/material/Typography";
import { useCMSData } from "app/hooks/useCMSData";
import {
  ReportBuilderLibraryLayouts,
  ReportBuilderLibraryTemplates,
} from "app/pages/report-builder/main/data";
import { getCMSDataField } from "app/utils/getCMSDataField";

const TemplatesIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <path
      d="M14 2.5V6.5C14 7.03043 14.2107 7.53914 14.5858 7.91421C14.9609 8.28929 15.4696 8.5 16 8.5H20M15 2.5H6C5.46957 2.5 4.96086 2.71071 4.58579 3.08579C4.21071 3.46086 4 3.96957 4 4.5V20.5C4 21.0304 4.21071 21.5391 4.58579 21.9142C4.96086 22.2893 5.46957 22.5 6 22.5H18C18.5304 22.5 19.0391 22.2893 19.4142 21.9142C19.7893 21.5391 20 21.0304 20 20.5V7.5L15 2.5Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LayoutsIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <path
      d="M9 3.5H5C4.46957 3.5 3.96086 3.71071 3.58579 4.08579C3.21071 4.46086 3 4.96957 3 5.5V9.5M9 3.5H19C19.5304 3.5 20.0391 3.71071 20.4142 4.08579C20.7893 4.46086 21 4.96957 21 5.5V9.5M9 3.5V21.5M3 9.5V19.5C3 20.0304 3.21071 20.5391 3.58579 20.9142C3.96086 21.2893 4.46957 21.5 5 21.5H9M3 9.5H21M21 9.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H9"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TemplatesLayoutsView: React.FC<{
  selectedView: "cards" | "list";
  setNewReportModalOpen: (open: boolean) => void;
}> = ({ selectedView, setNewReportModalOpen }) => {
  const cmsData = useCMSData({ returnData: true });
  const [selectedSubView, setSelectedSubView] = React.useState<
    "templates" | "layouts"
  >("templates");

  const data = React.useMemo(() => {
    return selectedSubView === "templates"
      ? ReportBuilderLibraryTemplates
      : ReportBuilderLibraryLayouts;
  }, [selectedSubView]);

  const view = React.useMemo(() => {
    if (selectedView === "cards") {
      return (
        <Grid
          container
          spacing={2}
          direction="row"
          sx={{
            alignItems: "stretch",
          }}
        >
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: "180px",
                      display: "flex",
                      paddingTop: "8px",
                      justifyContent: "center",
                      border: "1px solid #cfd4da",
                    }}
                  >
                    <img src={item.imagePath} alt={item.title} width="80%" />
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      margin: "10px 0 5px 0",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontSize="16px"
                      lineHeight="normal"
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" mb="5px">
                    {item.description}
                  </Typography>
                  <Typography variant="body2" mb="20px">
                    {getCMSDataField(
                      cmsData,
                      "componentsRBTemplatesLayoutsView.byOwnerPrefix",
                      "By",
                    )}{" "}
                    {item.owner}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Add fontSize="small" />}
                  onClick={() => setNewReportModalOpen(true)}
                >
                  {getCMSDataField(
                    cmsData,
                    "componentsRBTemplatesLayoutsView.insertButtonPrefix",
                    "Insert",
                  )}{" "}
                  {selectedSubView === "templates"
                    ? getCMSDataField(
                        cmsData,
                        "componentsRBTemplatesLayoutsView.templateSingular",
                        "Template",
                      )
                    : getCMSDataField(
                        cmsData,
                        "componentsRBTemplatesLayoutsView.layoutSingular",
                        "Layout",
                      )}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      );
    }
    return (
      <Table
        id="reports-table"
        data={data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          dateCreated: `${item.createdDate.getDate()}-${item.createdDate.getMonth() + 1}-${item.createdDate.getFullYear()}`,
          dateEdited: `${item.editedDate.getDate()}-${item.editedDate.getMonth() + 1}-${item.editedDate.getFullYear()}`,
        }))}
        columns={[
          {
            title: getCMSDataField(
              cmsData,
              "componentsRBTemplatesLayoutsView.titleColumn",
              "Title",
            ),
            field: "title",
            width: "30%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "componentsRBTemplatesLayoutsView.descriptionColumn",
              "Description",
            ),
            field: "description",
            width: "40%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "componentsRBTemplatesLayoutsView.dateCreatedColumn",
              "Date Created",
            ),
            field: "dateCreated",
            width: "15%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "componentsRBTemplatesLayoutsView.lastEditedColumn",
              "Last Edited",
            ),
            field: "dateEdited",
            width: "15%",
          },
        ]}
      />
    );
  }, [selectedView, data, selectedSubView, cmsData]);

  return (
    <React.Fragment>
      <Box
        sx={{
          marginBottom: "20px",
          button: {
            borderRadius: 0,
            fontSize: "16px",
            padding: "8px 12px",
            textTransform: "none",
          },
        }}
      >
        <Button
          startIcon={<TemplatesIcon />}
          onClick={() => setSelectedSubView("templates")}
          sx={{
            fontWeight: selectedSubView === "templates" ? "700" : "400",
            background:
              selectedSubView === "templates" ? "transparent" : "#f1f3f5",
            borderTop: `1px solid ${selectedSubView === "templates" ? "#0f62fe" : "#f1f3f5"}`,
            ".MuiButton-startIcon": { path: { stroke: "#161616" } },
          }}
        >
          {getCMSDataField(
            cmsData,
            "componentsRBTemplatesLayoutsView.templatesTab",
            "Templates",
          )}
        </Button>
        <Button
          startIcon={<LayoutsIcon />}
          onClick={() => setSelectedSubView("layouts")}
          sx={{
            fontWeight: selectedSubView === "layouts" ? "700" : "400",
            background:
              selectedSubView === "layouts" ? "transparent" : "#f1f3f5",
            borderTop: `1px solid ${selectedSubView === "layouts" ? "#0f62fe" : "#f1f3f5"}`,
          }}
        >
          {getCMSDataField(
            cmsData,
            "componentsRBTemplatesLayoutsView.layoutsTab",
            "Layouts",
          )}
        </Button>
      </Box>
      {view}
    </React.Fragment>
  );
};
