import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Table } from "app/components/table";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { CellComponent } from "tabulator-tables";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import { ReportBuilderItemMenu } from "app/pages/report-builder/main/components/item-menu";
import {
  useDeleteReport,
  useDuplicateReport,
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
}> = ({ selectedView, reports, refetch }) => {
  const navigate = useNavigate();
  const deleteReport = useDeleteReport();
  const updateReport = usePatchReport2();
  const duplicateReport = useDuplicateReport();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedItemForRenaming, setSelectedItemForRenaming] = React.useState<
    string | null
  >(null);

  const handleItemMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const getAnchorElId = () => anchorEl?.getAttribute("id");

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
    duplicateReport.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleDelete = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    deleteReport.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleItemClick = (id: string) => () => {
    navigate(`/report-builder/reports/${id}`);
  };

  const handleEditClick = (id: string) => () => {
    navigate(`/report-builder/reports/${id}/edit`);
  };

  const handleTableCellClick = (_e: UIEvent, cell: CellComponent) => {
    const id = cell.getRow().getData()?.id;
    if (id) handleItemClick(id)();
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
              `<u style="color: #3154F4;">${cell.getValue()}</u>`,
          },
          { title: "Description", field: "description", width: "40%" },
          { title: "Date Created", field: "dateCreated", width: "15%" },
          { title: "Last Edited", field: "dateEdited", width: "15%" },
        ]}
      />
    );
  }, [selectedView, reports, anchorEl, selectedItemForRenaming]);

  return view;
};
