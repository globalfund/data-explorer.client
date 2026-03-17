import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { alignHOptions, alignVOptions } from "../data";
import { set } from "lodash";
import TextField from "../../components/textfield";
import { appendPx, removePx } from "app/utils/formatPx";
import SelectField from "../../components/selectfield";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export function PaddingSize() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem, editItem } = useGetReportItemState<"kpi_box">({
    id: selectedItemController?.id || "",
    parent: selectedItemController?.parent ?? undefined,
  });

  const [alignHorizontal, setAlignHorizontal] = React.useState(
    selectedItem?.options?.alignHorizontal || "left",
  );

  const [alignVertical, setAlignVertical] = React.useState(
    selectedItem?.options?.alignVertical || "top",
  );
  React.useEffect(() => {
    setAlignHorizontal(selectedItem?.options?.alignHorizontal || "left");
    setAlignVertical(selectedItem?.options?.alignVertical || "top");
  }, [selectedItem]);

  const handleChange = (key: string, value: any) => {
    if (!selectedItem) return;
    const currentItem = structuredClone(selectedItem);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedItemController?.id || "",
      open: currentItem?.open || false,
      type: "kpi_box",
    });
  };

  const handleSelectAlignHorizontal = (value: "left" | "center" | "right") => {
    let justifyContent = "";
    switch (value) {
      case "left":
        justifyContent = "start";
        break;
      case "center":
        justifyContent = "center";
        break;
      case "right":
        justifyContent = "end";
        break;
    }
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItemController?.id || "",
      type: "kpi_box",
      options: {
        ...selectedItem?.options,
        display: "flex",
        justifyContent,
        alignHorizontal: value,
      },
    });
    setAlignHorizontal(value);
  };

  const handleSelectAlignVertical = (value: "top" | "middle" | "bottom") => {
    let alignItems = "";
    switch (value) {
      case "top":
        alignItems = "flex-start";
        break;
      case "middle":
        alignItems = "center";
        break;
      case "bottom":
        alignItems = "flex-end";
        break;
    }
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItemController?.id || "",
      type: "kpi_box",
      options: {
        ...selectedItem?.options,
        display: "flex",
        alignItems,
        alignVertical: value,
      },
    });
    setAlignVertical(value);
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

      <Box
        sx={{
          display: "flex",
          gap: "16px",
          width: "100%",
        }}
      >
        <SelectField
          label="Horizontal"
          options={alignHOptions}
          value={alignHorizontal}
          onChange={handleSelectAlignHorizontal}
          width={"100%"}
        />
        <SelectField
          label="Vertical"
          options={alignVOptions}
          value={alignVertical}
          onChange={handleSelectAlignVertical}
          width={"100%"}
        />
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
            value={selectedItem?.options?.height ?? ""}
            onChange={(value) => handleChange("options.height", value)}
            width={"100%"}
          />
        </Box>
      </Box>
    </Box>
  );
}
