import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useGetAssets, useGetReports } from "app/hooks/queries/report-builder";
import { ReportBuilderSidebar } from "app/pages/report-builder/main/components/sidebar";
import { ReportBuilderToolbar } from "app/pages/report-builder/main/components/toolbar";
import { AllAssetsView } from "app/pages/report-builder/main/components/all-assets-view";
import { AllReportsView } from "app/pages/report-builder/main/components/all-reports-view";
import { TemplatesLayoutsView } from "app/pages/report-builder/main/components/templates-layouts-view";
import { ReportBuilderNewFolderModal } from "app/pages/report-builder/main/components/new-folder-modal";
import { ReportBuilderNewReportModal } from "app/pages/report-builder/main/components/new-report-modal";
import {
  AssetViewType,
  ReportBuilderAssetsToolbar,
} from "app/pages/report-builder/main/components/all-assets-view/toolbar";

export const ReportBuilder: React.FC = () => {
  const [sidebarSelectedItem, setSidebarSelectedItem] =
    React.useState("All Reports");
  const [search, setSearch] = React.useState("");
  const [selectedView, setSelectedView] = React.useState<"cards" | "list">(
    "cards",
  );

  const [selectedAssetView, setSelectedAssetView] =
    React.useState<AssetViewType>("all");
  const [selectedSort, setSelectedSort] = React.useState("createdDate DESC");
  const [newFolderModalOpen, setNewFolderModalOpen] = React.useState(false);
  const [newFolderModalNameValue, setNewFolderModalNameValue] =
    React.useState("");
  const [newReportModalOpen, setNewReportModalOpen] = React.useState(false);
  const [newReportModalNameValue, setNewReportModalNameValue] =
    React.useState("");
  const [newReportModalDescriptionValue, setNewReportModalDescriptionValue] =
    React.useState("");

  const getReports = useGetReports({ search: search, sort: selectedSort });

  const getAssets = useGetAssets({
    search: search,
    sort: selectedSort,
    type: selectedAssetView,
  });

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
        return (
          <AllReportsView
            reports={{
              isLoading: getReports.isFetching,
              data: get(getReports, "data.data", []),
            }}
            selectedView={selectedView}
            refetch={getReports.refetch}
          />
        );
      case "Templates and Layouts":
        return (
          <TemplatesLayoutsView
            selectedView={selectedView}
            setNewReportModalOpen={setNewReportModalOpen}
          />
        );
      case "All Assets":
        return (
          <React.Fragment>
            <ReportBuilderAssetsToolbar
              selectedView={selectedAssetView}
              setSelectedView={setSelectedAssetView}
            />
            <Box height="20px" />
            <AllAssetsView
              selectedView={selectedView}
              assets={{
                isLoading: getAssets.isFetching,
                data: get(getAssets, "data.data", []),
              }}
              refetch={getAssets.refetch}
            />
          </React.Fragment>
        );
      case "Tutorials":
      default:
        return <React.Fragment />;
    }
  }, [
    selectedView,
    selectedAssetView,
    sidebarSelectedItem,
    getReports.isLoading,
    getReports.data?.data,
    getAssets.isLoading,
    getAssets.data?.data,
  ]);

  React.useEffect(() => {
    if (sidebarSelectedItem === "All Reports") {
      getReports.refetch();
    }
  }, [sidebarSelectedItem, search]);

  return (
    <React.Fragment>
      <Box padding="50px 0">
        <Grid container spacing={"14px"}>
          <Grid item xs={12} md={3.5} lg={2.3}>
            <ReportBuilderSidebar
              selectedItem={sidebarSelectedItem}
              setSelectedItem={setSidebarSelectedItem}
            />
          </Grid>
          <Grid item xs={12} md={8.5} lg={9.7}>
            <ReportBuilderToolbar
              search={search}
              setSearch={setSearch}
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
