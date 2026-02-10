import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { ReportBuilderSidebar } from "app/pages/report-builder/main/components/sidebar";
import { ReportBuilderToolbar } from "app/pages/report-builder/main/components/toolbar";
import { AllAssetsView } from "app/pages/report-builder/main/components/all-assets-view";
import { AllReportsView } from "app/pages/report-builder/main/components/all-reports-view";
import { TemplatesLayoutsView } from "app/pages/report-builder/main/components/templates-layouts-view";
import { ReportBuilderNewFolderModal } from "app/pages/report-builder/main/components/new-folder-modal";
import { ReportBuilderNewReportModal } from "app/pages/report-builder/main/components/new-report-modal";

export const ReportBuilder: React.FC = () => {
  const [sidebarSelectedItem, setSidebarSelectedItem] =
    React.useState("All Reports");
  const [selectedView, setSelectedView] = React.useState<"cards" | "list">(
    "cards",
  );
  const [selectedSort, setSelectedSort] = React.useState("Date Created");
  const [newFolderModalOpen, setNewFolderModalOpen] = React.useState(false);
  const [newFolderModalNameValue, setNewFolderModalNameValue] =
    React.useState("");
  const [newReportModalOpen, setNewReportModalOpen] = React.useState(false);
  const [newReportModalNameValue, setNewReportModalNameValue] =
    React.useState("");
  const [newReportModalDescriptionValue, setNewReportModalDescriptionValue] =
    React.useState("");

  const handleNewFolderModalOpen = () => {
    setNewFolderModalOpen(true);
  };

  const handleNewFolderModalClose = () => {
    setNewFolderModalOpen(false);
  };

  const handleNewReportModalOpen = () => {
    setNewReportModalOpen(true);
  };

  const handleNewReportModalClose = () => {
    setNewReportModalOpen(false);
  };

  const view = React.useMemo(() => {
    switch (sidebarSelectedItem) {
      case "All Reports":
        return <AllReportsView selectedView={selectedView} />;
      case "Templates and Layouts":
        return (
          <TemplatesLayoutsView
            selectedView={selectedView}
            setNewReportModalOpen={setNewReportModalOpen}
          />
        );
      case "All Assets":
        return <AllAssetsView selectedView={selectedView} />;
      case "Tutorials":
      default:
        return <React.Fragment />;
    }
  }, [sidebarSelectedItem, selectedView]);

  return (
    <React.Fragment>
      <Box padding="50px 0">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={2.5}>
            <ReportBuilderSidebar
              selectedItem={sidebarSelectedItem}
              setSelectedItem={setSidebarSelectedItem}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={9.5}>
            <ReportBuilderToolbar
              selectedSort={selectedSort}
              selectedView={selectedView}
              setSelectedSort={setSelectedSort}
              setSelectedView={setSelectedView}
              onNewFolderClick={handleNewFolderModalOpen}
              onNewReportClick={handleNewReportModalOpen}
            />
            <Box width="100%" height="20px" />
            {view}
          </Grid>
        </Grid>
      </Box>
      <ReportBuilderNewFolderModal
        open={newFolderModalOpen}
        onClose={handleNewFolderModalClose}
        nameValue={newFolderModalNameValue}
        setNameValue={setNewFolderModalNameValue}
      />
      <ReportBuilderNewReportModal
        open={newReportModalOpen}
        onClose={handleNewReportModalClose}
        nameValue={newReportModalNameValue}
        setNameValue={setNewReportModalNameValue}
        descriptionValue={newReportModalDescriptionValue}
        setDescriptionValue={setNewReportModalDescriptionValue}
      />
    </React.Fragment>
  );
};
