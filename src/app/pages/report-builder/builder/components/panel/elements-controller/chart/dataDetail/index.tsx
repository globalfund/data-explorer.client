import { Box, Button, IconButton, Typography } from "@mui/material";
import MinimizeIcon from "app/assets/vectors/Minimize.svg?react";
import MaximizeIcon from "app/assets/vectors/Maximize.svg?react";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Link } from "react-router-dom";
import { Table } from "app/components/table";

import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { datasetItems } from "../../../../chart/data";

import {
  useGFDataset,
  useGFSampleDataset,
} from "app/hooks/queries/report-builder";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export default function DataDetail(props: Readonly<{ datasetId: string }>) {
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find(
    (i) => i.id === selectedController?.id,
  ) as ReportItemOf<"chart">;

  const datasetDetail = datasetItems.find(
    (dataset) => dataset.id === props.datasetId,
  );

  const sampledDatasetQuery = useGFSampleDataset(props.datasetId);
  const sampledDataset = sampledDatasetQuery?.data?.data?.data?.result;

  const loadDataset = useGFDataset(props.datasetId);
  const loadedDataset = React.useMemo(() => {
    return loadDataset?.data?.pages
      .map((page) => page?.data?.data?.result?.data || [])
      .flat();
  }, [loadDataset]);

  const columns = React.useMemo(() => {
    if (!sampledDataset) return [];
    return sampledDataset.stats?.map((stat) => ({
      title: stat.name,
      field: stat.name,
    }));
  }, [sampledDataset]);

  const handleHideTable = () => {
    setSelectedController({
      ...selectedController!,
      extra: {
        ...selectedController?.extra,
        chart: {
          listToDisplay: "dataset",
          showDatasetTable: {
            datasetId: "",
            open: false,
          },
        },
      },
    });
  };
  const handleBack = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController?.extra,
        chart: {
          listToDisplay: null,
          showDatasetTable: {
            datasetId: "",
            open: false,
          },
        },
      },
    });
  };

  const handleApply = () => {
    if (!item || !props.datasetId) return;
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      data: {
        ...item?.data,
        dataset: props.datasetId,
        mapping:
          item?.data?.dataset === props.datasetId ? item?.data?.mapping : {},
      },
    });
    handleBack();
  };

  const handleCloseModal = () => {
    setSelectedController({
      ...selectedController!,
      open: false,
      extra: {
        ...selectedController?.extra,
        chart: {
          listToDisplay: null,
          showDatasetTable: {
            datasetId: "",
            open: false,
          },
        },
      },
    });
  };
  const isExpanded = true;

  return (
    <Box
      sx={{
        padding: "8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
        borderRadius: "4px",
        border: "0.5px solid #98A1AA",
        width: "97.5vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          borderBottom: "0.5px solid #CFD4DA",
        }}
      >
        <Typography fontSize={"16px"} fontWeight={700}>
          {datasetDetail?.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            ".MuiIconButton-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: "4px",
              border: "1px solid #CFD4DA",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <Button
            onClick={() => handleApply()}
            sx={{
              backgroundColor: "#3154F4",
              color: "#FFFFFF",
              fontSize: "14px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "35px",
              width: "134px",
              borderRadius: "4px",
              fontWeight: 400,
            }}
          >
            Use this Dataset
          </Button>
          <IconButton onClick={() => handleHideTable()}>
            {isExpanded ? <MinimizeIcon /> : <MaximizeIcon />}
          </IconButton>
          <IconButton onClick={() => handleCloseModal()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box mb={"16px"}>
        <Typography
          my={"8px"}
          color={"#161616)"}
          fontSize={"14px"}
          fontWeight={700}
        >
          Description
        </Typography>
        <Typography color={"#161616)"} fontSize={"14px"}>
          {datasetDetail?.description}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          paddingBottom: "8px",
          borderBottom: "0.5px solid #CFD4DA",
        }}
      >
        <Box
          sx={{
            flexBasis: "50%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography color={"#161616)"} fontSize={"14px"} fontWeight={700}>
            Source of the Data
          </Typography>
          <Typography color={"#161616)"} fontSize={"14px"}>
            The Global Fund to Fight AIDS, Tuberculosis and Malaria
          </Typography>
        </Box>

        <Box
          sx={{
            flexBasis: "50%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography color={"#161616)"} fontSize={"14px"} fontWeight={700}>
            Source Link
          </Typography>
          <Link
            to="https://data-service.theglobalfund.org/downloads"
            style={{
              color: "#3154F4",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            https://data-service.theglobalfund.org/downloads
          </Link>
        </Box>
      </Box>

      <Box p={"20px"}>
        <Table
          id="table-data-detail"
          data={loadedDataset || []}
          columns={columns}
          onScrollToBottom={() => {
            loadDataset.fetchNextPage();
          }}
        />
      </Box>
    </Box>
  );
}
