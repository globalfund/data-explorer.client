import React from "react";
import {
  Button,
  ClickAwayListener,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box } from "@mui/system";
import { Close } from "@mui/icons-material";
import { colors } from "app/theme";
import { DatasetColumn } from "./utils";
import RBTableSortInfoIcon from "app/assets/vectors/RBTableSortInfo.svg?react";
import DatasetFieldDateIcon from "app/assets/vectors/DatasetFieldDate.svg?react";
import DatasetFieldNumberIcon from "app/assets/vectors/DatasetFieldNumber.svg?react";
import DatasetFieldTextIcon from "app/assets/vectors/DatasetFieldText.svg?react";
import DatasetFieldBooleanIcon from "app/assets/vectors/DatasetFieldBoolean.svg?react";
import CheckCircleIcon from "app/assets/vectors/CheckCircle.svg?react";
import { uniqBy } from "lodash";

interface SortPopperProps {
  children?: React.ReactNode;
  column: DatasetColumn;
  sorting?: {
    column: string;
    order: "asc" | "desc";
  }[];
  setSorting?: (sorting: { column: string; order: "asc" | "desc" }[]) => void;
  anchorEl?: HTMLElement | null;
  handleClose: () => void;
}

const SortPopper: React.FC<SortPopperProps> = ({
  children,
  column,
  sorting,
  setSorting,
  anchorEl,
  handleClose,
}) => {
  const [order, setOrder] = React.useState<"asc" | "desc" | null>(
    sorting?.find((s) => s.column === column.name)?.order ?? null,
  );

  const options = {
    string: {
      icon: DatasetFieldTextIcon,
      description: "Alphabetical text sorting",
      bottomText: "Rows with empty text appear last by default.",
      options: [
        {
          direction: "A → Z",
          order: "asc",
          description: "Alphabetical ascending",
          icon: ArrowUpwardIcon,
        },
        {
          direction: "Z → A",
          order: "desc",
          description: "Alphabetical descending",
          icon: ArrowDownwardIcon,
        },
      ],
    },
    number: {
      icon: DatasetFieldNumberIcon,
      description: "Numeric magnitude sorting",
      bottomText: "Null / zero values treated as 0 unless excluded by filter.",
      options: [
        {
          direction: "Smallest → Largest",
          order: "asc",
          description: "Low values first",
          icon: ArrowUpwardIcon,
        },
        {
          direction: "Largest → Smallest",
          order: "desc",
          description: "High values first",
          icon: ArrowDownwardIcon,
        },
      ],
    },
    date: {
      icon: DatasetFieldDateIcon,
      description: "Chronological date sorting",
      bottomText:
        "Missing dates sorted to end. Partial dates (year only) treated as Jan 1st.",
      options: [
        {
          direction: "Oldest → Newest",
          order: "asc",
          description: "Earliest date first",
          icon: ArrowUpwardIcon,
        },
        {
          direction: "Newest → Oldest",
          order: "desc",
          description: "Most recent date first",
          icon: ArrowDownwardIcon,
        },
      ],
    },
    boolean: {
      icon: DatasetFieldBooleanIcon,
      description: "True/false grouping",
      bottomText: "Rows with null values appear last by default.",
      options: [
        {
          direction: "True first",
          order: "asc",
          description: "Active / Yes / Enabled on top",
          icon: ArrowUpwardIcon,
        },
        {
          direction: "False first",
          order: "desc",
          description: "Inactive / No / Disabled on top",
          icon: ArrowDownwardIcon,
        },
      ],
    },
  };

  const activeOption = options[column.type as keyof typeof options];

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
          disablePortal
          onClose={handleClose}
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
                Sort
              </Typography>
              <IconButton onClick={handleClose} sx={{ p: 0 }} disableRipple>
                <Close />
              </IconButton>
            </Box>

            <Box
              sx={{
                padding: "8px",
                borderBottom: "1px solid #CFD4DA",
                display: "flex",
                gap: "13px",
                alignItems: "center",
                background: "#F8F9FA",
                svg: {
                  flexShrink: 0,
                },
              }}
            >
              <activeOption.icon width={24} height={24} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  textAlign: "left",
                }}
              >
                <Typography color="#000000" fontSize="14px" fontWeight={700}>
                  {column.name}
                </Typography>
                <Typography fontSize="14px" marginTop="4px" color="#000000">
                  {activeOption.description}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {activeOption?.options?.map((option) => (
                <React.Fragment key={option.order}>
                  <Box
                    sx={{
                      borderColor: "#CFD4DA",
                      borderBottom: "0.5px solid #CFD4DA",
                      width: "268px",
                      mx: "auto",
                    }}
                  />
                  <Box
                    key={option.order}
                    sx={{
                      padding: "11px 16px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#F8F9FA",
                      },
                      svg: {
                        flexShrink: 0,
                      },
                    }}
                    onClick={() => setOrder(option.order as "asc" | "desc")}
                  >
                    <option.icon width={16} height={16} />
                    <Box
                      sx={{
                        // display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <Typography color="#000000" fontSize="14px">
                        {option.direction}
                      </Typography>
                      <Typography
                        fontSize="14px"
                        marginTop="4px"
                        color="#000000"
                      >
                        {option.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {option.order === order ? (
                        <CheckCircleIcon />
                      ) : (
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            color: "#000",
                            border: "1.333px solid #000",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </React.Fragment>
              ))}
            </Box>
            <Box
              sx={{
                padding: "12px",
                display: "flex",
                gap: "12px",
                background: "#FFF6D8",
                textAlign: "left",
                alignItems: "center",
                borderTop: "0.5px solid #98A1AA",
                svg: {
                  flexShrink: 0,
                },
              }}
            >
              <RBTableSortInfoIcon />
              <Typography fontSize="14px" color="#684E00">
                {activeOption.bottomText}
              </Typography>
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
                  if (setSorting) {
                    if (order) {
                      const sortIndex = sorting?.findIndex(
                        (s) => s.column === column.id,
                      );
                      if (sortIndex !== undefined && sortIndex !== -1) {
                        const newSorting = [...(sorting || [])];
                        newSorting[sortIndex] = { column: column.id, order };
                        setSorting(newSorting);
                      } else {
                        const newSorting = sorting?.filter(
                          (s) => s.column !== column.id,
                        );
                        setSorting(
                          uniqBy(
                            [
                              ...(newSorting || []),
                              { column: column.id, order },
                            ],
                            (s) => s.column,
                          ),
                        );
                      }
                    } else {
                      setSorting?.(
                        sorting?.filter((s) => s.column !== column.id) || [],
                      );
                    }
                  }
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

export default SortPopper;
