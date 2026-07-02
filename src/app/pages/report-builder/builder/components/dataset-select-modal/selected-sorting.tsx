import { Box } from "@mui/system";
import React from "react";
import { IconButton, Typography } from "@mui/material";
import DatasetFieldCloseIcon from "app/assets/vectors/DatasetFieldClose.svg?react";
import DatasetFieldSortHandle from "app/assets/vectors/DatasetFieldSortHandle.svg?react";
import ColumnSortWrapper from "./sort-wrapper";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

interface SelectedSortingProps {
  sorting?: {
    column: string;
    order: "asc" | "desc";
  }[];
  setSorting?: React.Dispatch<
    React.SetStateAction<{ column: string; order: "asc" | "desc" }[]>
  >;
}

const SelectedSorting: React.FC<SelectedSortingProps> = ({
  sorting,
  setSorting,
}) => {
  return (
    <DragDropProvider
      onDragOver={(event) => {
        setSorting?.((prevSorting: any[]) => {
          const newOrder = move(
            prevSorting.map((d) => ({ ...d, id: d.column })),
            event,
          );
          return newOrder.map((d) => ({ column: d.id, order: d.order }));
        });
      }}
    >
      {sorting && sorting.length > 0 ? (
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
          Sort
          <Box sx={{ width: "1px", height: 35, bgcolor: "#cfd4da" }} />
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {sorting
              .map((d) => ({ ...d, id: d.column }))
              .map((d, index) => {
                return (
                  <ColumnSortWrapper
                    index={index}
                    id={d.id}
                    key={d.id}
                    type="SELECTED_COLUMN"
                    sx={{
                      gap: "6px",
                      px: "12px",
                      py: "6px",
                      display: "flex",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      alignItems: "center",
                      bgcolor: "#6929C4",
                      svg: {
                        flexShrink: 0,
                      },
                    }}
                  >
                    <DatasetFieldSortHandle />
                    <Typography
                      component="span"
                      fontSize="14px"
                      lineHeight="normal"
                      color="inherit"
                    >
                      {d.column}
                    </Typography>
                    <IconButton
                      disableRipple
                      sx={{ p: 0, color: "inherit", width: 14, height: 14 }}
                      onClick={() => {
                        setSorting?.((prevSorting) => {
                          return prevSorting.filter(
                            (s) => s.column !== d.column,
                          );
                        });
                      }}
                    >
                      <DatasetFieldCloseIcon />
                    </IconButton>
                  </ColumnSortWrapper>
                );
              })}
            <Typography
              component="span"
              fontSize="14px"
              lineHeight="normal"
              color="#000000"
              ml="4px"
            >
              ← drag to reorder priority
            </Typography>
          </Box>
        </Box>
      ) : null}
    </DragDropProvider>
  );
};

export default SelectedSorting;
