import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Table } from "app/components/table";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { CellComponent } from "tabulator-tables";
import { renderToString } from "react-dom/server";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import { ReportBuilderItemMenu } from "app/pages/report-builder/main/components/item-menu";
import {
  usePatchReport2,
  useDuplicateReport,
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
  onDeleteReport: (id: string, name: string) => void;
  onDetailsClick: (details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
  }) => void;
  reports: {
    isLoading: boolean;
    data: {
      id: string;
      name: string;
      description: string;
      createdDate: string;
      updatedDate: string;
    }[];
  };
}> = ({ selectedView, reports, refetch, onDeleteReport, onDetailsClick }) => {
  const navigate = useNavigate();
  const updateReport = usePatchReport2();
  const duplicateReport = useDuplicateReport();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [anchorElTableId, setAnchorElTableId] = React.useState<string | null>(
    null,
  );
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

  const handleRenameEnter = (id: string) => {
    const name = (
      document.getElementById(`rename-field-${id}`) as HTMLInputElement
    )?.value;
    if (!name) {
      setSelectedItemForRenaming(null);
      return;
    }
    updateReport.mutate(
      { id, name },
      {
        onSuccess: () => {
          setSelectedItemForRenaming(null);
        },
      },
    );
  };

  const handleDuplicate = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    duplicateReport.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleDelete = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    onDeleteReport(id, reports.data.find((r) => r.id === id)?.name || "");
  };

  const handleDetailsClick = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    setAnchorElTableId(null);
    const report = reports.data.find((r) => r.id === id);
    if (report) {
      onDetailsClick(report);
    }
  };

  const handleItemClick = (id: string) => () => {
    navigate(`/report-builder/reports/${id}`);
  };

  const handleEditClick = (id: string) => () => {
    navigate(`/report-builder/reports/${id}/edit`);
  };

  const handleTableCellClick = (_e: UIEvent, cell: CellComponent) => {
    const id = cell.getRow().getData()?.id;
    if (id && !selectedItemForRenaming) handleItemClick(id)();
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
    updateReport.mutate(
      { id, name },
      {
        onSuccess: () => {
          setSelectedItemForRenaming(null);
        },
      },
    );
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item.id}
              sx={{
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
                    cursor: "pointer",
                    borderRadius: "2px",
                    justifyContent: "center",
                    border: "1px solid #cfd4da",
                    div: {
                      width: "calc(100% - 10px)",
                      backgroundImage: `url(${import.meta.env.VITE_API}/report-thumbnail/${item.id}.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                    },
                  }}
                  onClick={handleItemClick(item.id)}
                >
                  <div />
                </Box>
                <Box
                  sx={{
                    margin: "10px 0 5px 0",
                  }}
                >
                  {selectedItemForRenaming === item.id ? (
                    <TextField
                      fullWidth
                      autoFocus
                      size="small"
                      variant="standard"
                      defaultValue={item.name}
                      id={`rename-field-${item.id}`}
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                      onBlur={(e) => {
                        if (e.relatedTarget?.id === "rb-item-menu-paper") {
                          return;
                        }
                        handleRenameEnter(item.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setSelectedItemForRenaming(null);
                        }
                        if (e.key === "Enter") {
                          handleRenameEnter(item.id);
                        }
                      }}
                      sx={{
                        input: {
                          fontWeight: "700",
                          pl: "0 !important",
                        },
                        ".MuiInputBase-root:before, .MuiInputBase-root:after": {
                          borderBottom: "2px solid #3154F4 !important",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      fontSize="16px"
                      lineHeight="normal"
                      sx={{ cursor: "pointer" }}
                      onClick={handleItemClick(item.id)}
                    >
                      {item.name}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  width="calc(100% - 40px)"
                  sx={{ cursor: "pointer" }}
                  onClick={handleItemClick(item.id)}
                >
                  {item.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  gap: "10px",
                  width: "100%",
                  display: "flex",
                  marginTop: "12px",
                  alignItems: "center",
                  "> button:not(:last-child)": {
                    flex: "1",
                    fontSize: "14px",
                    bgcolor: "#fff",
                    fontWeight: "400",
                    height: "36px",
                    borderRadius: "4px",
                    lineHeight: "normal",
                    textTransform: "none",
                    border: "1px solid #98a1aa",
                  },
                }}
              >
                <Button onClick={handleEditClick(item.id)}>Edit</Button>
                <Button onClick={handleItemClick(item.id)}>Preview</Button>
                <IconButton id={item.id} onClick={handleItemMenuClick}>
                  <MoreVert />
                </IconButton>
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
                onClick: handleDetailsClick,
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
      <React.Fragment>
        <Table
          id="reports-table"
          data={reports.data.map((item) => {
            const cdate = new Date(item.createdDate);
            const edate = new Date(item.updatedDate);
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              dateCreated: `${cdate.getDate()}-${cdate.getMonth() + 1}-${cdate.getFullYear()}`,
              dateEdited: `${edate.getDate()}-${edate.getMonth() + 1}-${edate.getFullYear()}`,
            };
          })}
          columns={[
            { title: "", field: "id", visible: false },
            {
              title: "Report name",
              field: "name",
              width: "30%",
              cellClick: handleTableCellClick,
              formatter: (cell) =>
                renderToString(
                  selectedItemForRenaming === cell.getRow().getData()?.id ? (
                    <input
                      type="text"
                      defaultValue={cell.getValue()}
                      name="reports-table-cell-input"
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
            { title: "Description", field: "description", width: "30%" },
            { title: "Date Created", field: "dateCreated", width: "15%" },
            { title: "Last Edited", field: "dateEdited", width: "15%" },
            {
              title: "Actions",
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
      </React.Fragment>
    );
  }, [selectedView, reports, anchorEl, selectedItemForRenaming]);

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
            label: "Rename",
            icon: <Pencil />,
            onClick: handleRename,
          },
          {
            label: "Share",
            icon: <Share />,
            onClick: handleCloseTable,
            disabled: true,
          },
          {
            label: "Move to Folder",
            icon: <Folder />,
            onClick: handleCloseTable,
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
            onClick: handleCloseTable,
            disabled: true,
          },
          {
            label: "Delete",
            icon: <Backspace />,
            onClick: handleDelete,
          },
        ]}
      />
    </React.Fragment>
  );
};
