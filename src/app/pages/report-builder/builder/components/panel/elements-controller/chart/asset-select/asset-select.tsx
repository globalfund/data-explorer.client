import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowUpDown from "app/assets/vectors/ArrowUpDown.svg?react";
import { ChartProperty } from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

interface Props {
  buttonLabel: string;
  helperText: string;
  icon: React.ReactNode;
  selectedItem: string;
  type: ChartProperty;
}
export function AssetSelect({
  buttonLabel,
  helperText,
  icon,
  type,
  selectedItem,
}: Readonly<Props>) {
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          maxHeight: "65px",
          minHeight: "40px",
          border: "0.5px solid #ADB5BD",
          borderRadius: "4px",
          background: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            background: "#F1F3F5",
            borderRight: "0.5px solid #ADB5BD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 8px",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
          }}
        >
          {icon}
        </Box>
        {selectedItem ? (
          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 8px",
              svg: {
                flexShrink: 0,
              },
              textTransform: "none",
              fontSize: "14px",
            }}
            onClick={() => {
              if (selectedController) {
                setSelectedController({
                  ...selectedController,
                  extra: {
                    chart: {
                      listToDisplay: type,
                    },
                  },
                });
              }
            }}
          >
            <Typography>{selectedItem}</Typography>
            <ArrowUpDown />
          </Button>
        ) : (
          <Box
            sx={{
              padding: "4px 8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              onClick={() => {
                if (selectedController) {
                  setSelectedController({
                    ...selectedController,
                    extra: {
                      chart: {
                        listToDisplay: type,
                      },
                    },
                  });
                }
              }}
              startIcon={<AddIcon htmlColor="#000000" />}
              sx={{
                height: "35px",
                width: "100%",
                background: "#ffffff",
                color: "#000000",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "14px",
                padding: "9px 12px",
                gap: "20px",
                justifyContent: "flex-start",
                border: "0.5px solid #98A1AA",
                "&:hover": {
                  borderColor: "#3154F4",
                  color: "#3154F4",
                  svg: { fill: "#3154F4" },
                },
              }}
            >
              {buttonLabel}
            </Button>
          </Box>
        )}
      </Box>
      {selectedItem ? null : (
        <Typography color="#EA1541" fontSize={"14px"}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
