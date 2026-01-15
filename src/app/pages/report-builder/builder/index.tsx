import React from "react";
import Box from "@mui/material/Box";
import { DndProvider } from "react-dnd";
import update from "immutability-helper";
import Divider from "@mui/material/Divider";
import { uniqueId } from "app/utils/uniqueId";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { Empty } from "app/pages/report-builder/builder/components/empty";
import { RBReportItem } from "app/state/api/action-reducers/report-builder/sync";
import { ReportBuilderPageGrid } from "app/pages/report-builder/builder/components/grid";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";
import { ItemComponent } from "app/pages/report-builder/builder/components/order-container";
import ElementsController from "./components/panel/elements-controller";
import KPIBox from "./components/kpi";

export const ReportBuilderPage: React.FC = () => {
  const items = useStoreState((state) => state.RBReportItemsState.items);
  const setActiveRTE = useStoreActions(
    (actions) => actions.RBReportRTEState.setActiveRTE,
  );
  const addedItemRef = React.useRef(items.length > 0);

  const setItems = useStoreActions(
    (actions) => actions.RBReportItemsState.setItems,
  );
  const removeItem = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );
  const reportSettings = useStoreState((state) => state.RBReportSettingsState);
  const reportSettingsActions = useStoreActions(
    (actions) => actions.RBReportSettingsState,
  );
  const setNotes = useStoreActions(
    (actions) => actions.RBReportNotesState.setValue,
  );
  const addItem = useStoreActions(
    (actions) => actions.RBReportItemsState.addItem,
  );

  const moveItem = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setItems(
        update(items, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, items[dragIndex] as RBReportItem],
          ],
        }),
      );
    },
    [items],
  );

  const getItemByType = (item: RBReportItem, index: number) => {
    switch (item.type) {
      case "text":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <ReportBuilderPageText
              id={item.id}
              setEditor={setActiveRTE}
              settings={item.settings}
              focus={item.extra?.focus}
              initialKey={item.extra?.key}
            />
          </ItemComponent>
        );
      case "chart":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <ReportBuilderPageChart id={item.id} />
          </ItemComponent>
        );
      case "table":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <ReportBuilderPageTable id={item.id} />
          </ItemComponent>
        );
      case "image":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <ReportBuilderPageImage id={item.id} />
          </ItemComponent>
        );
      case "grid":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <ReportBuilderPageGrid
              length={4}
              id={item.id}
              setEditor={setActiveRTE}
            />
          </ItemComponent>
        );
      case "kpi_box":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <KPIBox id={item.id} />
          </ItemComponent>
        );
      case "column":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <ReportBuilderPageGrid
              length={2}
              id={item.id}
              setEditor={setActiveRTE}
            />
          </ItemComponent>
        );
      case "section_divider":
        return (
          <ItemComponent
            id={item.id}
            index={index}
            childrenData={[]}
            moveItem={moveItem}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                position: "relative",
                flexDirection: "column",
                ".top-right-actions": {
                  top: -19,
                  right: -45,
                  display: "flex",
                  height: "fit-content",
                },
              }}
            >
              <Divider key={item.id} flexItem />
              <Box className="top-right-actions">
                <IconButton onClick={() => removeItem(item.id)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </ItemComponent>
        );
      default:
        return <React.Fragment key={item.id} />;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !addedItemRef.current &&
      /^[a-zA-Z0-9]$/.test(e.key) &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      addItem({
        id: uniqueId(),
        type: "text",
        open: true,
        extra: { focus: true, key: e.key },
        settings: {
          paddingTop: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingBottom: "10px",
          borderWidth: "0px",
          borderColor: "#000000",
          borderRadius: "8px",
          backgroundColor: "#ffffff00",
          width: "100%",
        },
      });
      addedItemRef.current = true;
    }
  };

  React.useEffect(() => {
    if (parseInt(reportSettings.width, 10) < 300) {
      reportSettingsActions.setWidth(
        (window.innerWidth > 1440 ? 1392 : window.innerWidth - 32).toString(),
      );
    }
    if (parseInt(reportSettings.height, 10) < 300) {
      reportSettingsActions.setHeight((window.innerHeight - 110).toString());
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      setNotes("");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    if (items.length === 0) {
      addedItemRef.current = false;
    } else {
      addedItemRef.current = true;
    }
  }, [items.length]);

  // const parsedReportSettings = React.useMemo(() => {
  //   return {
  //     width:
  //       parseInt(reportSettings.width, 10) < 300
  //         ? 300
  //         : parseInt(reportSettings.width, 10),
  //     height:
  //       parseInt(reportSettings.height, 10) < 300
  //         ? 300
  //         : parseInt(reportSettings.height, 10),
  //     hPadding:
  //       parseInt(reportSettings.hPadding, 10) < 0
  //         ? 0
  //         : parseInt(reportSettings.hPadding, 10),
  //     vPadding:
  //       parseInt(reportSettings.vPadding, 10) < 0
  //         ? 0
  //         : parseInt(reportSettings.vPadding, 10),
  //     stroke:
  //       parseInt(reportSettings.stroke, 10) < 0
  //         ? 0
  //         : parseInt(reportSettings.stroke, 10),
  //     strokeColor: reportSettings.strokeColor,
  //   };
  // }, [reportSettings]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          top: 68,
          right: "20px",
          position: "fixed",
          width: "300px",
          zIndex: 2,
        }}
      >
        <ElementsController />
      </Box>
      <DndProvider backend={HTML5Backend}>
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "overlay",
            bgcolor: "#ffffff",
            height: "fit-content",
            paddingBottom: "40px",
            boxShadow: "0 0 10px 0 rgba(152, 161, 170, 0.60)",
          }}
        >
          <Box
            id="report-builder-canvas"
            sx={{
              gap: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: `${reportSettings.width}px`,
              height: `${reportSettings.height}px`,
              p: `${reportSettings.vPadding}px ${reportSettings.hPadding}px`,
              border: `${reportSettings.stroke}px solid ${reportSettings.strokeColor}`,
              ".top-right-actions": {
                top: 4,
                right: 4,
                position: "absolute",
                ".MuiIconButton-root": {
                  width: "38px",
                  height: "38px",
                  bgcolor: "#fff",
                  borderRadius: "4px",
                  border: "1px solid #cfd4da",
                  "&:hover": {
                    bgcolor: "#f8f8f8",
                    borderColor: "#000000",
                  },
                },
              },
            }}
          >
            {items.length === 0 && <Empty />}
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {getItemByType(item, index)}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </DndProvider>
    </Box>
  );
};
