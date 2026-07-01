import { Box } from "@mui/system";
import React from "react";
import { getColumnType } from "./utils";
import { getFieldIcon } from "./view";
import { IconButton, Typography } from "@mui/material";
import DatasetFieldCloseIcon from "app/assets/vectors/DatasetFieldClose.svg?react";
import { DataType } from "app/state/api/action-reducers/report-builder/sync";

interface SelectedFiltersProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  dataTypes: Record<
    string,
    | {
        dateFormat: string;
        type: DataType;
      }
    | DataType
  >;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  filters,
  setFilters,
  dataTypes,
}) => {
  return (
    <>
      {Object.values(filters).flat().length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#F8F9FA",
            borderBottom: "0.5px solid #E0E0E0",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            gap: "16px",
          }}
        >
          Filter
          <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {Object.keys(filters)
              .map((d) => {
                return {
                  name: d,
                  type: getColumnType(dataTypes[d]),
                };
              })
              .map((d) => {
                const FieldIcon = getFieldIcon(d.type);
                return (
                  <Box
                    id={d.name}
                    key={d.name}
                    sx={{
                      gap: "6px",
                      px: "12px",
                      py: "6px",
                      display: "flex",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      alignItems: "center",
                      bgcolor: d.type === "number" ? "#0E6027" : "#3154f4",
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
                    >
                      {d.name}
                    </Typography>
                    <IconButton
                      disableRipple
                      sx={{ p: 0, color: "inherit", width: 14, height: 14 }}
                      onClick={() => {
                        setFilters((prevFilters) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { [d.name]: _, ...rest } = prevFilters;
                          return rest;
                        });
                      }}
                    >
                      <DatasetFieldCloseIcon />
                    </IconButton>
                  </Box>
                );
              })}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default SelectedFilters;
