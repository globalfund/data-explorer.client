import Mapping from "../mapping";
import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import ControlAccordion from "../../components/accordion";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

const DataSettings = () => {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const { selectedItem: item } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const filters = item?.data?.appliedFilters || {};

  const handleEditFilters = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        chart: {
          listToDisplay: "dataset",
          datasetModalStep: "preview",
        },
      },
    });
  };
  return (
    <Box
      sx={{
        maxHeight: "450px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ControlAccordion title="Mapping">
        <Mapping />
      </ControlAccordion>
      <ControlAccordion title="Filter">
        <Box
          sx={{
            gap: "10px",
            p: "8px",
            pt: "2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {Object.values(filters).flat().length > 0 ? (
              <>
                <Box sx={{ width: "1px", height: 20, bgcolor: "#cfd4da" }} />
                <Typography fontSize="14px" color="#3154F4">
                  {Object.values(filters).flat().length} Filter
                  {Object.values(filters).flat().length > 1 ? "s" : ""} active
                </Typography>
              </>
            ) : (
              <Typography fontSize="14px" color="#373D43">
                No filters active.
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleEditFilters}
            sx={{
              px: "12px",
              py: "9px",
              height: "35px",
              color: "#000",
              fontSize: "14px",
              fontWeight: 400,
              borderRadius: "4px",
              textTransform: "none",
              borderColor: "#98A1AA",
              bgcolor: "#fff",
              ".MuiButton-startIcon": {
                mr: "5px",
              },
              "&:hover": {
                borderColor: "#3154F4",
                bgcolor: "#fff",
              },
            }}
          >
            {Object.values(filters).flat().length > 0
              ? "Edit Filters"
              : "Add Filter"}
          </Button>
        </Box>
      </ControlAccordion>
      <ControlAccordion title="Sort">
        <Box sx={{ padding: "8px" }}>No sort applied.</Box>
      </ControlAccordion>
    </Box>
  );
};

export default DataSettings;
