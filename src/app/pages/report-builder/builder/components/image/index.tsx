import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import { useTooltip } from "app/hooks/useTooltip";
import { createPortal } from "react-dom";
import { CropComponent } from "./crop";
import { ReportItemOf } from "app/state/api/action-reducers/report-builder/sync";

export const ReportBuilderPageImage: React.FC<{
  id: string;
  viewMode?: boolean;
}> = ({ id, viewMode }) => {
  const { visible, coords, triggerTooltip, setAnchor } = useTooltip({
    hideAfter: 5000,
    position: "bottom",
  });
  const triggeredTooltip = useStoreState(
    (state) => state.RBTooltipTriggerState.tooltip,
  );
  const setTooltipTrigger = useStoreActions(
    (actions) => actions.RBTooltipTriggerState.setValue,
  );
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);

  const active = selectedController?.id === id;

  const selectedItem = items.find((i) => i.id === id) as ReportItemOf<"image">;

  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const settings = selectedItem?.options || {};
  const imgStyle = {
    opacity: settings.imgOpacity || 1,
    objectFit: settings.imgObjectFit || "none",
  };

  const imageExtra = selectedItem?.data;
  const imageSrc = imageExtra?.src;
  const tooltipWidth =
    document.getElementById("tooltip-image-move-pan")?.clientWidth || 0;

  React.useEffect(() => {
    if (triggeredTooltip.visible && triggeredTooltip.id === id) {
      triggerTooltip();
    }
    return () => {
      if (triggeredTooltip.visible) {
        setTooltipTrigger({ visible: false, id: null });
      }
    };
  }, [triggeredTooltip]);

  const handleChangeCropCoordinates = (coordinates: {
    top: number;
    left: number;
    width: number;
    height: number;
  }) => {
    editItem({
      ...selectedItem,
      id: id || "",
      open: selectedItem?.open || false,
      type: "image",
      data: {
        ...selectedItem?.data,
        cropCoordinates: coordinates,
      },
    });
  };

  useClickOutsideEditor({
    editorId: "image-render",
    toolbarId: "image-controller",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });

  const triggerImageController = (open: boolean) => {
    if (viewMode) return;
    setSelectedController({ id, type: "image", open });
  };

  const getUniqueStyle = () => {
    if (settings?.sizingMode === "fill") {
      return {
        display: "block",
        height: `calc(${settings.height} + ${settings.paddingTop} + ${
          settings.paddingBottom
        })`,
      };
    }
    if (settings?.sizingMode === "auto") {
      return {
        display: "block",
      };
    }
    return {};
  };

  const renderImage = React.useCallback(
    (value: "fit-proportional" | "fill" | "crop" | "auto") => {
      if (!imageSrc) return null;
      switch (value) {
        case "fit-proportional":
          return (
            <img
              src={imageSrc}
              alt="random"
              style={{ ...imgStyle, maxHeight: "100%", width: "100%" }}
            />
          );
        case "fill":
          // return (
          //   <TransformWrapper
          //     initialScale={1}
          //     centerOnInit={true}
          //     limitToBounds={true}
          //   >
          //     <TransformComponent
          //       wrapperStyle={{
          //         width: settings.width,
          //         height: settings.height,
          //       }}
          //     >
          //       {imageSrc && (
          //         <img src={imageSrc} alt="random" style={{ ...imgStyle }} />
          //       )}
          //     </TransformComponent>
          //   </TransformWrapper>
          // );
          return (
            <img
              src={imageSrc}
              alt="random"
              style={{ ...imgStyle, height: "100%", width: "100%" }}
            />
          );
        case "crop":
          return (
            <CropComponent
              image={imageSrc}
              width={selectedItem?.options?.width}
              height={selectedItem?.options?.height}
              cropMode={selectedItem?.options?.enableCrop}
              cropCoordinates={selectedItem?.data?.cropCoordinates}
              onCropChange={handleChangeCropCoordinates}
              imgStyle={imgStyle}
            />
          );
        case "auto":
          return (
            <img
              src={imageSrc}
              alt="random"
              style={{ ...imgStyle, height: "auto", width: "100%" }}
            />
          );
        default:
          return null;
      }
    },
    [
      imageSrc,
      settings.width,
      settings.height,
      settings.paddingLeft,
      settings.paddingRight,
      settings.paddingTop,
      settings.paddingBottom,
      settings.sizingMode,
      imgStyle,
      selectedItem?.options?.enableCrop,
      selectedItem?.data?.cropCoordinates,
    ],
  );

  return (
    <React.Fragment>
      <Box
        ref={setAnchor}
        id="image-render"
        onClick={() => triggerImageController(true)}
      >
        {!imageSrc && !viewMode && (
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
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M21 15.4999L17.914 12.4139C17.5389 12.039 17.0303 11.8284 16.5 11.8284C15.9697 11.8284 15.4611 12.039 15.086 12.4139L6 21.4999M5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5ZM11 9.5C11 10.6046 10.1046 11.5 9 11.5C7.89543 11.5 7 10.6046 7 9.5C7 8.39543 7.89543 7.5 9 7.5C10.1046 7.5 11 8.39543 11 9.5Z"
                stroke="#3154F4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography fontSize="16px" color="#3154f4">
              Click to add an image
            </Typography>
          </Box>
        )}
        {imageSrc && (
          <Box
            sx={{
              backgroundColor: "#fff",

              ...settings,
              ...getUniqueStyle(),
              ...(viewMode ? { border: "none" } : {}),
              ...(active ? { borderColor: "#3154f4" } : {}),
            }}
          >
            {renderImage(settings?.sizingMode || "fit-proportional")}
          </Box>
        )}
      </Box>
      {visible &&
        coords &&
        createPortal(
          <Box
            id="tooltip-image-move-pan"
            sx={{
              position: "fixed",
              top: (coords.top ?? 0) + 10,
              left: coords.left - tooltipWidth,
              transform: "translate(-50%, 0)",
              width: "371px",
              height: "62px",
              p: "10px",
              borderRadius: "4px",
              bgcolor: "#000",
              boxShadow: "0 2px 7px 0 rgba(0, 0, 0, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "8px",
              zIndex: 1,
            }}
          >
            <Typography
              fontWeight={700}
              color="#fff"
              fontSize={"14px"}
              margin={0}
            >
              Pan and move to customise
            </Typography>
            <Typography color="#fff" fontSize={"14px"} margin={0}>
              Hold the image and move to select the perfect frame
            </Typography>
          </Box>,
          document.body,
        )}
    </React.Fragment>
  );
};
