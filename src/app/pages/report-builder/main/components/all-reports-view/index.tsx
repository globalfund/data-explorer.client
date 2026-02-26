import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Table } from "app/components/table";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import { useGetReports } from "app/hooks/queries/report-builder";
import { Link } from "react-router-dom";

export const AllReportsView: React.FC<{
  selectedView: "cards" | "list";
}> = ({ selectedView }) => {
  const reportsQuery = useGetReports();
  const reports = reportsQuery?.data?.data || [];
  const view = React.useMemo(() => {
    if (selectedView === "cards") {
      return (
        <Grid container spacing={2}>
          {reports.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item.id}
              component={Link}
              to={`/report-builder/reports/${item.id}`}
            >
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
                <img
                  src={"/static/images/example-report-1.png"}
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
                <IconButton sx={{ padding: 0, marginLeft: "10px" }}>
                  <MoreVert />
                </IconButton>
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
        data={reports.map((item) => ({
          id: item.id ?? "",
          name: item.name,
          description: item.description,
          dateCreated: item.createdDate ?? "",
          dateEdited: item.updatedDate ?? "",
        }))}
        columns={[
          { title: "Report name", field: "name", width: "30%" },
          { title: "Description", field: "description", width: "40%" },
          { title: "Date Created", field: "dateCreated", width: "15%" },
          { title: "Last Edited", field: "dateEdited", width: "15%" },
        ]}
      />
    );
  }, [selectedView, reports]);

  return view;
};
