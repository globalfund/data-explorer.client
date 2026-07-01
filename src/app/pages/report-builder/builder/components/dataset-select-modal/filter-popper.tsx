import React from "react";

import SearchIcon from "app/assets/vectors/RBSearch.svg?react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Button,
  ClickAwayListener,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Close } from "@mui/icons-material";
import { colors } from "app/theme";
import { FilterGroupOptionModel } from "app/state/api/action-reducers/report-builder/sync";
import Checkfield from "../panel/elements-controller/components/checkfield";
import { uniq } from "lodash";

interface FilterPopperProps {
  children?: React.ReactNode;
  filterGroupOptions?: FilterGroupOptionModel[];
  setSelectedFilters?: (filters: string[]) => void;
  selectedFilters?: string[];
  anchorEl?: HTMLElement | null;
  handleClose: () => void;
}

const FilterPopper: React.FC<FilterPopperProps> = ({
  children,
  selectedFilters,
  filterGroupOptions,
  setSelectedFilters,
  anchorEl,
  handleClose,
}) => {
  const [localSelectedFilters, setLocalSelectedFilters] = React.useState<
    string[]
  >(selectedFilters || []);
  const [search, setSearch] = React.useState("");

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: "relative" }}>
        {children}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          onClose={handleClose}
          anchorReference="anchorEl"
          disablePortal
          slotProps={{
            root: {
              sx: {
                zIndex: 1301,
              },
            },
            paper: {
              sx: {
                mt: "-10px", // reduce gap
                ml: "-80px", // reduce gap
              },
            },
          }}
        >
          <Box
            sx={{
              boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
              borderRadius: "4px",
              bgcolor: "#ffffff",
              width: "300px",
              border: "0.5px solid #98A1AA",
              svg: {
                display: "block",
              },
            }}
          >
            <Box
              sx={{
                p: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "0.5px solid #CFD4DA",
              }}
            >
              <Typography color="#000000" fontSize="16px" fontWeight={700}>
                Filter
              </Typography>
              <IconButton onClick={handleClose} sx={{ p: 0 }} disableRipple>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ p: "8px", borderBottom: "0.5px solid #CFD4DA" }}>
              <TextField
                size="small"
                value={search}
                placeholder="Search"
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: "100%",
                  ".MuiInputBase-root": {
                    height: "35px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    bgcolor: "#f1f3f5",
                    outline: "none",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: 0,
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                padding: "11px 16px 11px 24px",
                borderBottom: "1px solid #CFD4DA",
              }}
            >
              <Checkfield
                label="All"
                onChange={(e) => {
                  if (e.target.checked) {
                    setLocalSelectedFilters?.(
                      filterGroupOptions?.map((option) => option.value) || [],
                    );
                  } else {
                    setLocalSelectedFilters?.([]);
                  }
                }}
                checked={
                  localSelectedFilters?.length === filterGroupOptions?.length
                }
                customColor={"#3154F4"}
              />
            </Box>
            <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
              {filterGroupOptions?.map((option, index) => {
                const isChecked =
                  localSelectedFilters?.includes(option.value) || false;

                return (
                  <Box key={index} sx={{ padding: "11px 16px" }}>
                    <Checkfield
                      label={option.label}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLocalSelectedFilters?.(
                            uniq([...localSelectedFilters!, option.value]),
                          );
                        } else {
                          setLocalSelectedFilters?.(
                            localSelectedFilters!.filter(
                              (filter) => filter !== option.value,
                            ),
                          );
                        }
                      }}
                      checked={isChecked}
                      customColor={"#3154F4"}
                    />
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                p: "8px",
                display: "flex",
                justifyContent: "space-between",
                borderTop: "0.5px solid #CFD4DA",
              }}
            >
              <Button variant="outlined">Back</Button>
              <Button
                sx={{
                  fontWeight: "400",
                  background: "#3154F4",
                  color: colors.primary.white,
                  textTransform: "none",
                }}
                onClick={() => {
                  setSelectedFilters?.(localSelectedFilters || []);
                  handleClose();
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </ClickAwayListener>
  );
};

export default FilterPopper;
