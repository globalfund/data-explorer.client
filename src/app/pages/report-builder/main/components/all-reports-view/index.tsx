import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Table } from "app/components/table";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import { ReportBuilderItemMenu } from "app/pages/report-builder/main/components/item-menu";
import {
  useGFDeleteReport,
  useGFDuplicateReport,
} from "app/hooks/queries/report-builder";
import {
  Copy,
  Share,
  Pencil,
  Folder,
  Settings,
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
  const deleteReport = useGFDeleteReport();
  const duplicateReport = useGFDuplicateReport();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleItemMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const getAnchorElId = () => anchorEl?.getAttribute("id");

  const handleEdit = () => {
    const id = getAnchorElId();
    if (!id) return;
    navigate(`/report-builder/${id}/edit`);
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
        <Grid container spacing={2}>
          {reports.data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Box
                sx={{
                  width: "100%",
                  height: "180px",
                  display: "flex",
                  paddingTop: "8px",
                  borderRadius: "2px",
                  justifyContent: "center",
                  border: "1px solid #cfd4da",
                }}
              >
                <img
                  src="/static/images/layout-placeholder.png"
                  alt={item.name}
                />
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
                <Typography variant="h6" fontSize="16px" lineHeight="normal">
                  {item.name}
                </Typography>
                <IconButton
                  id={item.id}
                  onClick={handleItemMenuClick}
                  sx={{ padding: 0, marginLeft: "10px" }}
                >
                  <MoreVert />
                </IconButton>
                <ReportBuilderItemMenu
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  menuItems={[
                    {
                      label: "Edit",
                      icon: <Pencil />,
                      onClick: handleEdit,
                    },
                    {
                      label: "Settings",
                      icon: <Settings />,
                      onClick: handleClose,
                      disabled: true,
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
                      label: "Delete",
                      icon: <Backspace />,
                      onClick: handleDelete,
                    },
                  ]}
                />
              </Box>
              <Typography variant="body2" width="calc(100% - 40px)">
                {item.description}
              </Typography>
            </Grid>
          ))}
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
            title: item.name,
            description: item.description,
            dateCreated: `${cdate.getDate()}-${cdate.getMonth() + 1}-${cdate.getFullYear()}`,
            dateEdited: `${edate.getDate()}-${edate.getMonth() + 1}-${edate.getFullYear()}`,
          };
        })}
        columns={[
          { title: "Report name", field: "name", width: "30%" },
          { title: "Description", field: "description", width: "40%" },
          { title: "Date Created", field: "dateCreated", width: "15%" },
          { title: "Last Edited", field: "dateEdited", width: "15%" },
        ]}
      />
    );
  }, [selectedView, reports, anchorEl]);

  return view;
};
