import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { alignHOptions } from "../data";
import StyledMenu from "../menu-popup";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ChartField } from "app/state/api/action-reducers/report-builder/sync";

export default function Menu(
  props: Readonly<{
    fieldLabel: keyof ChartField;
    disabled: boolean;
  }>,
) {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find((i) => i.id === selectedItemController?.id);
  const [selectedMenuValue, setSelectedMenuValue] = React.useState(
    selectedItem?.extra?.chart?.field?.[props.fieldLabel]?.value || "left",
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isAlignHorizontalMenuActive = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectMenuItem = (value: "left" | "center" | "right") => {
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
          field: {
            ...selectedItem?.extra?.chart?.field,
            [props.fieldLabel]: {
              ...selectedItem?.extra?.chart?.field?.[props.fieldLabel],
              value,
            },
          },
        },
      },
    });
    setSelectedMenuValue(value);
  };

  React.useEffect(() => {
    setSelectedMenuValue(
      selectedItem?.extra?.chart?.field?.[props.fieldLabel]?.value || "left",
    );
  }, [selectedItem]);
  return (
    <Box>
      <Button
        variant="text"
        onClick={(event) => handleOpenMenu(event)}
        disabled={props.disabled}
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
          width: "100%",
          height: "40px",
          justifyContent: "space-between",
          borderRadius: "4px",
          border: "0.5px solid #98A1AA",
        }}
      >
        {
          alignHOptions.find((option) => option.value === selectedMenuValue)
            ?.label
        }
      </Button>

      <StyledMenu
        open={isAlignHorizontalMenuActive}
        anchorEl={anchorEl}
        onClose={() => handleCloseMenu()}
        options={alignHOptions}
        activeValue={selectedMenuValue}
        onSelect={handleSelectMenuItem}
      />
    </Box>
  );
}
