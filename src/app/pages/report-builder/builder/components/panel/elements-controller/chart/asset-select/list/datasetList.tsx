import React from "react";
import { datasetItems } from "../../../../../chart/data";
import Box from "@mui/material/Box";
import { Typography, IconButton, Divider, Button } from "@mui/material";
import FullscreenIcon from "app/assets/vectors/TableToolbarFullscreen.svg?react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

export default function DatasetList() {
  const [selectedDatasetId, setSelectedDatasetId] = React.useState<string>("");
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
  const item = items.find((i) => i.id === selectedController?.id);
  const selectedDataset = datasetItems.find(
    (item) => item.id === selectedDatasetId,
  );
  const handleSelectDataset = (id: string) => {
    setSelectedDatasetId(id);
  };
  const handleApply = () => {
    if (!item || !selectedDataset) return;
    editItem({
      ...item,
      id: selectedController?.id || "",
      type: "chart",
      extra: {
        ...item?.extra,
        chart: {
          ...item?.extra?.chart,
          dataset: selectedDataset?.id,
          mapping:
            item?.extra?.chart?.dataset === selectedDataset?.id
              ? item?.extra?.chart?.mapping
              : {},
        },
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
      console.log(selectedDataset?.id, "expand dataset");
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
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        flexDirection: "column",
        padding: "8px",
      }}
    >
      <Typography color="#000" fontSize="14px">
        Select Dataset
      </Typography>
      <Box
        sx={{
          maxHeight: "65vh",
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
              borderRadius: "5px",
              flexDirection: "column",
              border: "1px solid #adb5bd",
              borderColor:
                item.id === selectedDatasetId ? "#3154F4" : "#ADB5BD",
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
                  Updated on {item.date}
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
          height: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => handleBack()}
          sx={{
            width: "71px",
            height: "100%",
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
            height: "100%",
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
