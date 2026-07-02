import React from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import DatasetFieldCloseIcon from "app/assets/vectors/DatasetFieldClose.svg?react";
import DatasetFieldDateIcon from "app/assets/vectors/DatasetFieldDate.svg?react";
import DatasetFieldNumberIcon from "app/assets/vectors/DatasetFieldNumber.svg?react";
import DatasetFieldTextIcon from "app/assets/vectors/DatasetFieldText.svg?react";
import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import TextField from "../../components/textfield";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  getTableOptions,
  normalizeTableColumns,
  TableColumn,
  TableOptions,
} from "app/pages/report-builder/builder/components/table/options";
import Checkfield from "../../components/checkfield";
import ControlAccordion from "../../components/accordion";

const getFieldIcon = (type?: string) => {
  if (type === "number") return DatasetFieldNumberIcon;
  if (type === "date" || type === "date-time") return DatasetFieldDateIcon;
  return DatasetFieldTextIcon;
};

const getChipColor = (type?: string) =>
  type === "number" ? "#0E6027" : "#3154F4";

export default function Mapping() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const { selectedItem, editItem } = useGetReportItemState<"table">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const tableOptions = getTableOptions(selectedItem?.options);
  const columns = normalizeTableColumns(selectedItem?.data?.columns);
  const updateOptions = (options: Partial<TableOptions>) => {
    if (!selectedItem) return;
    editItem({
      ...selectedItem,
      id: selectedController?.id || "",
      type: "table",
      open: selectedItem.open || false,
      options: {
        ...tableOptions,
        ...options,
      },
    });
  };

  const updateColumns = (nextColumns: TableColumn[]) => {
    if (!selectedItem) return;
    const validColumns = nextColumns.length ? nextColumns : columns;
    editItem({
      ...selectedItem,
      id: selectedController?.id || "",
      type: "table",
      open: selectedItem.open || false,
      data: {
        ...selectedItem.data,
        columns: validColumns.map((column) => ({
          id: column.id,
          name: column.name,
          type: column.type || "string",
        })),
      },
    });
  };

  const handleRemoveColumn = (columnId: string, columnIndex: number) => {
    if (columns.length <= 1) return;
    updateColumns(
      columns.filter(
        (column, index) => column.id !== columnId || index !== columnIndex,
      ),
    );
  };

  const handleEditColumns = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController.extra,
        table: {
          ...selectedController.extra?.table,
          showDatasetModal: true,
          datasetModalStep: "view",
        },
      },
    });
  };

  const handleEditFilters = () => {
    if (!selectedController) return;
    setSelectedController({
      ...selectedController,
      extra: {
        ...selectedController.extra,
        table: {
          ...selectedController.extra?.table,
          showDatasetModal: true,
          datasetModalStep: "preview",
        },
      },
    });
  };

  const filters = selectedItem?.data?.filters || {};
  const sorting = selectedItem?.data?.sorting || [];
  const anyFiltersOrSortingActive =
    (sorting && sorting.length > 0) || Object.values(filters).flat().length > 0;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#F8F9FA",
        maxHeight: "500px",
        overflowY: "auto",
      }}
      className="scrollbar"
    >
      <ControlAccordion title="Columns">
        <Box sx={{ p: "8px" }}>
          <Box
            sx={{
              gap: "8px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {columns.map((column, index) => {
              const FieldIcon = getFieldIcon(column.type);

              return (
                <Tooltip
                  key={`${column.id}-${index}`}
                  title={column.name}
                  arrow
                >
                  <Box
                    sx={{
                      gap: "6px",
                      px: "12px",
                      py: "6px",
                      minWidth: 0,
                      color: "#fff",
                      display: "flex",
                      maxWidth: "100%",
                      borderRadius: "6px",
                      alignItems: "center",
                      bgcolor: getChipColor(column.type),
                      svg: {
                        flexShrink: 0,
                      },
                    }}
                  >
                    <FieldIcon />
                    <Typography
                      component="span"
                      fontSize="14px"
                      lineHeight="normal"
                      color="inherit"
                      sx={{
                        minWidth: 0,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {column.name}
                    </Typography>
                    <Box
                      component="button"
                      type="button"
                      aria-label={`Remove ${column.name}`}
                      onClick={() => handleRemoveColumn(column.id, index)}
                      sx={{
                        p: 0,
                        m: 0,
                        width: 14,
                        height: 14,
                        border: 0,
                        display: "flex",
                        color: "#fff",
                        cursor: columns.length <= 1 ? "default" : "pointer",
                        bgcolor: "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: columns.length <= 1 ? 0.45 : 1,
                      }}
                    >
                      <DatasetFieldCloseIcon />
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
          <Button
            variant="outlined"
            onClick={handleEditColumns}
            sx={{
              mt: "8px",
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
              "&:hover": {
                borderColor: "#3154F4",
                bgcolor: "#fff",
              },
            }}
          >
            Edit Columns
          </Button>
        </Box>
      </ControlAccordion>

      <ControlAccordion title="Filter & Sort">
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
            {anyFiltersOrSortingActive ? null : (
              <Typography fontSize="14px" color="#373D43">
                No filters or sort active.
              </Typography>
            )}
            {Object.values(filters).flat().length > 0 ? (
              <>
                <Box sx={{ width: "1px", height: 20, bgcolor: "#cfd4da" }} />
                <Typography fontSize="14px" color="#3154F4">
                  {Object.values(filters).flat().length} Filter
                  {Object.values(filters).flat().length > 1 ? "s" : ""} active
                </Typography>
              </>
            ) : null}
            {sorting && sorting.length > 0 ? (
              <>
                <Box sx={{ width: "1px", height: 20, bgcolor: "#cfd4da" }} />
                <Typography fontSize="14px" color="#3154F4">
                  {sorting.length} sort
                  {sorting.length > 1 ? "s" : ""} applied
                </Typography>
              </>
            ) : null}
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
            {anyFiltersOrSortingActive
              ? "Edit Filters and Sort"
              : "Add Filter and Sort"}
          </Button>
        </Box>
      </ControlAccordion>

      <ControlAccordion title="Limit the Top N">
        <Box
          sx={{
            gap: "8px",
            p: "8px",
            display: "flex",
            flexDirection: "column",
            ".MuiButton-root": {
              minHeight: "35px",
              py: "7px",
            },
            width: "100%",
          }}
        >
          <Checkfield
            checked={tableOptions.limitToTop}
            onChange={(event) =>
              updateOptions({ limitToTop: event.target.checked })
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography fontSize="14px" color="#000">
                  Limit to Top
                </Typography>
                <TextField
                  value={tableOptions.limitToTopValue}
                  type="number"
                  disabled={!tableOptions.limitToTop}
                  onChange={(value) =>
                    updateOptions({ limitToTopValue: value })
                  }
                  width="45px"
                  sx={{
                    height: "35px",
                    px: "5px",
                    opacity: tableOptions.limitToTop ? 1 : 0.6,
                    input: {
                      p: 0,
                      fontSize: "14px",
                    },
                  }}
                />
              </Box>
            }
          />

          <Checkfield
            checked={tableOptions.groupRemainderAsOther}
            disabled={!tableOptions.limitToTop}
            onChange={(event) =>
              updateOptions({ groupRemainderAsOther: event.target.checked })
            }
            label="Group remainder as 'Other'"
          />
        </Box>
      </ControlAccordion>
    </Box>
  );
}
