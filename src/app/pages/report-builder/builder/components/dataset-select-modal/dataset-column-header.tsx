import { Box } from "@mui/system";
import SortIcon from "app/assets/vectors/RBTableSort.svg?react";
import FilterIcon from "app/assets/vectors/RBTableFilter.svg?react";
import { DatasetColumn } from "./utils";
import { IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import FilterPopper from "./filter-popper";
import { FilterGroupOptionModel } from "app/state/api/action-reducers/report-builder/sync";
import SortPopper from "./sort-popper";

interface DatasetColumnHeaderProps {
  column: DatasetColumn;
  setColumn?: (column: DatasetColumn) => void;
  filterGroupOptions?: FilterGroupOptionModel[];
  setSelectedFilters?: (filters: string[]) => void;
  selectedFilters?: string[];
  setSorting?: (sorting: { column: string; order: "asc" | "desc" }[]) => void;
  sorting?: { column: string; order: "asc" | "desc" }[];
}

const headerTooltip =
  "Hover to reveal sort and filter options, double-click to edit the header cell text.";

const DatasetColumnHeader = ({
  column,
  filterGroupOptions,
  setSelectedFilters,
  selectedFilters,
  setSorting,
  sorting,
  setColumn,
}: DatasetColumnHeaderProps) => {
  const filterActive = selectedFilters?.length ?? 0 > 0;
  const sortActive = sorting?.some((s) => s.column === column.name) ?? false;
  const [editing, setEditing] = React.useState(false);
  const [nameInputValue, setNameInputValue] = React.useState(column.name);

  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [filterAnchorEl, setFilterAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const sortOpen = Boolean(sortAnchorEl);
  const filterOpen = Boolean(filterAnchorEl);

  const handleCloseSortPopper = () => {
    setSortAnchorEl(null);
  };

  const handleCloseFilterPopper = () => {
    setFilterAnchorEl(null);
  };

  const handleNameOnInputEvent = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.size = e.currentTarget.value.length ?? 1;
  };

  const handleNameChangeEvent = () => {
    setEditing(false);
    if (setColumn) {
      setColumn({ ...column, name: nameInputValue });
    }
  };
  return (
    <Box
      component="th"
      sx={{
        width: "240px",
        maxWidth: "240px",
        color: "#101018",
        fontWeight: 700,
        textAlign: "left",
        bgcolor: "#ffffff !important",
        svg: {
          display: "none",
        },
        "&:hover": {
          bgcolor: "#F8F9FA !important",
          svg: {
            display: "block",
          },
        },
        padding: editing ? "0 !important" : undefined,
      }}
    >
      {editing ? (
        <Box
          component="input"
          sx={{
            fontSize: "16px",
            lineHeight: "normal",
            fontWeight: 700,
            textAlign: "left",
            width: "100%",
            height: "100%",
            textTransform: "none",
            whiteSpace: "nowrap",
            border: "2px solid #3154F4",
            padding: "10px 14px !important",
            outline: "none",
            bgcolor: "transparent",
          }}
          type="text"
          value={nameInputValue}
          size={nameInputValue.length ?? 1}
          onInput={handleNameOnInputEvent}
          onChange={(e) => {
            setNameInputValue(e.currentTarget.value);
          }}
          onBlur={() => {
            handleNameChangeEvent();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleNameChangeEvent();
            }
          }}
        />
      ) : (
        <Tooltip
          disableHoverListener={filterOpen || sortOpen}
          arrow
          title={headerTooltip}
          slotProps={{
            arrow: {
              sx: { color: "#000" },
            },
            tooltip: {
              sx: {
                p: "10px",
                color: "#ffffff",
                fontSize: "14px",
                maxWidth: "280px",
                bgcolor: "#000000",
                boxShadow: "0px 2px 3.5px 0px rgba(0, 0, 0, 0.12)",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: 0,
              }}
            >
              <Typography
                variant="h6"
                fontSize="16px"
                lineHeight="normal"
                sx={{
                  cursor: "pointer",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 700,
                  textAlign: "left",
                  width: "100%",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
                onDoubleClick={() => {
                  setEditing(true);
                }}
              >
                {column.name}
              </Typography>
            </Box>
            <SortPopper
              sorting={sorting}
              setSorting={setSorting}
              column={column}
              anchorEl={sortAnchorEl}
              handleClose={handleCloseSortPopper}
            >
              <IconButton
                disableRipple
                sx={{
                  padding: 0,
                  svg: {
                    display: sortActive || sortOpen ? "block" : undefined,
                    path: {
                      stroke: sortActive ? "#3154F4" : "#373D43",
                    },
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSortAnchorEl(e.currentTarget);
                }}
              >
                <SortIcon width={16} height={16} />
              </IconButton>
            </SortPopper>
            <FilterPopper
              filterGroupOptions={filterGroupOptions}
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
              anchorEl={filterAnchorEl}
              handleClose={handleCloseFilterPopper}
            >
              <IconButton
                disableRipple
                sx={{
                  padding: 0,
                  svg: {
                    display: filterActive || filterOpen ? "block" : undefined,
                    fill: filterActive ? "#3154F4" : "transparent",
                    path: {
                      stroke: filterActive ? "#3154F4" : "#373D43",
                    },
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterAnchorEl(e.currentTarget);
                }}
              >
                <FilterIcon width={16} height={16} />
              </IconButton>
            </FilterPopper>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default DatasetColumnHeader;
