import React from "react";
import { EmptyAssetsView } from "app/pages/report-builder/main/components/all-assets-view/empty";
import { RBAssetModelResponse } from "app/state/api/action-reducers/report-builder/sync";
import {
  useDeleteAsset,
  useDuplicateAsset,
} from "app/hooks/queries/report-builder";
import { useCMSData } from "app/hooks/useCMSData";
import { CellComponent } from "tabulator-tables";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVert from "@mui/icons-material/MoreVert";
import { ReportBuilderItemMenu } from "../item-menu";
import { Table } from "app/components/table";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import ColumnIcon from "app/assets/vectors/RBColumn.svg?react";
import LetterTextIcon from "app/assets/vectors/Letter_Text.svg?react";
import GridIcon from "app/assets/vectors/RBGrid.svg?react";
import ImageIcon from "app/assets/vectors/RBImage.svg?react";
import { getCMSDataField } from "app/utils/getCMSDataField";

import {
  Copy,
  Share,
  Folder,
  Settings,
  Backspace,
} from "app/pages/report-builder/builder/components/report-settings/icons";
import { capitalize } from "lodash";

export const AllAssetsView: React.FC<{
  selectedView: "cards" | "list";
  assets: {
    isLoading: boolean;
    data: RBAssetModelResponse[];
  };
  refetch: () => void;
}> = ({ selectedView, assets, refetch }) => {
  const deleteAsset = useDeleteAsset();
  const duplicateAsset = useDuplicateAsset();
  const cmsData = useCMSData({ returnData: true });

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleItemMenuClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const getAnchorElId = () => anchorEl?.getAttribute("id");

  const handleDuplicate = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    duplicateAsset.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleDelete = () => {
    const id = getAnchorElId();
    if (!id) return;
    setAnchorEl(null);
    deleteAsset.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleItemClick = (id: string) => () => {
    console.log("Clicked asset with id:", id);
  };

  const handleTableCellClick = (_e: UIEvent, cell: CellComponent) => {
    const id = cell.getRow().getData()?.id;
    if (id) handleItemClick(id)();
  };

  const iconMap: Record<string, React.ReactNode> = {
    chart: <ChartIcon />,
    column: <ColumnIcon />,
    text: <LetterTextIcon />,
    grid: <GridIcon />,
    image: <ImageIcon />,
  };

  const view = React.useMemo(() => {
    if (!assets.data || assets.data.length === 0) {
      return <EmptyAssetsView />;
    }
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
    if (selectedView === "cards") {
      return (
        <Grid container spacing={2}>
          {assets.data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                }}
                onClick={handleItemClick(item.id)}
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
                <Box
                  sx={{
                    borderRadius: "4px",
                    background: "#D6DDFD",
                    gap: "4px",
                    alignItems: "center",
                    padding: "3px 5.5px",
                    display: "flex",
                  }}
                >
                  {iconMap[item.type]}
                  <Typography variant="body2" fontSize={"16px"}>
                    {capitalize(item.type)}
                  </Typography>
                </Box>
                <IconButton
                  id={item.id}
                  onClick={handleItemMenuClick}
                  sx={{ padding: 0, marginLeft: "10px" }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
              <Typography
                variant="h6"
                fontSize="16px"
                lineHeight="normal"
                sx={{ cursor: "pointer" }}
                onClick={handleItemClick(item.id)}
              >
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                width="calc(100% - 40px)"
                sx={{ cursor: "pointer" }}
                onClick={handleItemClick(item.id!)}
              >
                {item.description}
              </Typography>
            </Grid>
          ))}
          <ReportBuilderItemMenu
            anchorEl={anchorEl}
            handleClose={handleClose}
            menuItems={[
              {
                label: getCMSDataField(
                  cmsData,
                  "pagesReportBuilderMain.settingsMenuItem",
                  "Settings",
                ),
                icon: <Settings />,
                onClick: handleClose,
                disabled: true,
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
                onClick: handleClose,
                disabled: true,
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
            type: item.type,
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
              `<u style="color: #3154F4;">${cell.getValue()}</u>`,
          },

          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.descriptionColumn",
              "Description",
            ),
            field: "description",
            width: "40%",
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
            width: "15%",
          },
          {
            title: getCMSDataField(
              cmsData,
              "pagesReportBuilderMain.lastEditedColumn",
              "Last Edited",
            ),
            field: "dateEdited",
            width: "15%",
          },
        ]}
      />
    );
  }, [selectedView, assets, anchorEl, cmsData]);

  return view;
};
