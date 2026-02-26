import { Box, Divider, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import React from "react";
import { alignHOptions, alignVOptions } from "../../common/data";
import { objectFitMap, sizingModes } from "../data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  ObjectFitTypes,
  ReportItemOf,
} from "app/state/api/action-reducers/report-builder/sync";
import { get, set } from "lodash";
import TextField from "../../components/textfield";
import SelectField from "../../components/selectfield";
import Checkfield from "../../components/checkfield";

export function PaddingSize() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const setTooltipTrigger = useStoreActions(
    (actions) => actions.RBTooltipTriggerState.setValue,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as ReportItemOf<"image">;

  console.log(selectedItem, "selectedItem");

  const handleChange = (key: string, value: any) => {
    if (!selectedItem) return;
    const currentItem = structuredClone(selectedItem);
    set(currentItem, key, value);
    editItem({
      ...currentItem,
      id: selectedItemController?.id || "",
      open: currentItem?.open || false,
      type: "image",
    });
  };

  const handleSelectSizingMode = (
    value: "fit-proportional" | "fill" | "crop" | "auto",
  ) => {
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      open: selectedItem?.open || false,
      type: "image",
      options: {
        ...selectedItem?.options,
        ...(value === "auto"
          ? { width: `100%`, height: "auto" }
          : { height: "400px" }),
        imgObjectFit: objectFitMap[value] as ObjectFitTypes,
        sizingMode: value,
      },
    });

    if (value === "fill") {
      setTooltipTrigger({ id: selectedItem?.id || null, visible: true });
    }
  };

  const handleEnableCropChange = (value: boolean) => {
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      open: selectedItem?.open || false,
      type: "image",
      options: {
        ...selectedItem?.options,
        enableCrop: value,
      },
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
      id: selectedItemController?.id || "",
      open: selectedItem?.open || false,
      type: "image",
      options: {
        ...selectedItem?.options,
        display: "flex",
        justifyContent,
        alignHorizontal: value,
      },
    });
  };

  const handleSelectAlignVertical = (value: "top" | "middle" | "bottom") => {
    let alignItems = "";
    switch (value) {
      case "top":
        alignItems = "start";
        break;
      case "middle":
        alignItems = "center";
        break;
      case "bottom":
        alignItems = "end";
        break;
    }
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      type: "image",
      open: selectedItem?.open || false,
      options: {
        ...selectedItem?.options,
        display: "flex",
        alignItems,
        alignVertical: value,
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
        label="Sizing Mode"
        options={sizingModes}
        onChange={handleSelectSizingMode}
        value={get(selectedItem, "options.sizingMode", "fit-proportional")}
      />

      {selectedItem?.options?.sizingMode === "crop" ? (
        <Checkfield
          label="Enable Crop"
          checked={selectedItem?.options?.enableCrop}
          onChange={(e) => handleEnableCropChange(e.target.checked)}
        />
      ) : null}

      <Box sx={{ display: "flex", gap: "16px", width: "100%" }}>
        <SelectField
          label="Align Horizontal"
          options={alignHOptions}
          value={get(selectedItem, "options.alignHorizontal", "left")}
          onChange={handleSelectAlignHorizontal}
          width={"100%"}
        />
        <SelectField
          label="Align Vertical"
          options={alignVOptions}
          value={get(selectedItem, "options.alignVertical", "top")}
          onChange={handleSelectAlignVertical}
          width={"100%"}
        />
      </Box>
      <Divider sx={{ borderColor: "#CFD4DA" }} />
      <Typography fontWeight={700}>Padding</Typography>
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
            value={selectedItem?.options?.paddingLeft ?? ""}
            onChange={(value) => handleChange("settings.paddingLeft", value)}
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
            value={selectedItem?.options?.paddingTop ?? ""}
            onChange={(value) => handleChange("settings.paddingTop", value)}
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
            value={selectedItem?.options?.paddingRight ?? ""}
            onChange={(value) => handleChange("settings.paddingRight", value)}
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
            value={selectedItem?.options?.paddingBottom ?? ""}
            onChange={(value) => handleChange("settings.paddingBottom", value)}
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
              onChange={(value) => handleChange("settings.width", value)}
            />

            <TextField
              label="Height"
              value={selectedItem?.options?.height ?? ""}
              onChange={(value) => handleChange("settings.height", value)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
