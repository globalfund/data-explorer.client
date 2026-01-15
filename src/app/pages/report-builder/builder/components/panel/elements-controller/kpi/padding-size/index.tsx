import { Box, Typography } from "@mui/material";
import Direction from "app/assets/vectors/RBAlignBottom.svg?react";
import Button from "@mui/material/Button";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import React from "react";
import StyledMenu from "../../common/menu-popup";
import CustomTextField from "../../common/textField";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { alignHOptions } from "../data";

export function PaddingSize() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );

  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find((i) => i.id === selectedItemController?.id);

  const [alignHorizontal, setAlignHorizontal] = React.useState(
    selectedItem?.extra?.kpi_box?.options?.alignHorizontal || "left",
  );

  const [alignVerticalAnchorEl, setAlignVerticalAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAlignVerticalMenuActive = Boolean(alignVerticalAnchorEl);

  React.useEffect(() => {
    setAlignHorizontal(
      selectedItem?.extra?.kpi_box?.options?.alignHorizontal || "left",
    );
  }, [selectedItem]);

  const handleSelectAlignVertical = (value: "left" | "center" | "right") => {
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
      settings: {
        ...selectedItem?.settings,
        display: "flex",
        justifyContent,
      },
      extra: {
        ...selectedItem?.extra,
        kpi_box: {
          ...selectedItem?.extra?.kpi_box,
          options: {
            ...selectedItem?.extra?.kpi_box?.options,
            alignHorizontal: value,
          },
        },
      },
    });
    setAlignHorizontal(value);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAlignVerticalAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAlignVerticalAnchorEl(null);
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
          open={isAlignVerticalMenuActive}
          anchorEl={alignVerticalAnchorEl}
          onClose={() => handleCloseMenu()}
          options={alignHOptions}
          activeValue={alignHorizontal}
          onSelect={handleSelectAlignVertical}
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
            <CustomTextField type="paddingLeft" item="kpi_box" />
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
            <CustomTextField type="paddingTop" item="kpi_box" />
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
            <CustomTextField type="paddingRight" item="kpi_box" />
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
            <CustomTextField type="paddingBottom" item="kpi_box" />
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
              <CustomTextField type="width" item="kpi_box" />
            </Box>

            <Box>
              <Typography
                sx={{ color: "#373D43", fontSize: "14px" }}
                marginBottom={"8px"}
              >
                Height
              </Typography>
              <CustomTextField type="height" item="kpi_box" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
