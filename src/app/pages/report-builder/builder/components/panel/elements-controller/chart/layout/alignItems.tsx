import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";
import { Box, Typography } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { alignHOptions, alignVOptions } from "../../common/data";
import Button from "@mui/material/Button";
import StyledMenu from "../../common/menu-popup";

export default function AlignItems() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find((i) => i.id === selectedItemController?.id);

  const [alignHorizontal, setAlignHorizontal] = React.useState(
    selectedItem?.extra?.chart?.alignHorizontal || "left",
  );
  const [alignVertical, setAlignVertical] = React.useState(
    selectedItem?.extra?.chart?.alignVertical || "top",
  );
  const [alignHorizontalAnchorEl, setAlignHorizontalAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAlignHorizontalMenuActive = Boolean(alignHorizontalAnchorEl);

  const [alignVerticalAnchorEl, setAlignVerticalAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAlignVerticalMenuActive = Boolean(alignVerticalAnchorEl);
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
      type: "chart",
      settings: {
        ...selectedItem?.settings,
        display: "flex",
        justifyContent,
      },
      extra: {
        ...selectedItem?.extra,
        chart: {
          ...selectedItem?.extra?.chart,
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
      type: "chart",
      open: selectedItem?.open || false,
      settings: {
        ...selectedItem?.settings,
        display: "flex",
        alignItems,
      },
      extra: {
        ...selectedItem?.extra,
        chart: {
          ...selectedItem?.extra?.chart,
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
      case "alignHorizontal":
        setAlignHorizontalAnchorEl(null);
        break;
      case "alignVertical":
        setAlignVerticalAnchorEl(null);
        break;
    }
  };
  return (
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
  );
}
