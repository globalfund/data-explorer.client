import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import React from "react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { set } from "lodash";
import TextField from "../components/textfield";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import { appendPx, removePx } from "app/utils/formatPx";

export default function LayoutTab() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as ReportItemOf<"text">;

  const handleChange = (key: string, value: any) => {
    if (!selectedItem) return;
    const currentItem = structuredClone(selectedItem);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedItemController?.id || "",
      open: currentItem?.open || false,
      type: "text",
    });
  };
  return (
    <Box sx={{ padding: "8px" }}>
      <Typography fontWeight={700} marginBottom={"16px"}>
        Padding
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "8px",
          ".MuiInputBase-root": {
            "&:before": {
              borderBottom: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                  svg: {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Left
                </Typography>
              </Box>
            }
            value={removePx(selectedItem?.options?.paddingLeft ?? "")}
            onChange={(value) =>
              handleChange("options.paddingLeft", appendPx(value))
            }
            type="number"
          />

          <TextField
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                  svg: {
                    transform: "rotate(180deg)",
                  },
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Top
                </Typography>
              </Box>
            }
            value={removePx(selectedItem?.options?.paddingTop ?? "")}
            onChange={(value) =>
              handleChange("options.paddingTop", appendPx(value))
            }
            type="number"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                  svg: {
                    transform: "rotate(270deg)",
                  },
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Right
                </Typography>
              </Box>
            }
            value={removePx(selectedItem?.options?.paddingRight ?? "")}
            onChange={(value) =>
              handleChange("options.paddingRight", appendPx(value))
            }
            type="number"
          />

          <TextField
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                <Direction />
                <Typography sx={{ color: "#373D43", fontSize: "14px" }}>
                  Bottom
                </Typography>
              </Box>
            }
            value={removePx(selectedItem?.options?.paddingBottom ?? "")}
            onChange={(value) =>
              handleChange("options.paddingBottom", appendPx(value))
            }
            type="number"
          />
        </Box>

        <Box>
          <Typography fontWeight={700} marginBottom={"8px"}>
            Size
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Width"
              value={selectedItem?.options?.width ?? ""}
              onChange={(value) => handleChange("options.width", value)}
            />

            <TextField
              label="Height"
              value={selectedItem?.options?.height ?? ""}
              onChange={(value) => handleChange("options.height", value)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
