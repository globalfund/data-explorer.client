import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useSessionStorage, useTitle } from "react-use";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { ReportBuilderSidebar } from "app/pages/report-builder/main/components/sidebar";
import { ReportBuilderToolbar } from "app/pages/report-builder/main/components/toolbar";
import { AllAssetsView } from "app/pages/report-builder/main/components/all-assets-view";
import { AllReportsView } from "app/pages/report-builder/main/components/all-reports-view";
import { TemplatesLayoutsView } from "app/pages/report-builder/main/components/templates-layouts-view";
import { ReportBuilderNewFolderModal } from "app/pages/report-builder/main/components/new-folder-modal";
import { ReportBuilderNewReportModal } from "app/pages/report-builder/main/components/new-report-modal";
import { ReportBuilderDeleteFolderModal } from "app/pages/report-builder/main/components/delete-folder-modal";
import { ReportBuilderDeleteReportModal } from "app/pages/report-builder/main/components/delete-report-modal";
import { ReportBuilderMoveToFolderModal } from "app/pages/report-builder/main/components/move-to-folder-modal";
import { ReportBuilderReportDetailsPanel } from "app/pages/report-builder/main/components/report-details-panel";
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
import { RBFolderModelResponse } from "app/state/api/action-reducers/report-builder/sync";

export const ReportBuilder: React.FC = () => {
  useTitle("The Data Explorer - Report Builder");

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
  const [itemToMove, setItemToMove] = React.useState<{
    id: string;
    name: string;
    type: "report" | "folder";
  } | null>(null);
  const [deleteReportModalOpen, setDeleteReportModalOpen] =
    React.useState(false);
  const [reportToDelete, setReportToDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteFolderModalOpen, setDeleteFolderModalOpen] =
    React.useState(false);
  const [folderToDelete, setFolderToDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [reportDetailsPanelOpen, setReportDetailsPanelOpen] =
    React.useState(false);
  const [reportDetails, setReportDetails] = React.useState<{
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
  }>({
    id: "",
    name: "",
    description: "",
    createdDate: "",
    updatedDate: "",
  });

  const getReports = useGetReports({
    search: search,
    sort: selectedSort,
    includeFolders: true,
    onlyRootLevel: true,
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
      folderCount?: number;
      locationPath?: string;
    }[]
  >(get(getReports, "data.data", []));

  const getFolder = useGetFolder(openedFolders[openedFolders.length - 1]?.id);

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

  const handleMoveToFolderModalOpen = () => {
    setMoveToFolderModalOpen(true);
  };

  const handleMoveToFolderModalClose = () => {
    setMoveToFolderModalOpen(false);
  };

  const handleItemMoveToFolder = (
    id: string,
    name: string,
    type: "report" | "folder",
  ) => {
    setItemToMove({ id, name, type });
    handleMoveToFolderModalOpen();
  };

  const handleFolderOpen = (id: string) => {
    const folder = allReportsViewItems.find((item) => item.id === id);
    if (!folder) return;
    setOpenedFolders((prev) => [...prev, { id, name: folder.name }]);
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

  const handleDeleteReportModalOpen = () => {
    setDeleteReportModalOpen(true);
  };

  const handleDeleteReportModalClose = () => {
    setDeleteReportModalOpen(false);
  };

  const handleDeleteFolderModalOpen = () => {
    setDeleteFolderModalOpen(true);
  };

  const handleDeleteFolderModalClose = () => {
    setDeleteFolderModalOpen(false);
  };

  const handleReportDetailsPanelOpen = (details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
  }) => {
    setReportDetails(details);
    setReportDetailsPanelOpen(true);
  };

  const handleReportDetailsPanelClose = () => {
    setReportDetailsPanelOpen(false);
  };

  const handleDeleteReport = (id: string, name: string) => {
    setReportToDelete({ id, name });
    handleDeleteReportModalOpen();
  };

  const handleDeleteFolder = (id: string, name: string) => {
    setFolderToDelete({ id, name });
    handleDeleteFolderModalOpen();
  };

  const refetch = () => {
    getReports.refetch().then((res) => {
      const reportsData = get(res, "data.data", []);
      setAllReportsViewItems(reportsData);
    });
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
            refetch={refetch}
            onDeleteReport={handleDeleteReport}
            onDeleteFolder={handleDeleteFolder}
            handleFolderOpen={handleFolderOpen}
            selectedView={selectedView ?? "cards"}
            onMoveItemToFolder={handleItemMoveToFolder}
            onDetailsClick={handleReportDetailsPanelOpen}
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

  const selectedItemToMove = React.useMemo(() => {
    if (!itemToMove) return null;
    return (
      allReportsViewItems.find((item) => item.id === itemToMove.id) ?? null
    );
  }, [itemToMove, allReportsViewItems]);

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
      const subReports = get(getFolder, "data.data.reports", []);
      const subFolders = get(getFolder, "data.data.children", []).map(
        (folder: RBFolderModelResponse) => ({
          id: folder.id,
          name: folder.name,
          description: "",
          createdDate: folder.createdDate,
          updatedDate: folder.updatedDate,
          isFolder: true,
          assetCount: folder.assets ? folder.assets.length : 0,
          reportCount: folder.reports ? folder.reports.length : 0,
          folderCount: folder.children ? folder.children.length : 0,
          locationPath: folder.locationPath,
        }),
      );
      const folderData = [...subReports, ...subFolders];
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
                sx={{ zIndex: 1, fontSize: "14px", position: "absolute" }}
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
            <Box position="relative">
              {view}
              <ReportBuilderReportDetailsPanel
                details={reportDetails}
                open={reportDetailsPanelOpen}
                onClose={handleReportDetailsPanelClose}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ReportBuilderNewFolderModal
        reload={refetch}
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
      <ReportBuilderMoveToFolderModal
        refetch={refetch}
        open={moveToFolderModalOpen}
        itemId={itemToMove?.id ?? ""}
        setOpenedFolders={setOpenedFolders}
        itemName={itemToMove?.name ?? ""}
        onClose={handleMoveToFolderModalClose}
        refetchOpenedFolder={getFolder.refetch}
        itemType={itemToMove?.type ?? "report"}
        itemLocation={selectedItemToMove?.locationPath ?? ""}
        folderStructure={getFoldersStructure.data?.data ?? []}
      />
      <ReportBuilderDeleteReportModal
        refetch={refetch}
        open={deleteReportModalOpen}
        reportId={reportToDelete?.id ?? ""}
        onClose={handleDeleteReportModalClose}
        reportName={reportToDelete?.name ?? ""}
      />
      <ReportBuilderDeleteFolderModal
        refetch={refetch}
        open={deleteFolderModalOpen}
        folderId={folderToDelete?.id ?? ""}
        onClose={handleDeleteFolderModalClose}
        folderName={folderToDelete?.name ?? ""}
      />
    </React.Fragment>
  );
};
