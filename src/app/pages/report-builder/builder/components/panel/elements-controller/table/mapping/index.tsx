import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxCheckedIcon from "app/assets/vectors/Checkbox_checked.svg?react";
import CheckboxIcon from "app/assets/vectors/Checkbox_notchecked.svg?react";
import DatasetFieldCloseIcon from "app/assets/vectors/DatasetFieldClose.svg?react";
import DatasetFieldDateIcon from "app/assets/vectors/DatasetFieldDate.svg?react";
import DatasetFieldNumberIcon from "app/assets/vectors/DatasetFieldNumber.svg?react";
import DatasetFieldTextIcon from "app/assets/vectors/DatasetFieldText.svg?react";
import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import SelectField from "../../components/selectfield";
import TextField from "../../components/textfield";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  getTableOptions,
  normalizeTableColumns,
  TableColumn,
  TableOptions,
} from "app/pages/report-builder/builder/components/table/options";

const accordionSx = {
  m: 0,
  boxShadow: "none",
  bgcolor: "transparent",
  borderRadius: "0px",
  borderBottom: "0.5px solid #CFD4DA",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    m: 0,
  },
};

const accordionSummarySx = {
  px: "8px",
  py: "7px",
  minHeight: "32px",
  "&.Mui-expanded": {
    minHeight: "32px",
  },
  ".MuiAccordionSummary-content": {
    m: 0,
    alignItems: "center",
  },
  ".MuiAccordionSummary-content.Mui-expanded": {
    m: 0,
  },
  ".MuiAccordionSummary-expandIconWrapper": {
    color: "#373D43",
  },
};

const getFieldIcon = (type?: string) => {
  if (type === "number") return DatasetFieldNumberIcon;
  if (type === "date" || type === "date-time") return DatasetFieldDateIcon;
  return DatasetFieldTextIcon;
};

const getChipColor = (type?: string) =>
  type === "number" ? "#0E6027" : "#3154F4";

const TableControlAccordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Accordion defaultExpanded sx={accordionSx}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
      <Typography fontSize="14px" fontWeight={700} color="#000">
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
  </Accordion>
);

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
  const sortOptions = [
    { label: "Select Column", value: "" },
    ...columns.map((column) => ({
      label: column.name,
      value: column.id,
    })),
  ];

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
        },
      },
    });
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#F8F9FA" }}>
      <TableControlAccordion title="Columns">
        <Box
          sx={{
            gap: "8px",
            p: "8px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {columns.map((column, index) => {
            const FieldIcon = getFieldIcon(column.type);

            return (
              <Tooltip key={`${column.id}-${index}`} title={column.name} arrow>
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
          <Button
            variant="outlined"
            onClick={handleEditColumns}
            sx={{
              mt: "2px",
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
      </TableControlAccordion>

      <TableControlAccordion title="Filter">
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
          <Typography fontSize="14px" color="#373D43">
            No filters are active.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
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
            Edit Filters
          </Button>
        </Box>
      </TableControlAccordion>

      <TableControlAccordion title="Sort">
        <Box
          sx={{
            gap: "8px",
            p: "8px",
            pt: "2px",
            display: "flex",
            flexDirection: "column",
            ".MuiButton-root": {
              minHeight: "35px",
              py: "7px",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <Typography
              component="span"
              fontSize="14px"
              color="#373D43"
              sx={{ flexShrink: 0, mt: "8px" }}
            >
              Sort By
            </Typography>
            <Box
              sx={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}
            >
              <SelectField
                value={tableOptions.sortBy}
                options={sortOptions}
                onChange={(value) => updateOptions({ sortBy: value })}
                width="100%"
              />

              <SelectField
                value={tableOptions.sortDirection}
                disabled={!tableOptions.sortBy}
                options={[
                  { label: "Ascending", value: "ascending" },
                  { label: "Descending", value: "descending" },
                ]}
                onChange={(value) => updateOptions({ sortDirection: value })}
                width="100%"
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={tableOptions.limitToTop}
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              onChange={(event) =>
                updateOptions({ limitToTop: event.target.checked })
              }
              sx={{ p: 0, width: 20, height: 20 }}
            />
            <Typography fontSize="14px" color="#000">
              Limit to Top
            </Typography>
            <TextField
              value={tableOptions.limitToTopValue}
              type="number"
              disabled={!tableOptions.limitToTop}
              onChange={(value) => updateOptions({ limitToTopValue: value })}
              width="45px"
              sx={{
                height: "35px",
                px: "10px",
                opacity: tableOptions.limitToTop ? 1 : 0.6,
                input: {
                  p: 0,
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={tableOptions.groupRemainderAsOther}
              disabled={!tableOptions.limitToTop}
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              onChange={(event) =>
                updateOptions({ groupRemainderAsOther: event.target.checked })
              }
              sx={{ p: 0, width: 20, height: 20 }}
            />
            <Typography
              fontSize="14px"
              color={tableOptions.limitToTop ? "#000" : "#ADB5BD"}
            >
              Group remainder as &quot;Other&quot;
            </Typography>
          </Box>
        </Box>
      </TableControlAccordion>
    </Box>
  );
}
