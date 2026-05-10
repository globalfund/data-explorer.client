import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { RBReportItemController } from "app/state/api/action-reducers/report-builder/sync";
import { ComponentOptions } from "../toolbar/data";
import EditableDiv from "app/components/editable-div";
import useEditReportItem from "app/pages/report-builder/hooks/useEditReportItem";
import useDragReportComponent from "app/pages/report-builder/hooks/useDragReportComponent";

const DragWrapper: React.FC<{
  children: React.ReactNode;
  id: string;
  index: number;
}> = ({ children, id, index }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { drag, drop, handlerId, isDragging } = useDragReportComponent({
    id,
    index,
    ref,
  });

  drag(drop(ref));
  return (
    <Box
      id={`item-${id}`}
      data-handler-id={handlerId}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        display: "flex",
        flexDirection: "column",
      }}
      ref={ref}
    >
      {children}
    </Box>
  );
};

export const FileTabView: React.FC = () => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const selectedItem = useStoreState(
    (state) => state.RBReportItemsControllerState.item,
  );

  const setSelectedItem = useStoreActions(
    (actions) => actions.RBReportItemsControllerState.setItem,
  );

  const editItem = useEditReportItem();

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

  const handleTitleChange = ({
    newTitle,
    itemId,
    parentId,
  }: {
    newTitle: string;
    itemId: string;
    parentId?: string;
  }) => {
    editItem({
      id: itemId,
      name: newTitle,
      parentId,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px",
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
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "normal",
            textTransform: "capitalize",
            justifyContent: "flex-start",
            borderRadius: 0,
            span: {
              marginLeft: 0,
            },
          },
        }}
      >
        {items.map((item, itemIndex) => {
          const typeIndex = items
            .filter((i) => i.type === item.type)
            .findIndex((i) => i.id === item.id);
          const option = ComponentOptions.find(
            (option) => option.value === item.type,
          );
          return (
            <DragWrapper id={item.id} index={itemIndex} key={item.id}>
              <Button
                startIcon={option?.icon}
                onClick={handleItemClick({
                  open: true,
                  id: item.id,
                  type: item.type,
                })}
                sx={item.id === selectedItem?.id ? { bgcolor: "#d6ddfd" } : {}}
              >
                <EditableDiv
                  title={
                    item.name || item.type?.replace("_", " ") + (typeIndex + 1)
                  }
                  onTitleChange={(newTitle) =>
                    handleTitleChange({ newTitle, itemId: item.id })
                  }
                />
              </Button>

              {item.type === "column" || item.type === "grid" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    button: {
                      padding: "8px 32px",
                    },
                  }}
                >
                  {item.data.items.map((subItem) => {
                    const subTypeIndex = item.data.items
                      .filter((i) => i.type === subItem.type)
                      .findIndex((i) => i.id === subItem.id);
                    const subOption = ComponentOptions.find(
                      (option) => option.value === subItem.type,
                    );

                    if (!subOption) return null;
                    return (
                      <Button
                        key={subItem.id}
                        startIcon={subOption?.icon}
                        onClick={handleItemClick({
                          open: true,
                          id: subItem.id,
                          type: subItem.type,
                          parent: {
                            id: item.id,
                            type: item.type,
                            open: false,
                          },
                        })}
                        sx={
                          subItem.id === selectedItem?.id
                            ? { bgcolor: "#d6ddfd" }
                            : {}
                        }
                      >
                        <EditableDiv
                          title={
                            subItem.name ||
                            subItem.type?.replace("_", " ") + (subTypeIndex + 1)
                          }
                          onTitleChange={(newTitle) =>
                            handleTitleChange({
                              newTitle,
                              itemId: subItem.id,
                              parentId: item.id,
                            })
                          }
                        />
                      </Button>
                    );
                  })}
                </Box>
              ) : null}
            </DragWrapper>
          );
        })}
      </Box>
    </Box>
  );
};
