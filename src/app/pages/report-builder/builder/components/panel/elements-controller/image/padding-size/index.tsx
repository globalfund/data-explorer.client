import { Box, Divider, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import Button from "@mui/material/Button";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import React from "react";
import {
  alignHOptions,
  alignVOptions,
  objectFitMap,
  sizingModes,
} from "../data";
import StyledMenu from "../../common/menu-popup";
import CustomTextField from "../../common/textField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ObjectFitTypes } from "app/state/api/action-reducers/report-builder/sync";

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
  const selectedItem = items.find((i) => i.id === selectedItemController?.id);

  const [selectedSizingMode, setSelectedSizingMode] = React.useState(
    selectedItem?.extra?.image?.sizingMode || "fit-proportional",
  );
  const [alignHorizontal, setAlignHorizontal] = React.useState(
    selectedItem?.extra?.image?.alignHorizontal || "left",
  );
  const [alignVertical, setAlignVertical] = React.useState(
    selectedItem?.extra?.image?.alignVertical || "top",
  );
  const [alignHorizontalAnchorEl, setAlignHorizontalAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAlignHorizontalMenuActive = Boolean(alignHorizontalAnchorEl);

  const [alignVerticalAnchorEl, setAlignVerticalAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAlignVerticalMenuActive = Boolean(alignVerticalAnchorEl);

  const [sizingModeAnchorEl, setSizingModeAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isSizingModeMenuActive = Boolean(sizingModeAnchorEl);

  React.useEffect(() => {
    setSelectedSizingMode(
      selectedItem?.extra?.image?.sizingMode || "fit-proportional",
    );
    setAlignHorizontal(selectedItem?.extra?.image?.alignHorizontal || "left");
    setAlignVertical(selectedItem?.extra?.image?.alignVertical || "top");
  }, [selectedItem]);

  const handleSelectSizingMode = (
    value: "fit-proportional" | "fill" | "crop" | "auto",
  ) => {
    editItem({
      ...selectedItem,
      id: selectedItemController?.id || "",
      open: selectedItem?.open || false,
      type: "image",
      settings: {
        ...selectedItem?.settings,
        img: {
          ...selectedItem?.settings?.img,
          objectFit: objectFitMap[value] as ObjectFitTypes,
          width: value === "auto" ? "100%" : "initial",
        },
      },
      extra: {
        ...selectedItem?.extra,
        image: {
          ...selectedItem?.extra?.image,
          sizingMode: value,
        },
      },
    });
    setSelectedSizingMode(value);
    if (value === "fill") {
      setTooltipTrigger({ id: selectedItem?.id || null, visible: true });
    }
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
      settings: {
        ...selectedItem?.settings,
        display: "flex",
        justifyContent,
      },
      extra: {
        ...selectedItem?.extra,
        image: {
          ...selectedItem?.extra?.image,
          alignHorizontal: value,
        },
      },
    });
    setAlignHorizontal(value);
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
      settings: {
        ...selectedItem?.settings,
        display: "flex",
        alignItems,
      },
      extra: {
        ...selectedItem?.extra,
        image: {
          ...selectedItem?.extra?.image,
          alignVertical: value,
        },
      },
    });
    setAlignVertical(value);
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    menuType: string,
  ) => {
    switch (menuType) {
      case "sizingMode":
        setSizingModeAnchorEl(event.currentTarget);
        break;
      case "alignHorizontal":
        setAlignHorizontalAnchorEl(event.currentTarget);
        break;
      case "alignVertical":
        setAlignVerticalAnchorEl(event.currentTarget);
        break;
    }
  };

  const handleCloseMenu = (menuType: string) => {
    switch (menuType) {
      case "sizingMode":
        setSizingModeAnchorEl(null);
        break;
      case "alignHorizontal":
        setAlignHorizontalAnchorEl(null);
        break;
      case "alignVertical":
        setAlignVerticalAnchorEl(null);
        break;
    }
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
      <Box>
        <Typography
          sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
        >
          Sizing Mode
        </Typography>
        {/* Font family */}
        <Button
          variant="text"
          onClick={(event) => handleOpenMenu(event, "sizingMode")}
          endIcon={
            isSizingModeMenuActive ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
          sx={{
            fontWeight: "400",
            textTransform: "none",
            color: "#000",
            bgcolor: "#fff",
            width: "100%",
            height: "40px",
            justifyContent: "space-between",
            borderRadius: "4px",
            border: "0.5px solid #98A1AA",
          }}
        >
          {sizingModes.find((mode) => mode.value === selectedSizingMode)?.label}
        </Button>

        <StyledMenu
          open={isSizingModeMenuActive}
          anchorEl={sizingModeAnchorEl}
          onClose={() => handleCloseMenu("sizingMode")}
          options={sizingModes}
          activeValue={selectedSizingMode}
          onSelect={handleSelectSizingMode}
        />
      </Box>
      <Box sx={{ display: "flex", gap: "16px" }}>
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Align Horizontal
          </Typography>
          {/* Font family */}
          <Button
            variant="text"
            onClick={(event) => handleOpenMenu(event, "alignHorizontal")}
            endIcon={
              isAlignHorizontalMenuActive ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )
            }
            sx={{
              fontWeight: "400",
              textTransform: "none",
              color: "#000",
              bgcolor: "#fff",
              width: "134px",
              height: "40px",
              justifyContent: "space-between",
              borderRadius: "4px",
              border: "0.5px solid #98A1AA",
            }}
          >
            {
              alignHOptions.find((option) => option.value === alignHorizontal)
                ?.label
            }
          </Button>

          <StyledMenu
            open={isAlignHorizontalMenuActive}
            anchorEl={alignHorizontalAnchorEl}
            onClose={() => handleCloseMenu("alignHorizontal")}
            options={alignHOptions}
            activeValue={alignHorizontal}
            onSelect={handleSelectAlignHorizontal}
          />
        </Box>
        <Box>
          <Typography
            sx={{ color: "#373D43", fontSize: "14px", marginBottom: "8px" }}
          >
            Align Vertical
          </Typography>
          {/* Font family */}
          <Button
            variant="text"
            onClick={(event) => handleOpenMenu(event, "alignVertical")}
            endIcon={
              isAlignVerticalMenuActive ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )
            }
            sx={{
              fontWeight: "400",
              textTransform: "none",
              color: "#000",
              bgcolor: "#fff",
              width: "134px",
              height: "40px",
              justifyContent: "space-between",
              borderRadius: "4px",
              border: "0.5px solid #98A1AA",
            }}
          >
            {
              alignVOptions.find((option) => option.value === alignVertical)
                ?.label
            }
          </Button>

          <StyledMenu
            open={isAlignVerticalMenuActive}
            anchorEl={alignVerticalAnchorEl}
            onClose={() => handleCloseMenu("alignVertical")}
            options={alignVOptions}
            activeValue={alignVertical}
            onSelect={handleSelectAlignVertical}
          />
        </Box>
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
          <Box>
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
            <CustomTextField type="paddingLeft" item="image" />
          </Box>

          <Box>
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
            <CustomTextField type="paddingTop" item="image" />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
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
            <CustomTextField type="paddingRight" item="image" />
          </Box>

          <Box>
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
            <CustomTextField type="paddingBottom" item="image" />
          </Box>
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
            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px" }}
                marginBottom={"8px"}
              >
                Width
              </Typography>
              <CustomTextField type="width" item="image" />
            </Box>

            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px" }}
                marginBottom={"8px"}
              >
                Height
              </Typography>
              <CustomTextField type="height" item="image" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
