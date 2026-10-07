import React from "react";
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useStoreState } from "app/state/store/hooks";
import {
  useDatasetFilterOptions,
  useGFSampleDataset,
} from "app/hooks/queries/report-builder";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import BackIcon from "app/assets/vectors/DatasetArrowLeft.svg?react";
import TextIcon from "app/assets/vectors/DatasetFieldText.svg?react";
import NumberIcon from "app/assets/vectors/DatasetFieldNumber.svg?react";
import { getColumnType } from "app/pages/report-builder/builder/components/dataset-select-modal/utils";
import ExpandedFilterGroup from "./expanded-filter-group";
import {
  getFilterValues,
  getMatchingFilterValues,
  searchFilterOptions,
  updateFieldFilter,
} from "./utils";

const linkButtonSx = {
  p: 0,
  minWidth: 0,
  color: "#3154F4",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "20px",
  textTransform: "none",
  textDecoration: "underline",
  "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
};

interface FilteringProps {
  onBack: () => void;
}

export default function Filtering({ onBack }: FilteringProps) {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem: item, editItem } = useGetReportItemState<"chart">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });
  const datasetId = item?.data?.dataset || "";
  const filterOptionsQuery = useDatasetFilterOptions(datasetId);
  const sampledDatasetQuery = useGFSampleDataset(datasetId);
  const dataTypes = sampledDatasetQuery.data?.data.data.result.dataTypes;
  const optionGroups = filterOptionsQuery.data?.data ?? [];
  const appliedFilters = item?.data?.appliedFilters ?? {};
  const hasAppliedFilters = Object.values(appliedFilters).some(
    (values) => values.length > 0,
  );

  const [activeField, setActiveField] = React.useState<string | null>(null);
  const [fieldSearch, setFieldSearch] = React.useState("");
  const [valueSearch, setValueSearch] = React.useState("");
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const activeGroup = optionGroups.find((group) => group.name === activeField);
  const visibleGroups = optionGroups.filter((group) =>
    group.name.toLowerCase().includes(fieldSearch.trim().toLowerCase()),
  );
  const allValues = getFilterValues(activeGroup?.options ?? []);
  const visibleOptions = searchFilterOptions(
    activeGroup?.options ?? [],
    valueSearch,
  );
  const visibleValues = getMatchingFilterValues(
    activeGroup?.options ?? [],
    valueSearch,
  );

  const handleBack = () => {
    if (activeField !== null) {
      setActiveField(null);
      setValueSearch("");
      setSelectedValues([]);
    } else {
      onBack();
    }
  };

  const handleApply = () => {
    if (!item || !activeGroup) return;
    editItem({
      ...item,
      data: {
        ...item.data,
        appliedFilters: updateFieldFilter(
          appliedFilters,
          activeGroup.name,
          selectedValues,
        ),
      },
    });
    onBack();
  };

  const title =
    activeField !== null
      ? `Filter: ${activeField}`
      : `${hasAppliedFilters ? "Edit" : "Add"} filter — choose field`;

  return (
    <Box sx={{ width: "100%", minWidth: 0, bgcolor: "#F8F9FA" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minHeight: "40px",
          px: "8px",
          borderBottom: "0.5px solid #CFD4DA",
        }}
      >
        <IconButton
          onClick={handleBack}
          aria-label={
            activeField !== null
              ? "Back to filter fields"
              : "Back to data settings"
          }
          sx={{ p: "4px", ml: "-4px", color: "#373D43" }}
        >
          <BackIcon width={12} height={12} />
        </IconButton>
        <Typography
          component="h3"
          fontSize="14px"
          fontWeight={700}
          lineHeight="20px"
          color="#373D43"
          sx={{ py: "8px", overflowWrap: "anywhere" }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          p: activeField !== null ? "16px 8px" : "8px",
          display: "flex",
          flexDirection: "column",
          gap: activeField !== null ? "16px" : "8px",
        }}
      >
        <TextField
          key={activeField ?? "fields"}
          autoFocus
          fullWidth
          size="small"
          value={activeField !== null ? valueSearch : fieldSearch}
          placeholder={
            activeField !== null ? "Search values..." : "Search fields..."
          }
          onChange={(event) =>
            activeField !== null
              ? setValueSearch(event.target.value)
              : setFieldSearch(event.target.value)
          }
          slotProps={{
            htmlInput: {
              "aria-label":
                activeField !== null
                  ? "Search filter values"
                  : "Search filter fields",
            },
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: "4px" }}>
                  <SearchIcon width={16} height={16} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "30px",
              px: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              bgcolor: "#fff",
              "& fieldset": { border: "0.5px solid #98A1AA" },
              "&:hover fieldset": { borderColor: "#98A1AA" },
              "&.Mui-focused fieldset": {
                borderColor: "#3154F4",
                borderWidth: "1px",
              },
            },
            "& .MuiInputBase-input": {
              p: 0,
              "&::placeholder": { color: "#7E868F", opacity: 1 },
            },
          }}
        />

        {filterOptionsQuery.isPending ? (
          <Typography
            role="status"
            sx={{ p: "8px", fontSize: "14px", color: "#7E868F" }}
          >
            Loading filter fields...
          </Typography>
        ) : filterOptionsQuery.isError ? (
          <Box role="alert" sx={{ p: "8px" }}>
            <Typography fontSize="14px" color="#373D43">
              Unable to load filter fields.
            </Typography>
            <Button
              onClick={() => filterOptionsQuery.refetch()}
              sx={linkButtonSx}
            >
              Try again
            </Button>
          </Box>
        ) : activeField === null ? (
          <Box
            sx={{ px: "8px", maxHeight: "360px", overflowY: "auto" }}
            className="scrollbar"
          >
            {visibleGroups.length ? (
              visibleGroups.map((group) => {
                const numeric =
                  getColumnType(dataTypes?.[group.name]) === "number";
                const count = getFilterValues(group.options).length;
                return (
                  <ButtonBase
                    key={group.name}
                    onClick={() => {
                      setSelectedValues([
                        ...(appliedFilters[group.name] ?? []),
                      ]);
                      setValueSearch("");
                      setActiveField(group.name);
                    }}
                    sx={{
                      width: "100%",
                      minHeight: "40px",
                      display: "flex",
                      gap: "8px",
                      py: "8px",
                      textAlign: "left",
                      color: "#000",
                      borderTop: "0.5px solid #DFE3E5",
                      "&:hover, &.Mui-focusVisible": { bgcolor: "#EFF1FE" },
                    }}
                  >
                    <Box
                      sx={{
                        width: "16px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {numeric ? <NumberIcon /> : <TextIcon />}
                    </Box>
                    <Typography
                      fontSize="14px"
                      sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}
                    >
                      {group.name}
                    </Typography>
                    <Typography
                      fontSize="12px"
                      color="#7E868F"
                      sx={{
                        flexShrink: 0,
                        span: {
                          color: "#3154F4",
                        },
                      }}
                    >
                      <span>
                        {appliedFilters?.[group.name]?.length
                          ? `${appliedFilters?.[group.name]?.length} selected`
                          : ""}
                      </span>
                      ⋅
                      {numeric
                        ? "numeric"
                        : `${count} ${count === 1 ? "value" : "values"}`}
                    </Typography>
                  </ButtonBase>
                );
              })
            ) : (
              <Typography
                role="status"
                sx={{ py: "8px", fontSize: "14px", color: "#7E868F" }}
              >
                {fieldSearch.trim()
                  ? "No fields found."
                  : "No filter fields available."}
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography
                aria-live="polite"
                fontSize="12px"
                color="#495057"
                sx={{ mr: "auto" }}
              >
                <Box component="span" sx={{ color: "#3154F4" }}>
                  {selectedValues.length}
                </Box>{" "}
                of {allValues.length} selected
              </Typography>
              {selectedValues.length > 0 && (
                <Button onClick={() => setSelectedValues([])} sx={linkButtonSx}>
                  Clear
                </Button>
              )}
              <Button
                disabled={visibleValues.length === 0}
                onClick={() =>
                  setSelectedValues((previous) =>
                    Array.from(new Set([...previous, ...visibleValues])),
                  )
                }
                sx={linkButtonSx}
              >
                Select all
              </Button>
            </Box>
            <Box
              sx={{
                px: "16px",
                maxHeight: "288px",
                overflowY: "auto",
                border: "0.5px solid #DFE3E5",
                borderRadius: "4px",
              }}
              className="scrollbar"
            >
              {visibleOptions.length ? (
                <ExpandedFilterGroup
                  key={`${activeField}:${valueSearch.trim().toLowerCase()}`}
                  name={activeField}
                  options={visibleOptions}
                  selectedFilters={selectedValues}
                  setSelectedFilters={setSelectedValues}
                  expandSearchResults={Boolean(valueSearch.trim())}
                />
              ) : (
                <Typography
                  role="status"
                  sx={{ py: "12px", fontSize: "14px", color: "#7E868F" }}
                >
                  {valueSearch.trim()
                    ? "No values found."
                    : "No values available."}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              fullWidth
              disabled={!activeGroup}
              onClick={handleApply}
              sx={{
                height: "35px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#000",
                bgcolor: "#fff",
                textTransform: "none",
                border: "0.5px solid #98A1AA",
                borderRadius: "4px",
                "&:hover": { bgcolor: "#fff", borderColor: "#3154F4" },
              }}
            >
              Apply filter
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
