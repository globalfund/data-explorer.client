import React from "react";
import { KeyboardArrowUp, KeyboardArrowDown, Close } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { mappingData } from "./data";
import StyledMenu from "./menu";

interface DimensionProps {
  label: string;
  helperText: string;
  placeholder: string;
  selectedValue: string;
  required?: boolean;
  menuProps: {
    options: typeof mappingData;
    activeValue: string;
    onSelect: (value: any) => void;
    width?: number | string;
  };
}
export function Dimension(props: Readonly<DimensionProps>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const { menuProps } = props;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMappingSelect = (value: string) => {
    menuProps.onSelect(value);
    handleCloseMenu();
  };

  const getSelectedValueType = () => {
    const selectedOption = menuProps.options.find(
      (option) => option.value === props.selectedValue,
    );
    return selectedOption ? selectedOption.type : null;
  };

  const CaseSensitiveSVG = (
    <svg
      width="13"
      height="7"
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 5.83333L3.16667 0.5L5.83333 5.83333M1.16667 4.5H5.16667M12.5 1.83333V5.83333M12.5 3.83333C12.5 4.9379 11.6046 5.83333 10.5 5.83333C9.39543 5.83333 8.5 4.9379 8.5 3.83333C8.5 2.72876 9.39543 1.83333 10.5 1.83333C11.6046 1.83333 12.5 2.72876 12.5 3.83333Z"
        stroke="#3154F4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ color: "#373D43", fontSize: "14px", mb: "8px" }}>
        {props.label}
        {props.required ? "*" : " (Optional)"}
      </Typography>
      <Box
        onClick={handleOpenMenu}
        sx={{
          fontWeight: "400",
          textTransform: "none",
          color: "#000",
          bgcolor: "#fff",
          width: "100%",
          height: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "4px",
          border: "0.5px solid #98A1AA",
          py: "6.5px",
          px: "16px",
          gap: "16px",
          ".MuiIconButton-root": {
            backgroundColor: "#FFFFFF",
            borderRadius: "4px",
            border: "none",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ":hover": { backgroundColor: "transparent" },
          },
        }}
      >
        {props.selectedValue ? (
          <Box sx={{ display: "flex", gap: "17px", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                svg: {
                  flexShrink: 0,
                },
              }}
            >
              {CaseSensitiveSVG}{" "}
              <Button
                endIcon={<Close fontSize="small" htmlColor="#252C34" />}
                sx={{
                  width: "165px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 8px",
                  background:
                    getSelectedValueType() === "number" ? "#A7F0BA" : "#D6DDFD",
                  borderRadius: "14px",
                  color: "#000",
                  overflow: "hidden",
                  justifyContent: "space-between",
                  textTransform: "none",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                  fontWeight: "normal",
                }}
              >
                {" "}
                {props.selectedValue}
              </Button>{" "}
            </Box>
          </Box>
        ) : (
          <Typography fontSize={"14px"} color="#A8A8A8">
            {props.placeholder}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "17px",
            gap: "8px",
          }}
        >
          <IconButton
            sx={{ display: props.selectedValue ? "flex" : "none !important" }}
          >
            <Close fontSize="small" htmlColor="#252C34" />
          </IconButton>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              color: "#98A1AA",
              display: props.selectedValue ? "flex" : "none",
            }}
          />
          <IconButton>
            {anchorEl ? (
              <KeyboardArrowUp htmlColor="#000" />
            ) : (
              <KeyboardArrowDown htmlColor="#000" />
            )}
          </IconButton>
        </Box>
      </Box>
      <Typography
        sx={{
          color: "#70777E",
          fontSize: "12px",
          mt: "4px",
          display: props.selectedValue ? "none" : "block",
        }}
      >
        {props.helperText}
      </Typography>

      <StyledMenu
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        options={menuProps.options}
        activeValue={menuProps.activeValue}
        onSelect={handleMappingSelect}
      />
    </Box>
  );
}
