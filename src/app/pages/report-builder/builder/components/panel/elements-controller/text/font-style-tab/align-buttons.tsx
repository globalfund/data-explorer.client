import React from "react";
import AlignTop from "app/assets/vectors/RBAlignTop.svg?react";
import AlignCenter from "app/assets/vectors/RBAlignCenter.svg?react";
import AlignBottom from "app/assets/vectors/RBAlignBottom.svg?react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useStoreActions, useStoreState } from "app/state/store/hooks";

export default function AlignButtons() {
  const selectedController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const item = items.find((i) => i.id === selectedController?.id);

  const handleAlignChange = (align: "start" | "center" | "end") => {
    if (!item) return;

    const currentAlign = item?.settings?.alignItems;
    const isRemoving = currentAlign === align;
    const newAlign = isRemoving ? undefined : align;
    const newDisplay = isRemoving ? "block" : "flex";

    editItem({
      ...item,
      open: selectedController?.open || false,
      id: selectedController?.id || "",
      type: "text",
      settings: {
        ...item?.settings,
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
          item?.settings?.alignItems === "start"
            ? "active-icon-button"
            : "icon-button"
        }
      >
        <AlignTop />
      </IconButton>
      <IconButton
        onClick={() => handleAlignChange("center")}
        className={
          item?.settings?.alignItems === "center"
            ? "active-icon-button"
            : "icon-button"
        }
      >
        <AlignCenter />
      </IconButton>

      <IconButton
        onClick={() => handleAlignChange("end")}
        className={
          item?.settings?.alignItems === "end"
            ? "active-icon-button"
            : "icon-button"
        }
      >
        <AlignBottom />
      </IconButton>
    </Box>
  );
}
