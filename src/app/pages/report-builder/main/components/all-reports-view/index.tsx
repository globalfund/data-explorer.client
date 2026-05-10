import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Table } from "app/components/table";
import { useNavigate } from "react-router-dom";
import { CellComponent } from "tabulator-tables";
import CircularProgress from "@mui/material/CircularProgress";
import { ReportBuilderItemMenu } from "app/pages/report-builder/main/components/item-menu";
import {
  ReportCard,
  FolderCard,
} from "app/pages/report-builder/main/components/all-reports-view/cards";
import {
  useDeleteFolder,
  useDeleteReport,
  useDuplicateFolder,
  useDuplicateReport,
  usePatchFolder2,
  usePatchReport2,
} from "app/hooks/queries/report-builder";
import {
  Copy,
  Share,
  Pencil,
  Folder,
  Details,
  Backspace,
} from "app/pages/report-builder/builder/components/report-settings/icons";

export const AllReportsView: React.FC<{
  refetch: () => void;
  selectedView: "cards" | "list";
  handleFolderOpen: (id: string) => void;
  reports: {
    isLoading: boolean;
    data: {
      id: string;
      name: string;
      description: string;
      createdDate: string;
      updatedDate: string;
      isFolder?: boolean;
      assetCount?: number;
      reportCount?: number;
    }[];
  };
}> = ({ selectedView, reports, refetch, handleFolderOpen }) => {
  const navigate = useNavigate();
  const deleteReport = useDeleteReport();
  const deleteFolder = useDeleteFolder();
  const updateReport = usePatchReport2();
  const updateFolder = usePatchFolder2();
  const duplicateReport = useDuplicateReport();
  const duplicateFolder = useDuplicateFolder();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedItemForRenaming, setSelectedItemForRenaming] = React.useState<
    string | null
  >(null);

  const handleItemMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const getAnchorElId = () => anchorEl?.getAttribute("id");

  const getAnchorElName = () => anchorEl?.getAttribute("name");

  const handleRename = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    setSelectedItemForRenaming(id);
    setTimeout(() => {
      const element = document.getElementById(`rename-field-${id}`);
      if (element) {
        element.focus();
      }
    }, 100);
  };

  const handleRenameEnter = (id: string, type: "report" | "folder") => {
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
          },
        },
      );
    } else {
      updateReport.mutate(
        { id, name },
        {
          onSuccess: () => {
            setSelectedItemForRenaming(null);
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
    if (isFolder) {
      duplicateFolder.mutate(id, {
        onSuccess: () => refetch(),
      });
    } else {
      duplicateReport.mutate(id, {
        onSuccess: () => refetch(),
      });
    }
  };

  const handleDelete = () => {
    const id = getAnchorElId();
    const isFolder = getAnchorElName() === "folder";
    if (!id) return;
    setAnchorEl(null);
    if (isFolder) {
      deleteFolder.mutate(id, {
        onSuccess: () => refetch(),
      });
    } else {
      deleteReport.mutate(id, {
        onSuccess: () => refetch(),
      });
    }
  };

  const handleItemClick = (id: string, type: "report" | "folder") => () => {
    if (type === "folder") {
      handleFolderOpen(id);
    } else {
      navigate(`/report-builder/reports/${id}`);
    }
  };

  const handleEditClick = (id: string) => () => {
    navigate(`/report-builder/reports/${id}/edit`);
  };

  const handleTableCellClick = (_e: UIEvent, cell: CellComponent) => {
    const id = cell.getRow().getData()?.id;
    const type = cell.getRow().getData()?.type;
    if (id) handleItemClick(id, type === "Folder" ? "folder" : "report")();
  };

  const view = React.useMemo(() => {
    if (reports.isLoading) {
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
    if (selectedView === "cards") {
      return (
        <Grid container columnSpacing={2} rowSpacing={6}>
          {reports.data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
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
                  <ReportCard
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    createdDate={item.createdDate}
                    updatedDate={item.updatedDate}
                    selectedItemForRenaming={selectedItemForRenaming}
                    setSelectedItemForRenaming={setSelectedItemForRenaming}
                    handleRenameEnter={handleRenameEnter}
                    handleItemMenuClick={handleItemMenuClick}
                    handleItemClick={handleItemClick}
                    handleEditClick={handleEditClick}
                  />
                )}
                {item.isFolder && (
                  <FolderCard
                    id={item.id}
                    name={item.name}
                    assetCount={item.assetCount ?? 0}
                    reportCount={item.reportCount ?? 0}
                    createdDate={item.createdDate}
                    updatedDate={item.updatedDate}
                    selectedItemForRenaming={selectedItemForRenaming}
                    setSelectedItemForRenaming={setSelectedItemForRenaming}
                    handleRenameEnter={handleRenameEnter}
                    handleItemMenuClick={handleItemMenuClick}
                    handleItemClick={handleItemClick}
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
                label: "Rename",
                icon: <Pencil />,
                onClick: handleRename,
              },
              {
                label: "Share",
                icon: <Share />,
                onClick: handleClose,
                disabled: true,
              },
              {
                label: "Move to Folder",
                icon: <Folder />,
                onClick: handleClose,
                disabled: true,
              },
              {
                label: "Duplicate",
                icon: <Copy />,
                onClick: handleDuplicate,
              },
              {
                label: "Details",
                icon: <Details />,
                onClick: handleClose,
                disabled: true,
              },
              {
                label: "Delete",
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
        data={reports.data.map((item) => {
          const cdate = new Date(item.createdDate);
          const edate = new Date(item.updatedDate);
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.isFolder ? "Folder" : "Report",
            dateCreated: `${cdate.getDate()}-${cdate.getMonth() + 1}-${cdate.getFullYear()}`,
            dateEdited: `${edate.getDate()}-${edate.getMonth() + 1}-${edate.getFullYear()}`,
          };
        })}
        columns={[
          { title: "", field: "id", visible: false },
          {
            title: "Name",
            field: "name",
            width: "30%",
            cellClick: handleTableCellClick,
            formatter: (cell) =>
              `<u style="color: #3154F4;">${cell.getValue()}</u>`,
          },
          { title: "Description", field: "description", width: "40%" },
          { title: "Type", field: "type", width: "10%" },
          { title: "Date Created", field: "dateCreated", width: "10%" },
          { title: "Last Edited", field: "dateEdited", width: "10%" },
        ]}
      />
    );
  }, [selectedView, reports, anchorEl, selectedItemForRenaming]);

  return view;
};
