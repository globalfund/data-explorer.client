import Mapping from "../mapping";
import React from "react";
import Filtering from "../filtering";
import AddIcon from "@mui/icons-material/Add";
import ControlAccordion from "../../components/accordion";
import { Box } from "@mui/system";
import LimitToTopN from "../limit-to-top-n";
import { Button, Typography } from "@mui/material";
import { useStoreState } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

const DataSettings = () => {
  const [isFiltering, setIsFiltering] = React.useState(false);
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const filters = item?.data?.appliedFilters || {};

  const handleEditFilters = () => {
    setIsFiltering(true);
  };

  if (isFiltering) {
    return (
      <Filtering
        key={`${selectedController?.id}:${item?.data?.dataset}`}
        onBack={() => setIsFiltering(false)}
      />
    );
  }

  const handleClearFilters = () => {
    if (!item) return;
    editItem({
      ...item,
      id: item.id || "",
      type: "chart",
      data: {
        ...item.data,
        appliedFilters: {},
      },
    });
  };

  const linkButtonSx = {
    p: 0,
    minWidth: 0,
    color: "#3154F4",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    textTransform: "none",
    textDecoration: "underline",
    "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
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
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              width: "100%",
            }}
          >
            {Object.values(filters).flat().length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography fontSize="14px">
                  {Object.values(filters).flat().length} filter(s) active
                </Typography>
                <Button onClick={handleClearFilters} sx={linkButtonSx}>
                  Clear all
                </Button>
              </Box>
            ) : (
              <Typography fontSize="14px" color="#373D43">
                No filters active.
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
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
              width: "100%",
            }}
          >
            {" "}
            {Object.values(filters).flat().length > 0
              ? "Manage Filters"
              : "Add Filter"}
          </Button>
        </Box>
      </ControlAccordion>
      <ControlAccordion title="Sort">
        <Box sx={{ padding: "8px" }}>No sort applied.</Box>
      </ControlAccordion>
      <LimitToTopN />
    </Box>
  );
};

export default DataSettings;
