import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { datasetItems } from "../../../../../chart/data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import FullscreenIcon from "app/assets/vectors/TableToolbarFullscreen.svg?react";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export default function DatasetList() {
  const [selectedDatasetId, setSelectedDatasetId] = React.useState<string>("");
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });
  const selectedDataset = datasetItems.find(
    (item) => item.id === selectedDatasetId,
  );

  const handleSelectDataset = (id: string) => {
    setSelectedDatasetId(id);
  };

  const handleApply = () => {
    if (!selectedItem || !selectedDataset) return;
    const datasetUnchanged =
      selectedItem?.data?.dataset === selectedDataset?.id;
    editItem({
      ...selectedItem,
      id: selectedController?.id || "",
      type: "chart",
      data: {
        ...selectedItem?.data,
        dataset: selectedDataset?.id,
        mapping: datasetUnchanged ? selectedItem?.data?.mapping : {},
        appliedFilters: datasetUnchanged
          ? selectedItem?.data?.appliedFilters
          : {},
      },
    });
    handleBack();
  };

  const handleBack = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController?.extra,
        chart: {
          listToDisplay: null,
        },
      },
    });
  };

  const handleExpandDataset =
    (datasetId: string) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setSelectedController({
        ...selectedController!,
        extra: {
          ...selectedController?.extra,
          chart: {
            listToDisplay: null,
            showDatasetTable: {
              datasetId: datasetId.toString() || "",
              open: true,
            },
          },
        },
      });
    };

  const datasetsLatestUpdate = useStoreState(
    (state) =>
      get(state.datasetsLatestUpdate, "data.data", []) as {
        name: string;
        date: string;
      }[],
  );

  const getDatasetLatestUpdate = (id: string) => {
    let key = "";
    switch (id) {
      case "gf_results":
        key = "results";
        break;
      case "gf_pledges_contributions":
        key = "pledges-contributions";
        break;
      case "gf_eligibility":
        key = "eligibility";
        break;
      case "gf_allocations":
        key = "allocations";
        break;
      case "gf_grant_implementation":
        key = "grants";
        break;
      case "gf_grant_commitments":
        key = "commitments";
        break;
      case "gf_grant_disbursements":
        key = "disbursements";
        break;
    }
    if (!key) {
      return "";
    }
    return get(
      datasetsLatestUpdate.find((dataset) => dataset.name === key),
      "date",
      "",
    );
  };

  const selectedId = selectedDatasetId || selectedItem?.data?.dataset;
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexDirection: "column",
        padding: "8px",
        paddingBottom: "0px",
        maxHeight: "600px",
      }}
    >
      <Typography color="#000" fontSize="14px">
        Select Dataset
      </Typography>
      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingRight: "4px",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#000",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#D9D9D9",
          },
        }}
      >
        {datasetItems.map((item) => (
          <Box
            onClick={() => handleSelectDataset(item.id)}
            key={item.id}
            sx={{
              gap: "8px",
              width: "100%",
              padding: "8px",
              display: "flex",
              cursor: "pointer",
              borderRadius: "5px",
              flexDirection: "column",
              border: "1px solid #adb5bd",
              bgcolor: item.id === selectedId ? "#EFF1FE" : "transparent",
              borderColor: item.id === selectedId ? "#3154F4" : "#ADB5BD",
            }}
          >
            <Box
              sx={{
                gap: "8px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                fontSize="14px"
                fontWeight="700"
                color="#000"
              >
                {item.name}
              </Typography>
              <Typography fontSize="14px" color="#373D43">
                {item.description}
              </Typography>
              <Box
                sx={{
                  gap: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  button: {
                    fontSize: "16px",
                    padding: "2px 8px",
                    textTransform: "none",
                  },
                }}
              >
                <Typography fontSize="14px" color="#373D43">
                  {" "}
                  Updated on {getDatasetLatestUpdate(item.id)}
                </Typography>
                <IconButton
                  onClick={handleExpandDataset(item.id)}
                  sx={{
                    width: "40px",
                    height: "35px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #CFD4DA",
                  }}
                >
                  <FullscreenIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Divider sx={{ borderRadius: "4px", border: "0.5px solid #98A1AA" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          position: "sticky",
          bottom: 0,
          background: "#F8F9FA",
        }}
      >
        <Button
          onClick={() => handleBack()}
          sx={{
            width: "71px",
            height: "35px",
            borderRadius: "4px",
            border: "1px solid #CFD4DA",
            bgcolor: "#fff",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            textTransform: "none",
          }}
        >
          Back
        </Button>
        <Button
          disabled={!selectedDataset}
          onClick={handleApply}
          sx={{
            width: "71px",
            height: "35px",
            borderRadius: "4px",
            bgcolor: "#3154F4",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            textTransform: "none",
            //disabled styles
            "&.Mui-disabled": {
              color: "#FFFFFF",
              cursor: "not-allowed",
            },
          }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
}
