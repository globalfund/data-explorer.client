import React from "react";
import { Box, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilterGroupModel } from "app/state/api/action-reducers/report-builder/sync";
import CheckboxIcon from "app/assets/vectors/CheckboxRB_notchecked.svg?react";
import CheckboxCheckedIcon from "app/assets/vectors/CheckboxRB_checked.svg?react";

interface ExpandedFilterGroupProps extends FilterGroupModel {
  selectedFilters: string[];
  setSelectedFilters: (filters: string[]) => void;
  expandSearchResults?: boolean;
}

const ExpandedFilterGroup = ({
  name,
  options,
  selectedFilters,
  setSelectedFilters,
  expandSearchResults = false,
}: ExpandedFilterGroupProps) => {
  const [expandedValues, setExpandedValues] = React.useState<
    Record<string, boolean>
  >({});
  const id = React.useId();

  return (
    <Box role="group" aria-label={name}>
      {options.map((option, index) => {
        const hasChildren = Boolean(option.subOptions?.length);
        const expanded =
          hasChildren && (expandedValues[option.value] ?? expandSearchResults);
        const childrenId = `${id}-${index}`;

        return (
          <Box
            key={option.value}
            sx={{
              borderBottom:
                index < options.length - 1 ? "0.5px solid #DFE3E5" : "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "32px",
                borderBottom: expanded ? "0.5px solid #DFE3E5" : "none",
              }}
            >
              <FormControlLabel
                label={option.label}
                control={
                  <Checkbox
                    checked={selectedFilters.includes(option.value)}
                    icon={<CheckboxIcon width={16} height={16} />}
                    checkedIcon={<CheckboxCheckedIcon width={16} height={16} />}
                    onChange={(_event, checked) => {
                      setSelectedFilters(
                        checked
                          ? Array.from(
                              new Set([...selectedFilters, option.value]),
                            )
                          : selectedFilters.filter(
                              (value) => value !== option.value,
                            ),
                      );
                    }}
                    sx={{
                      p: 0,
                      mr: "8px",
                      "& svg path": { fill: "#373D43" },
                      "&.Mui-checked svg path": { fill: "#3154F4" },
                    }}
                  />
                }
                sx={{
                  m: 0,
                  flex: 1,
                  minWidth: 0,
                  py: "6px",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#000",
                    overflowWrap: "anywhere",
                  },
                }}
              />
              {hasChildren && (
                <IconButton
                  size="small"
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${option.label}`}
                  aria-expanded={expanded}
                  aria-controls={expanded ? childrenId : undefined}
                  onClick={() =>
                    setExpandedValues((previous) => ({
                      ...previous,
                      [option.value]: !expanded,
                    }))
                  }
                  sx={{ p: "2px", ml: "4px", color: "#373D43" }}
                >
                  <ExpandMoreIcon
                    sx={{
                      fontSize: "16px",
                      transform: expanded ? "rotate(180deg)" : undefined,
                    }}
                  />
                </IconButton>
              )}
            </Box>
            {expanded && (
              <Box id={childrenId} sx={{ pl: "16px" }}>
                <ExpandedFilterGroup
                  name={option.label}
                  options={option.subOptions ?? []}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  expandSearchResults={expandSearchResults}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ExpandedFilterGroup;
