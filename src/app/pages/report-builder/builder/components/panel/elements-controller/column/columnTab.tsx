import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import { useStoreState } from "app/state/store/hooks";
import { set, uniqueId } from "lodash";
import { appendPx, removePx } from "app/utils/formatPx";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import TextField from "../components/textfield";
import SelectField from "../components/selectfield";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";

export function ColumnLayoutTab() {
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

  const handleColumnsChange = (columnsStr: string) => {
    const columns = Number(columnsStr);

    const required = columns;

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
        options: {
          width: `${Math.floor(100 / columns)}%`,
          height: `100%`,
        },
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
      data: {
        ...selectedItem.data,
        columns,
        items: newItems,
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
      }}
    >
      <SelectField
        label="Number of Columns"
        value={String(selectedItem?.data?.columns ?? "")}
        onChange={handleColumnsChange}
        options={Array.from({ length: 10 }, (_, i) => ({
          label: String(i + 1),
          value: String(i + 1),
        }))}
        width={"100%"}
      />

      <Typography fontWeight={700}>Padding</Typography>
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

      <Typography fontWeight={700}>Align</Typography>

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
    </Box>
  );
}
