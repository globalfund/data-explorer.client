import React from "react";
import { colors } from "app/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RBReportItemController } from "app/state/api/action-reducers/report-builder/sync";
import { ComponentOptions } from "../toolbar/data";

export const FileTabView: React.FC = () => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const setSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const handleItemClick = (item: RBReportItemController) => () => {
    setSelectedItem(item);

    const container = document.getElementById("items-container");
    const selectedItemContainer = document.getElementById(
      `container-${item.id}`,
    );

    if (container && selectedItemContainer) {
      container.scrollTo({
        behavior: "smooth",
        top: selectedItemContainer.offsetTop - container.offsetTop,
      });
    }
  };

  return (
    <Box sx={{ padding: "8px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography fontSize="14px">Layers</Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          button: {
            padding: "8px 18px",
            fontSize: "14px",
            fontWeight: "normal",
            textTransform: "capitalize",
            justifyContent: "flex-start",
          },
        }}
      >
        {items.map((item) => {
          const typeIndex = items
            .filter((i) => i.type === item.type)
            .findIndex((i) => i.id === item.id);
          const option = ComponentOptions.find(
            (option) => option.value === item.type,
          );
          return (
            <Button
              key={item.id}
              startIcon={option?.icon}
              onClick={handleItemClick({
                open: true,
                id: item.id,
                type: item.type,
              })}
              sx={
                item.id === selectedItem?.id
                  ? { bgcolor: colors.primary.lightBlue }
                  : {}
              }
            >
              {item.type?.replace("_", " ")} {typeIndex + 1}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};
