import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useClickOutsideEditor } from "app/hooks/useClickOutsideEditorComponent";
import { useTooltip } from "app/hooks/useTooltip";
import { createPortal } from "react-dom";
import { CropComponent } from "./crop";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";
import PanComponent from "./transform";

type SavedTransform = {
  scale: number;
  positionX: number;
  positionY: number;
};

export const ReportBuilderPageImage: React.FC<{
  id: string;
  viewMode?: boolean;
  parent?: {
    id: string;
    type: "grid" | "column";
  };
}> = ({ id, viewMode, parent }) => {
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

  const setSelectedController = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );
  const clearSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.clearItem,
  );
  const { selectedItem, editItem } = useGetReportItemState<"image">({
    id,
    parent,
  });

  const hasParent = !!parent?.id;

  const {
    imgOpacity,
    imgBorderWidth,
    imgBorderColor,
    imgBorderRadius,
    imgBackgroundColor,
    ...settings
  } = selectedItem?.options || {};

  const imgStyle = {
    opacity: imgOpacity || 1,
  };

  const borderStyle = {
    borderWidth: imgBorderWidth || "0px",
    borderColor: imgBorderColor || "#000000",
    borderRadius: imgBorderRadius || "0px",
    backgroundColor: imgBackgroundColor || "#ffffff",
    borderStyle: "solid",
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

  const handleChangeTransformCoordinates = (coordinates: SavedTransform) => {
    editItem({
      ...selectedItem,
      id: id || "",
      open: selectedItem?.open || false,
      type: "image",
      data: {
        ...selectedItem?.data,
        transformCoordinates: coordinates,
      },
    });
  };

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
    modalId: "save-as-asset-modal",
    onOutsideClick: () => {
      clearSelectedItem();
    },
  });

  const triggerImageController = (open: boolean) => {
    if (viewMode) return;
    if (parent) {
      setSelectedController({
        type: "image",
        open,
        id,
        parent: {
          id: parent.id,
          open: false,
          type: parent.type,
        },
      });
    } else {
      setSelectedController({
        type: "image",
        open,
        id,
      });
    }
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
              style={{
                ...imgStyle,
                height: "100%",
                width: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          );
        case "fill":
          return (
            <PanComponent
              imageSrc={imageSrc}
              handleChangeTransformCoordinates={
                handleChangeTransformCoordinates
              }
              viewMode={viewMode}
              selectedItem={selectedItem}
              imgStyle={imgStyle}
            />
          );
        case "crop":
          return (
            <CropComponent
              image={imageSrc}
              width={hasParent ? "100%" : selectedItem?.options?.width}
              height={hasParent ? "100%" : selectedItem?.options?.height}
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
              style={{
                ...imgStyle,
                height: "auto",
                width: "100%",
                display: "block",
              }}
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
      hasParent,
      selectedItem,
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
              height: hasParent ? "100%" : "220px",
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
              ...settings,
              ...borderStyle,
              overflow: "hidden",
              width: hasParent ? "100%" : settings.width,
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
