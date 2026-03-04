import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";

interface Props {
  id: string;
  viewMode?: boolean;
}
export default function KPIBox({ id, viewMode }: Readonly<Props>) {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const selectedItem = items.find(
    (i) => i.id === id,
  ) as ReportItemOf<"kpi_box">;
  const isActive = selectedItemController?.id === id;
  const border = `${selectedItem?.options?.borderWidth || "0.5px"} solid ${
    selectedItem?.options?.borderColor || "#000000"
  }`;
  const settings = selectedItem?.options || {};
  const alignHorizontal = selectedItem?.options?.alignHorizontal;
  const innerLine = selectedItem?.options?.innerLine;
  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  useClickOutsideEditor({
    editorId: "kpi-render",
    toolbarId: "kpi-controller",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });
  return (
    <Box
      id="kpi-render"
      onClick={() => {
        if (viewMode) return;
        editItem({
          ...selectedItem,
          id,
          type: "kpi_box",
          open: true,
        });
        setSelectedController({
          id,
          type: "kpi_box",
          open: true,
        });
      }}
    >
      {!selectedItem?.open && (
        <Box
          sx={{
            gap: "10px",
            width: "100%",
            height: "220px",
            display: "flex",
            cursor: "pointer",
            borderRadius: "4px",
            alignItems: "center",
            bgcolor: "#d6ddfd",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px dashed #3154f4",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.33317 28H22.6665M5.33317 4H26.6665C28.1393 4 29.3332 5.19391 29.3332 6.66667V20C29.3332 21.4728 28.1393 22.6667 26.6665 22.6667H5.33317C3.86041 22.6667 2.6665 21.4728 2.6665 20V6.66667C2.6665 5.19391 3.86041 4 5.33317 4Z"
              stroke="#3154F4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Typography fontSize="16px" color="#3154f4">
            Click to edit big number chart
          </Typography>
        </Box>
      )}
      {selectedItem?.open && (
        <Box
          sx={{
            height: "141px",
            padding: "10px",
            border: isActive ? "0.5px solid #3154F4" : border,
            borderRadius: "4px",
            display: "flex",
            gap: "8px",

            ...settings,
            ...(viewMode ? { border: "none !important" } : {}),
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                height: "25px",
                paddingBottom: "8px",
                borderBottomWidth: innerLine?.borderWidth,
                borderBottomStyle: "solid",
                borderBottomColor: innerLine?.borderColor,
                justifyContent: settings.justifyContent || "flex-start",
                display: settings.display || "flex",
              }}
            >
              <Typography
                display={
                  selectedItem?.data?.topLabel?.enabled ? "block" : "none"
                }
                fontSize={selectedItem?.data?.topLabel?.fontSize ?? "14px"}
                color={selectedItem?.data?.topLabel?.color ?? "#70777E"}
                bgcolor={selectedItem?.data?.topLabel?.bgColor ?? "transparent"}
                fontFamily={selectedItem?.data?.topLabel?.fontFamily ?? "Inter"}
                fontWeight={selectedItem?.data?.topLabel?.fontWeight ?? 400}
                fontStyle={selectedItem?.data?.topLabel?.fontStyle ?? "normal"}
              >
                {selectedItem?.data?.topLabel?.value}
              </Typography>
            </Box>

            <Box
              sx={{
                minWidth: "162px",
                display: "flex",
                gap: alignHorizontal === "left" ? "15px" : "0px",
                alignItems:
                  alignHorizontal === "left"
                    ? "center"
                    : settings.justifyContent,
                borderBottomWidth: innerLine?.borderWidth,
                borderBottomStyle: "solid",
                borderBottomColor: innerLine?.borderColor,
                justifyContent: "start",
                flexDirection: alignHorizontal === "left" ? "row" : "column",
              }}
            >
              <Typography
                display={
                  selectedItem?.data?.bigNumberText?.enabled ? "block" : "none"
                }
                fontSize={selectedItem?.data?.bigNumberText?.fontSize ?? "44px"}
                color={selectedItem?.data?.bigNumberText?.color ?? "#373D43"}
                fontWeight={
                  selectedItem?.data?.bigNumberText?.fontWeight ?? 700
                }
                fontFamily={
                  selectedItem?.data?.bigNumberText?.fontFamily ?? "Inter"
                }
                bgcolor={
                  selectedItem?.data?.bigNumberText?.bgColor ?? "transparent"
                }
                fontStyle={
                  selectedItem?.data?.bigNumberText?.fontStyle ?? "normal"
                }
                height={"53px"}
                // py={"9px"}
                lineHeight={"normal"}
              >
                {selectedItem?.data?.bigNumberText?.value}
              </Typography>
              <Typography
                display={
                  selectedItem?.data?.optionalText?.enabled ? "block" : "none"
                }
                fontSize={selectedItem?.data?.optionalText?.fontSize ?? "14px"}
                color={selectedItem?.data?.optionalText?.color ?? "#70777E"}
                fontWeight={selectedItem?.data?.optionalText?.fontWeight ?? 400}
                fontStyle={
                  selectedItem?.data?.optionalText?.fontStyle ?? "normal"
                }
                fontFamily={
                  selectedItem?.data?.optionalText?.fontFamily ?? "Inter"
                }
                bgcolor={
                  selectedItem?.data?.optionalText?.bgColor ?? "transparent"
                }
                height={settings.justifyContent === "left" ? "35px" : "auto"}
                py={settings.justifyContent === "left" ? "9px" : "0px"}
                lineHeight={"normal"}
              >
                {selectedItem?.data?.optionalText?.value}
              </Typography>
            </Box>
            <Box
              sx={{
                height: "27px",
                justifyContent: settings.justifyContent || "flex-start",
                display: settings.display || "flex",
                alignItems: "center",
              }}
            >
              <Typography
                display={
                  selectedItem?.data?.bottomLabel?.enabled ? "block" : "none"
                }
                fontSize={selectedItem?.data?.bottomLabel?.fontSize ?? "14px"}
                color={selectedItem?.data?.bottomLabel?.color ?? "#70777E"}
                bgcolor={
                  selectedItem?.data?.bottomLabel?.bgColor ?? "transparent"
                }
                fontStyle={
                  selectedItem?.data?.bottomLabel?.fontStyle ?? "normal"
                }
                fontWeight={selectedItem?.data?.bottomLabel?.fontWeight ?? 400}
                fontFamily={
                  selectedItem?.data?.bottomLabel?.fontFamily ?? "Inter"
                }
              >
                {selectedItem?.data?.bottomLabel?.value}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
