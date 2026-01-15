import { MoreVert } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import React from "react";
import StyledMenu from "./menu-popup";
import Copy from "app/assets/vectors/Duplicate.svg?react";
import Folder from "app/assets/vectors/Folder2.svg?react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

const DeleteIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="16"
      height="16"
      fill="white"
      fillOpacity="0.01"
      style={{ mixBlendMode: "multiply" }}
    />
    <path
      d="M8.00065 5.99992L12.0007 9.99992M12.0007 5.99992L8.00065 9.99992M6.66728 3.33325C6.336 3.33327 6.01659 3.45661 5.77128 3.67925L1.55261 7.50592C1.48376 7.56841 1.42874 7.64461 1.39109 7.72963C1.35344 7.81465 1.33398 7.9066 1.33398 7.99959C1.33398 8.09257 1.35344 8.18452 1.39109 8.26954C1.42874 8.35456 1.48376 8.43076 1.55261 8.49325L5.77128 12.3206C6.01659 12.5432 6.336 12.6666 6.66728 12.6666H13.3339C13.6876 12.6666 14.0267 12.5261 14.2768 12.2761C14.5268 12.026 14.6673 11.6869 14.6673 11.3333V4.66659C14.6673 4.31296 14.5268 3.97382 14.2768 3.72378C14.0267 3.47373 13.6876 3.33325 13.3339 3.33325H6.66728Z"
      stroke="#EA1541"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export function Options() {
  const optionsItems = [
    {
      icon: <Copy />,
      label: "Duplicate",
      value: "duplicate",
      sx: {
        justifyContent: "start",
      },
    },
    {
      icon: <Folder />,
      label: "Save as an asset",
      value: "save",
      sx: {
        justifyContent: "start",
      },
    },
    {
      icon: DeleteIcon,
      label: "Delete",
      value: "delete",
      sx: {
        justifyContent: "start",
      },
    },
  ];
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const setSelectedItemController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const removeItem = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (value: string) => {
    if (value === "delete") {
      removeItem(selectedItemController?.id as string);
      setSelectedItemController({ id: "", type: null, open: false });
      handleClose();
    }
    setSelectedValue(value);
  };

  return (
    <Box
      sx={{
        "#styled-menu-item-duplicate svg": {
          width: "16px",
          height: "16px",
        },
      }}
    >
      <IconButton onClick={handleOpen}>
        <MoreVert htmlColor="#252C34" />
      </IconButton>

      <StyledMenu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        options={optionsItems}
        activeValue={selectedValue}
        onSelect={handleChange}
        width={187}
      />
    </Box>
  );
}
