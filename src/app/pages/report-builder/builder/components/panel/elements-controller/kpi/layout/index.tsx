import { Box, TextField, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import Button from "@mui/material/Button";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import React from "react";
import StyledMenu from "../../common/menu-popup";

import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { alignHOptions } from "../data";
import { set } from "lodash";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export function PaddingSize() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find(
    (i) => i.id === selectedItemController?.id,
  ) as ReportItemOf<"kpi_box">;

  const [alignHorizontal, setAlignHorizontal] = React.useState(
    selectedItem?.options?.alignHorizontal || "left",
  );

  const [alignHorizontalAnchorEl, setAlignHorizontalAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAlignHorizontalMenuActive = Boolean(alignHorizontalAnchorEl);

  React.useEffect(() => {
    setAlignHorizontal(selectedItem?.options?.alignHorizontal || "left");
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

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAlignHorizontalAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAlignHorizontalAnchorEl(null);
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
          Align
        </Typography>
        <Button
          variant="text"
          onClick={(event) => handleOpenMenu(event)}
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
            alignHOptions.find((option) => option.value === alignHorizontal)
              ?.label
          }
        </Button>

        <StyledMenu
          open={isAlignHorizontalMenuActive}
          anchorEl={alignHorizontalAnchorEl}
          onClose={() => handleCloseMenu()}
          options={alignHOptions}
          activeValue={alignHorizontal}
          onSelect={handleSelectAlignHorizontal}
        />
      </Box>

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
            onChange={(value) => handleChange("options.paddingLeft", value)}
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
            onChange={(value) => handleChange("options.paddingTop", value)}
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
            onChange={(value) => handleChange("options.paddingRight", value)}
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
            onChange={(value) => handleChange("options.paddingBottom", value)}
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
