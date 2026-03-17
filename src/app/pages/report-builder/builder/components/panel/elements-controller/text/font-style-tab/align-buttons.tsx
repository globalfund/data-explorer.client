import React from "react";
import AlignTop from "app/assets/vectors/RBAlignTop.svg?react";
import AlignCenter from "app/assets/vectors/RBAlignCenter.svg?react";
import AlignBottom from "app/assets/vectors/RBAlignBottom.svg?react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useStoreState } from "app/state/store/hooks";
import useGetReportItemState from "app/pages/report-builder/hooks/useGetReportItemState";

export default function AlignButtons() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const { selectedItem: item, editItem } = useGetReportItemState<"text">({
    id: selectedController?.id || "",
    parent: selectedController?.parent ?? undefined,
  });

  const handleAlignChange = (align: "start" | "center" | "end") => {
    if (!item) return;

    const currentAlign = item?.options?.alignItems;
    const isRemoving = currentAlign === align;
    const newAlign = isRemoving ? undefined : align;
    const newDisplay = isRemoving ? "block" : "flex";

    editItem({
      ...item,
      open: selectedController?.open || false,
      id: selectedController?.id || "",
      type: "text",
      options: {
        ...item?.options,
        alignItems: newAlign,
        display: newDisplay,
      },
    });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "13px" }}>
      <IconButton
        onClick={() => handleAlignChange("start")}
        className={
          item?.options?.alignItems === "start"
            ? "active-icon-button"
            : "icon-button"
        }
      >
        <AlignTop />
      </IconButton>
      <IconButton
        onClick={() => handleAlignChange("center")}
        className={
          item?.options?.alignItems === "center"
            ? "active-icon-button"
            : "icon-button"
        }
      >
        <AlignCenter />
      </IconButton>

      <IconButton
        onClick={() => handleAlignChange("end")}
        className={
          item?.options?.alignItems === "end"
            ? "active-icon-button"
            : "icon-button"
        }
      >
        <AlignBottom />
      </IconButton>
    </Box>
  );
}
