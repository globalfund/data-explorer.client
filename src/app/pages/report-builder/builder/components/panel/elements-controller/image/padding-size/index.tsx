import { Box, Divider, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import React from "react";
import { objectFitMap } from "../data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ObjectFitTypes } from "app/state/api/action-reducers/report-builder/sync";
import { get, set } from "lodash";
import TextField from "../../components/textfield";
import SelectField from "../../components/selectfield";
import Checkfield from "../../components/checkfield";
import { appendPx, removePx } from "app/utils/formatPx";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export function PaddingSize() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const setTooltipTrigger = useStoreActions(
    (actions) => actions.RBTooltipTriggerState.setValue,
  );
  const { selectedItem, editItem } = useGetReportItemState<"image">({
    id: selectedItemController?.id || "",
    parent: selectedItemController?.parent ?? undefined,
  });

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
    if (selectedItemController?.parent && value === "auto") {
      return;
    }
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      open: selectedItem?.open || false,
      type: "image",
      options: {
        ...selectedItem?.options,
        ...(value === "auto"
          ? {
              width: `100%`,
              height: "auto",
              imgNormHeight: selectedItem?.options?.height || "400px",
            }
          : {
              height:
                selectedItem?.options?.height !== "auto"
                  ? selectedItem?.options?.height
                  : selectedItem?.options?.imgNormHeight || "400px",
            }),
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

  const sizingModes = [
    { label: "Fit Proportional (Contain)", value: "fit-proportional" },
    { label: "Fit", value: "fit" },
    { label: "Crop", value: "crop" },
    {
      label: "Auto-Size (Grow)",
      value: "auto",
      disabled: !!selectedItemController?.parent,
    },
  ];

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

      {/* <Box sx={{ display: "flex", gap: "16px", width: "100%" }}>
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
      </Box> */}
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
              disabled={selectedItem?.options?.sizingMode === "auto"}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
