import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { get, set } from "lodash";
import { appendPx, removePx } from "app/utils/formatPx";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import TextField from "../components/textfield";
import SelectField from "../components/selectfield";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { uniqueId } from "app/utils/uniqueId";
import { alignHOptions, alignVOptions } from "../common/data";
import ColorPickerfield from "../components/colorpickerfield";

export function GridLayoutTab() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"grid">({
    id: selectedItemController?.parent?.id || "",
  });

  const handleChange = (key: string, value: any) => {
    if (!selectedItem) return;
    const currentItem = structuredClone(selectedItem);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedItemController?.parent?.id || "",
      open: currentItem?.open || false,
      type: "grid",
    });
  };

  const handleStructureChange = ({
    columns: columnsStr,
    rows: rowsStr,
  }: {
    columns: string;
    rows: string;
  }) => {
    const columns = Number(columnsStr);
    const rows = Number(rowsStr);
    const required = columns * rows;
    const height = rows * 280;

    const items = selectedItem?.data?.items || [];

    let newItems;

    if (items.length > required) {
      // shrink
      newItems = items.slice(0, required);
    } else if (items.length < required) {
      // expand
      const extra: RBReportItem[] = Array(required - items.length).fill({
        id: uniqueId(),
        type: "unknown",
        open: false,
        data: null,
        options: {},
      });
      newItems = [...items, ...extra];
    } else {
      newItems = items;
    }

    editItem({
      ...selectedItem,
      id: selectedItemController?.parent?.id || "",
      open: selectedItem?.open || false,
      type: "grid",
      options: {
        ...selectedItem?.options,
        height: `${height}px`,
      },
      data: {
        ...selectedItem.data,
        columns,
        rows,
        items: newItems.map((item) => ({
          ...item,
          options: {
            ...item.options,
            width: `${(100 / columns).toFixed(2)}%`,
            height: `${(100 / rows).toFixed(2)}%`,
          },
        })),
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px 8px",
        maxHeight: "500px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box>
        <Typography fontWeight={700} marginBottom={"8px"}>
          Grid Structure
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "16px",
          }}
        >
          <SelectField
            label="Number of Columns"
            value={String(selectedItem?.data?.columns ?? "")}
            onChange={(value) =>
              handleStructureChange({
                columns: value,
                rows: String(selectedItem?.data?.rows ?? ""),
              })
            }
            options={Array.from({ length: 10 }, (_, i) => ({
              label: String(i + 1),
              value: String(i + 1),
            }))}
            width={"100%"}
          />
          <SelectField
            label="Number of Rows"
            value={String(selectedItem?.data?.rows ?? "")}
            onChange={(value) =>
              handleStructureChange({
                columns: String(selectedItem?.data?.columns ?? ""),
                rows: value,
              })
            }
            options={Array.from({ length: 10 }, (_, i) => ({
              label: String(i + 1),
              value: String(i + 1),
            }))}
            width={"100%"}
          />
        </Box>
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={"8px"}>
          Padding
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
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
              gap: "16px",
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
              gap: "16px",
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
        </Box>
      </Box>
      <Box>
        <Typography fontWeight={700} marginBottom={"8px"}>
          Align
        </Typography>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <SelectField
            label="Horizontal"
            options={alignHOptions}
            value={get(selectedItem, "options.alignHorizontal", "left")}
            onChange={(value) => handleChange("options.alignHorizontal", value)}
            width={"100%"}
          />
          <SelectField
            label="Vertical"
            options={alignVOptions}
            value={get(selectedItem, "options.alignVertical", "top")}
            onChange={(value) => handleChange("options.alignVertical", value)}
            width={"100%"}
          />
        </Box>
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={"8px"}>
          Size
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "16px",
          }}
        >
          <TextField
            label="Width"
            value={selectedItem?.options?.width ?? ""}
            onChange={(value) => handleChange("options.width", value)}
            width={"100%"}
          />

          <TextField
            label="Height"
            value={removePx(selectedItem?.options?.height ?? "")}
            onChange={(value) =>
              handleChange("options.height", appendPx(value))
            }
            type="number"
            width={"100%"}
          />
        </Box>
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={"8px"}>
          Border & Fill
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
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
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Stroke"
              value={removePx(selectedItem?.options?.borderWidth ?? "")}
              onChange={(value) =>
                handleChange("options.borderWidth", appendPx(value))
              }
              type="number"
              width="100%"
            />

            <ColorPickerfield
              label="Stroke Color"
              color={selectedItem?.options?.borderColor || "#000000"}
              onChange={(color) => handleChange("options.borderColor", color)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Corner Radius"
              value={removePx(selectedItem?.options?.borderRadius ?? "")}
              onChange={(value) =>
                handleChange("options.borderRadius", appendPx(value))
              }
              type="number"
              width="100%"
            />

            <ColorPickerfield
              label="Background Color"
              color={selectedItem?.options?.backgroundColor ?? "#FFFFFF"}
              onChange={(color) =>
                handleChange("options.backgroundColor", color)
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
