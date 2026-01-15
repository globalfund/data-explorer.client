import { Box, TextField, Typography } from "@mui/material";
import SearchIcon from "app/assets/vectors/Search_grants.svg?react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import React from "react";
import { remoteImages } from "app/pages/report-builder/builder/components/image/data";

export function ImageSource() {
  const selectedItemController = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );
  const editItem = useStoreActions(
    (actions) => actions.RBReportItemsState.editItem,
  );
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = items.find((i) => i.id === selectedItemController?.id);

  const handleImageSelect = (url: string) => {
    editItem({
      ...selectedItem,
      open: selectedItem?.open || false,
      id: selectedItemController?.id || "",
      type: "image",
      extra: {
        ...selectedItem?.extra,
        image: {
          ...selectedItem?.extra?.image,
          src: url,
        },
      },
    });
  };
  return (
    <Box sx={{ py: "16px", px: "8px" }}>
      <Typography sx={{ color: "#373D43" }}>
        Search from Unsplash catalog
      </Typography>
      <Box
        sx={{
          borderRadius: "5px",
          bgcolor: "#FFFFFF",
          border: "1px solid #ADB5BD",
          p: "4px 8px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          my: "16px",
          svg: {
            width: "16px",
            height: "16px",
          },
        }}
      >
        <SearchIcon />
        <TextField
          variant="standard"
          value={""}
          fullWidth
          slotProps={{
            input: { disableUnderline: true },
          }}
          placeholder="Search professional photos..."
        />
      </Box>

      <Box
        sx={{
          gap: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {remoteImages.map((src) => (
          <Box
            key={src}
            onClick={() => handleImageSelect(src)}
            sx={{
              width: "284px",
              height: "136px",
              display: "flex",
              cursor: "pointer",
              border: "1px solid",
              borderRadius: "8px",
              alignItems: "center",
              bgcolor: "#f1f1f1",
              justifyContent: "center",
              //   borderColor: selected === i.toString() ? "#3154F4" : "#adb5bd",
            }}
          >
            <Box
              sx={{
                width: "256px",
                height: "108.8px",
                bgcolor: "#fff",
                borderRadius: "8px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
