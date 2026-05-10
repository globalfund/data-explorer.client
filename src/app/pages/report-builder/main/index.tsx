import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useSessionStorage } from "react-use";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNext from "@mui/icons-material/NavigateNext";
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
import {
  useGetAssets,
  useGetFolder,
  useGetFolders,
  useGetReports,
} from "app/hooks/queries/report-builder";
import { ReportBuilderMoveToFolderModal } from "./components/move-to-folder-modal";

export const ReportBuilder: React.FC = () => {
  const [sidebarSelectedItem, setSidebarSelectedItem] =
    React.useState("All Reports");
  const [search, setSearch] = React.useState("");
  const [selectedView, setSelectedView] = useSessionStorage<"cards" | "list">(
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
  const [moveToFolderModalOpen, setMoveToFolderModalOpen] =
    React.useState(false);

  const getReports = useGetReports({
    search: search,
    sort: selectedSort,
    includeFolders: true,
  });

  const getFoldersStructure = useGetFolders({
    search: "",
    sort: selectedSort,
    includeSubFolders: true,
  });

  const [openedFolders, setOpenedFolders] = React.useState<
    { id: string; name: string }[]
  >([]);

  const [allReportsViewItems, setAllReportsViewItems] = React.useState<
    {
      id: string;
      name: string;
      description: string;
      createdDate: string;
      updatedDate: string;
      isFolder?: boolean;
      assetCount?: number;
      reportCount?: number;
    }[]
  >(get(getReports, "data.data", []));

  const getFolder = useGetFolder(openedFolders[0]?.id);

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

  // const handleMoveToFolderModalOpen = () => {
  //   setMoveToFolderModalOpen(true);
  // };

  const handleMoveToFolderModalClose = () => {
    setMoveToFolderModalOpen(false);
  };

  const handleFolderOpen = (id: string) => {
    const folder = allReportsViewItems.find((item) => item.id === id);
    if (!folder) return;
    setOpenedFolders((prev) => [{ id, name: folder.name }, ...prev]);
  };

  const handleRootBreadcrumbClick = () => {
    setOpenedFolders([]);
    getReports.refetch().then((res) => {
      const reportsData = get(res, "data.data", []);
      setAllReportsViewItems(reportsData);
    });
  };

  const handleFolderBreadcrumbClick = (index: number) => () => {
    if (index === openedFolders.length - 1) return;
    setOpenedFolders((prev) => prev.slice(0, index + 1));
  };

  const view = React.useMemo(() => {
    switch (sidebarSelectedItem) {
      case "All Reports":
        return (
          <AllReportsView
            reports={{
              data: allReportsViewItems,
              isLoading:
                getReports.isFetching ||
                getReports.isLoading ||
                getFolder.isFetching ||
                getFolder.isLoading,
            }}
            refetch={getReports.refetch}
            handleFolderOpen={handleFolderOpen}
            selectedView={selectedView ?? "cards"}
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
    allReportsViewItems,
    sidebarSelectedItem,
    getReports.isLoading,
    getReports.isFetching,
    getFolder.isLoading,
    getFolder.isFetching,
    getAssets.isLoading,
    getAssets.data?.data,
  ]);

  React.useEffect(() => {
    if (sidebarSelectedItem === "All Reports") {
      getReports.refetch().then((res) => {
        const reportsData = get(res, "data.data", []);
        setAllReportsViewItems(reportsData);
      });
    }
  }, [sidebarSelectedItem, search]);

  React.useEffect(() => {
    if (openedFolders.length > 0 && getFolder.data) {
      const folderData = get(getFolder, "data.data.reports", []);
      setAllReportsViewItems(folderData);
    }
  }, [getFolder.data, openedFolders]);

  return (
    <React.Fragment>
      <Box padding="50px 0">
        <Grid container spacing="14px">
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
            {openedFolders.length > 0 && (
              <Breadcrumbs
                separator={
                  <NavigateNext fontSize="small" htmlColor="#adb5bd" />
                }
                sx={{ fontSize: "14px", position: "absolute" }}
              >
                <Typography
                  key="workspace"
                  fontSize="14px"
                  onClick={handleRootBreadcrumbClick}
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Workspace
                </Typography>
                {openedFolders.map((folder, i) => (
                  <Typography
                    key={folder.id}
                    fontSize="14px"
                    sx={
                      i !== openedFolders.length - 1
                        ? { textDecoration: "underline", cursor: "pointer" }
                        : {}
                    }
                    onClick={handleFolderBreadcrumbClick(i)}
                  >
                    {folder.name}
                  </Typography>
                ))}
              </Breadcrumbs>
            )}
            {openedFolders.length > 0 && <Box width="100%" height="40px" />}
            {view}
          </Grid>
        </Grid>
      </Box>
      <ReportBuilderNewFolderModal
        open={newFolderModalOpen}
        reload={getReports.refetch}
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
      <ReportBuilderMoveToFolderModal
        open={moveToFolderModalOpen}
        onClose={handleMoveToFolderModalClose}
        folderStructure={getFoldersStructure.data?.data || []}
      />
    </React.Fragment>
  );
};
