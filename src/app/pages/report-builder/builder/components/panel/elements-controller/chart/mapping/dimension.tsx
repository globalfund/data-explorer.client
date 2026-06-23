import React from "react";
import { KeyboardArrowUp, KeyboardArrowDown, Close } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { mappingData, MappingTypeIcons } from "./data";
import StyledMenu from "./menu";

interface DimensionProps {
  label: string;
  helperText: string;
  placeholder: string;
  selectedValue: string[];
  required?: boolean;
  options: typeof mappingData;
  onSelect: (value: string[], types: string[]) => void;
  errorText?: string;
}
export function Dimension(props: Readonly<DimensionProps>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMappingSelect = (value: string[]) => {
    props.onSelect(
      value,
      value.map(getSelectedValueType).filter((v) => v !== null) as string[],
    );
    handleCloseMenu();
  };

  const getSelectedValueType = (value: string) => {
    const selectedOption = props.options.find(
      (option) => option.value === value,
    );
    return selectedOption ? selectedOption.type : null;
  };

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
          height: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "4px",
          border: `0.5px solid ${props.errorText ? "#D32F2F" : "#98A1AA"}`,
          py: "0px",
          px: "8px",
          gap: "8px",
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {props.selectedValue.length > 0 ? (
            props.selectedValue?.map((value) => (
              <Box
                key={value}
                sx={{ display: "flex", gap: "17px", alignItems: "center" }}
              >
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
                  {MappingTypeIcons[getSelectedValueType(value)!]}
                  <Button
                    endIcon={
                      <Close
                        fontSize="small"
                        htmlColor="#252C34"
                        onClick={() =>
                          handleMappingSelect(
                            props.selectedValue.filter((val) => val !== value),
                          )
                        }
                      />
                    }
                    sx={{
                      width: "165px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0px 8px",
                      background:
                        getSelectedValueType(value) === "number"
                          ? "#A7F0BA"
                          : "#D6DDFD",
                      borderRadius: "14px",
                      color: "#000",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      fontWeight: "normal",
                    }}
                  >
                    <Box
                      component={"span"}
                      sx={{
                        flex: 1,
                        textTransform: "none",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {value}
                    </Box>
                  </Button>{" "}
                </Box>
              </Box>
            ))
          ) : (
            <Typography fontSize={"14px"} color="#A8A8A8">
              {props.placeholder}
            </Typography>
          )}
        </Box>
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
            sx={{
              display: props.selectedValue.length ? "flex" : "none !important",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleMappingSelect([]);
            }}
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
          color: props.errorText ? "#D32F2F" : "#70777E",
          fontSize: "12px",
          mt: "4px",
          display: props.errorText || props.helperText ? "block" : "none",
        }}
      >
        {props.errorText || props.helperText}
      </Typography>

      <StyledMenu
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        options={props.options}
        activeValue={props.selectedValue}
        onSelect={handleMappingSelect}
      />
    </Box>
  );
}
