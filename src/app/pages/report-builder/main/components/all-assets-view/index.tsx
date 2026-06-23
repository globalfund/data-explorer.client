import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import capitalize from "lodash/capitalize";
import { Table } from "app/components/table";
import { CellComponent } from "tabulator-tables";
import { useCMSData } from "app/hooks/useCMSData";
import { renderToString } from "react-dom/server";
import { getCMSDataField } from "app/utils/getCMSDataField";
import CircularProgress from "@mui/material/CircularProgress";
import { ReportBuilderItemMenu } from "app/pages/report-builder/main/components/item-menu";
import { EmptyAssetsView } from "app/pages/report-builder/main/components/all-assets-view/empty";
import { AllAssetsViewProps } from "app/pages/report-builder/main/components/all-assets-view/data";
import {
  AssetCard,
  FolderCard,
} from "app/pages/report-builder/main/components/all-reports-view/cards";
import {
  usePatchAsset2,
  usePatchFolder2,
  useDuplicateAsset,
  useDuplicateFolder,
} from "app/hooks/queries/report-builder";
import {
  Copy,
  Share,
  Folder,
  Pencil,
  Details,
  Backspace,
} from "app/pages/report-builder/builder/components/report-settings/icons";
import { useNavigate } from "react-router-dom";

export const AllAssetsView: React.FC<AllAssetsViewProps> = ({
  assets,
  refetch,
  selectedView,
  onDeleteAsset,
  onDetailsClick,
  onDeleteFolder,
  handleFolderOpen,
  onMoveItemToFolder,
  detailsSidePanelOpen,
  handleUseAsset,
}) => {
  const updateAsset = usePatchAsset2();
  const updateFolder = usePatchFolder2();
  const duplicateAsset = useDuplicateAsset();
  const duplicateFolder = useDuplicateFolder();
  const cmsData = useCMSData({ returnData: true });

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [anchorElTableId, setAnchorElTableId] = React.useState<string | null>(
    null,
  );

  const [imageVersion, setImageVersion] = React.useState(Date.now());
  const anchorElTable = React.useMemo(() => {
    if (!anchorElTableId) return null;
    return {
      nodeType: 1 as const,
      getBoundingClientRect: () =>
        document.getElementById(anchorElTableId)?.getBoundingClientRect() ??
        new DOMRect(),
    };
  }, [anchorElTableId]);
  const [selectedItemForRenaming, setSelectedItemForRenaming] = React.useState<
    string | null
  >(null);

  const handleItemMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleCloseTable = () => setAnchorElTableId(null);

  const getAnchorElId = () => {
    if (anchorEl) {
      return anchorEl?.getAttribute("id");
    }
    if (anchorElTableId) {
      return anchorElTableId;
    }
    return null;
  };

  const getAnchorElName = () => anchorEl?.getAttribute("name");

  const handleRename = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    setSelectedItemForRenaming(id);
    setAnchorElTableId(null);
    setTimeout(() => {
      const element = document.getElementById(`rename-field-${id}`);
      if (element) {
        element.focus();
      }
    }, 100);
  };

  const handleRenameEnter = (
    id: string,
    type: "report" | "asset" | "folder",
  ) => {
    const name = (
      document.getElementById(`rename-field-${id}`) as HTMLInputElement
    )?.value;
    if (!name) {
      setSelectedItemForRenaming(null);
      return;
    }
    if (type === "folder") {
      updateFolder.mutate(
        { id, name },
        {
          onSuccess: () => {
            setSelectedItemForRenaming(null);
            refetch();
          },
        },
      );
    } else {
      updateAsset.mutate(
        { id, name },
        {
          onSuccess: () => {
            setSelectedItemForRenaming(null);
            refetch();
          },
        },
      );
    }
  };

  const handleDuplicate = () => {
    const id = getAnchorElId();
    const isFolder = getAnchorElName() === "folder";
    if (!id) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    if (isFolder) {
      duplicateFolder.mutate(id, {
        onSuccess: () => refetch(),
      });
    } else {
      duplicateAsset.mutate(id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleDelete = () => {
    const id = getAnchorElId();
    const isFolder = getAnchorElName() === "folder";
    const actualName = assets.data.find((a) => a.id === id)?.name;
    if (!id) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    if (isFolder) {
      onDeleteFolder(id, actualName ?? "this folder");
    } else {
      onDeleteAsset(id, actualName ?? "this asset");
    }
  };

  const handleItemClick =
    (id: string, type: "report" | "asset" | "folder") => () => {
      if (type === "folder") {
        handleFolderOpen(id);
      } else {
        navigate(`/report-builder/assets/${id}`);
      }
    };

  const handleTableCellClick = (_e: UIEvent, cell: CellComponent) => {
    const id = cell.getRow().getData()?.id;
    const type = cell.getRow().getData()?.type;
    if (id && !selectedItemForRenaming) {
      handleItemClick(id, type === "Folder" ? "folder" : "asset")();
    }
  };

  const handleTableClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const button = target.closest(".table-action-btn") as HTMLElement | null;
    if (button && button.id) {
      setAnchorElTableId(button.id);
    } else {
      setAnchorElTableId(null);
    }
  };

  const handleTableCellRenameEnter = (id: string) => {
    const element = document.getElementById(
      `rename-field-${id}`,
    ) as HTMLInputElement | null;
    if (!element) {
      setSelectedItemForRenaming(null);
      return;
    }
    const name = element.value;
    if (!name) {
      setSelectedItemForRenaming(null);
      return;
    }
    updateAsset.mutate(
      { id, name },
      {
        onSuccess: () => {
          setSelectedItemForRenaming(null);
        },
      },
    );
  };

  const handleDetailsClick = () => {
    const id = getAnchorElId();
    const isFolder = getAnchorElName() === "folder";
    if (!id) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    const item = assets.data.find((r) => r.id === id);
    if (item) {
      onDetailsClick({
        ...item,
        type: isFolder ? "folder" : "asset",
        content: isFolder
          ? {
              reportCount: 0,
              assetCount: item.assetCount ?? 0,
              folderCount: item.folderCount ?? 0,
            }
          : undefined,
      });
    }
  };

  const handleMoveToFolder = () => {
    const id = getAnchorElId();
    const isFolder = getAnchorElName() === "folder";
    const name = assets.data.find((a) => a.id === id)?.name;
    if (!id || !name) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    onMoveItemToFolder(id, name, isFolder ? "folder" : "asset");
  };

  React.useEffect(() => {
    setImageVersion(Date.now());
  }, []);

  const view = React.useMemo(() => {
    if (assets.isLoading) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (!assets.data || assets.data.length === 0) {
      return <EmptyAssetsView />;
    }
    if (selectedView === "cards") {
      return (
        <Grid container spacing={2.5}>
          {assets.data.map((item) => (
            <Grid
              item
              xs={12}
              key={item.id}
              sm={detailsSidePanelOpen ? 12 : 6}
              md={detailsSidePanelOpen ? 6 : 4}
              lg={detailsSidePanelOpen ? 6 : 4}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  padding: "16px",
                  borderRadius: "4px",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: `1px solid ${getAnchorElId() === item.id ? "#3154f4" : "#cfd4da"}`,
                  ":hover": {
                    borderColor: "#3154f4",
                  },
                }}
              >
                {!item.isFolder && (
                  <AssetCard
                    id={item.id}
                    name={item.name}
                    type={item.type}
                    handleUseAsset={() => handleUseAsset(item.id)}
                    createdDate={item.createdDate}
                    updatedDate={item.updatedDate}
                    imageVersion={imageVersion}
                    handleItemClick={handleItemClick}
                    handleRenameEnter={handleRenameEnter}
                    handleItemMenuClick={handleItemMenuClick}
                    selectedItemForRenaming={selectedItemForRenaming}
                    setSelectedItemForRenaming={setSelectedItemForRenaming}
                  />
                )}
                {item.isFolder && (
                  <FolderCard
                    id={item.id}
                    reportCount={0}
                    name={item.name}
                    createdDate={item.createdDate}
                    updatedDate={item.updatedDate}
                    handleItemClick={handleItemClick}
                    assetCount={item.assetCount ?? 0}
                    folderCount={item.folderCount ?? 0}
                    handleRenameEnter={handleRenameEnter}
                    handleItemMenuClick={handleItemMenuClick}
                    selectedItemForRenaming={selectedItemForRenaming}
                    setSelectedItemForRenaming={setSelectedItemForRenaming}
                  />
                )}
              </Box>
            </Grid>
          ))}
          <ReportBuilderItemMenu
            anchorEl={anchorEl}
            handleClose={handleClose}
            menuItems={[
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.renameMenuItem",
                  "Rename",
                ),
                icon: <Pencil />,
                onClick: handleRename,
              },
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.shareMenuItem",
                  "Share",
                ),
                icon: <Share />,
                onClick: handleClose,
                disabled: true,
              },
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.moveToFolderMenuItem",
                  "Move to Folder",
                ),
                icon: <Folder />,
                onClick: handleMoveToFolder,
              },
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.duplicateMenuItem",
                  "Duplicate",
                ),
                icon: <Copy />,
                onClick: handleDuplicate,
              },
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.detailsMenuItem",
                  "Details",
                ),
                icon: <Details />,
                onClick: handleDetailsClick,
              },
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.deleteMenuItem",
                  "Delete",
                ),
                icon: <Backspace />,
                onClick: handleDelete,
              },
            ]}
          />
        </Grid>
      );
    }
    return (
      <Table
        id="reports-table"
        data={assets.data.map((item) => {
          const cdate = new Date(item.createdDate);
          const edate = new Date(item.updatedDate);
          return {
            id: item.id,
            name: item.name,
            type: item.type ?? "",
            description: item.description,
            dateCreated: `${cdate.getDate()}-${cdate.getMonth() + 1}-${cdate.getFullYear()}`,
            dateEdited: `${edate.getDate()}-${edate.getMonth() + 1}-${edate.getFullYear()}`,
          };
        })}
        columns={[
          { title: "", field: "id", visible: false },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.reportNameColumn",
              "Report name",
            ),
            field: "name",
            width: "30%",
            cellClick: handleTableCellClick,
            formatter: (cell) =>
              renderToString(
                selectedItemForRenaming === cell.getRow().getData()?.id ? (
                  <input
                    type="text"
                    defaultValue={cell.getValue()}
                    name="assets-table-cell-input"
                    id={`rename-field-${cell.getRow().getData()?.id}`}
                    style={{
                      width: "100%",
                      border: "2px solid #3154f4",
                    }}
                  />
                ) : (
                  <u style={{ color: "#3154f4" }}>{cell.getValue()}</u>
                ),
              ),
          },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.descriptionColumn",
              "Description",
            ),
            field: "description",
            width: "30%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.typeColumn",
              "Type",
            ),
            field: "type",
            width: "10%",
            formatter: (cell) => {
              return capitalize(cell.getValue() as string);
            },
          },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.dateCreatedColumn",
              "Date Created",
            ),
            field: "dateCreated",
            width: "10%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.lastEditedColumn",
              "Last Edited",
            ),
            field: "dateEdited",
            width: "10%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.actionsColumn",
              "Actions",
            ),
            field: "actions",
            width: "10%",
            formatter: (cell: CellComponent) => {
              const id = cell.getRow().getData()?.id;
              return `<div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                            <button id="${id}" class="table-action-btn" tabindex="0" type="button" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                              <svg width="3" height="14" viewBox="0 0 3 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.0625 2.125C1.6493 2.125 2.125 1.6493 2.125 1.0625C2.125 0.475697 1.6493 0 1.0625 0C0.475697 0 0 0.475697 0 1.0625C0 1.6493 0.475697 2.125 1.0625 2.125Z" fill="#454545"/>
            <path d="M1.0625 7.79163C1.6493 7.79163 2.125 7.31593 2.125 6.72913C2.125 6.14232 1.6493 5.66663 1.0625 5.66663C0.475697 5.66663 0 6.14232 0 6.72913C0 7.31593 0.475697 7.79163 1.0625 7.79163Z" fill="#454545"/>
            <path d="M1.0625 13.4584C1.6493 13.4584 2.125 12.9827 2.125 12.3959C2.125 11.8091 1.6493 11.3334 1.0625 11.3334C0.475697 11.3334 0 11.8091 0 12.3959C0 12.9827 0.475697 13.4584 1.0625 13.4584Z" fill="#454545"/>
            </svg>
                            </button>
                          </div>`;
            },
          },
        ]}
        onClick={handleTableClick}
      />
    );
  }, [
    assets,
    cmsData,
    anchorEl,
    selectedView,
    detailsSidePanelOpen,
    selectedItemForRenaming,
    imageVersion,
  ]);

  React.useEffect(() => {
    if (selectedView === "list" && selectedItemForRenaming) {
      setTimeout(() => {
        const element = document.getElementById(
          `rename-field-${selectedItemForRenaming}`,
        );
        if (element) {
          element.focus();
          element.addEventListener("blur", () =>
            handleTableCellRenameEnter(selectedItemForRenaming),
          );
          element.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              setSelectedItemForRenaming(null);
            }
            if (e.key === "Enter") {
              handleTableCellRenameEnter(selectedItemForRenaming);
            }
          });
        }
      }, 100);
    }
  }, [selectedView, selectedItemForRenaming]);

  return (
    <React.Fragment>
      {view}
      <ReportBuilderItemMenu
        anchorEl={anchorElTable}
        handleClose={handleCloseTable}
        menuItems={[
          {
            label: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.renameMenuItem",
              "Rename",
            ),
            icon: <Pencil />,
            onClick: handleRename,
          },
          {
            label: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.shareMenuItem",
              "Share",
            ),
            icon: <Share />,
            onClick: handleClose,
            disabled: true,
          },
          {
            label: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.moveToFolderMenuItem",
              "Move to Folder",
            ),
            icon: <Folder />,
            onClick: handleMoveToFolder,
          },
          {
            label: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.duplicateMenuItem",
              "Duplicate",
            ),
            icon: <Copy />,
            onClick: handleDuplicate,
          },
          {
            label: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.detailsMenuItem",
              "Details",
            ),
            icon: <Details />,
            onClick: handleDetailsClick,
          },
          {
            label: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.deleteMenuItem",
              "Delete",
            ),
            icon: <Backspace />,
            onClick: handleDelete,
          },
        ]}
      />
    </React.Fragment>
  );
};
