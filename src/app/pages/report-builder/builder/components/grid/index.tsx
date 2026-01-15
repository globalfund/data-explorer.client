import React from "react";
import Box from "@mui/material/Box";
import { Editor } from "@tiptap/react";
import { uniqueId } from "app/utils/uniqueId";
import Close from "@mui/icons-material/Close";
import Title from "@mui/icons-material/Title";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVert from "@mui/icons-material/MoreVert";
import { useStoreActions } from "app/state/store/hooks";
import { ReportBuilderPageText } from "app/pages/report-builder/builder/components/text";
import { ReportBuilderPageChart } from "app/pages/report-builder/builder/components/chart";
import { ReportBuilderPageImage } from "app/pages/report-builder/builder/components/image";
import { ReportBuilderPageTable } from "app/pages/report-builder/builder/components/table";
import { ReportBuilderPageItemMenu } from "app/pages/report-builder/builder/components/item-menu";

const containerSx = {
  width: "100%",
  height: "100%",
  "> div": {
    height: "100%",
    "> div": {
      height: "100%",
    },
  },
};

const GridItem: React.FC<{
  index: number;
  setActiveRTE: (id: Editor | null) => void;
  type: null | "text" | "chart" | "table" | "image";
  onTypeChange: (
    index: number,
    type: null | "text" | "chart" | "table" | "image",
  ) => void;
}> = ({ index, type, setActiveRTE, onTypeChange }) => {
  const [showTypes, setShowTypes] = React.useState(false);

  const handleTypeSelect =
    (selectedType: "text" | "chart" | "table" | "image") =>
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onTypeChange(index, selectedType);
      setShowTypes(false);
    };

  const handleRemoveItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTypeChange(index, null);
    setShowTypes(false);
  };

  const content = React.useMemo(() => {
    switch (type) {
      case "text":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageText id={uniqueId()} setEditor={setActiveRTE} />
          </Box>
        );
      case "chart":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageChart
              id={uniqueId()}
              extRemoveItem={handleRemoveItem}
            />
          </Box>
        );
      case "table":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageTable
              id={uniqueId()}
              extRemoveItem={handleRemoveItem}
            />
          </Box>
        );
      case "image":
        return (
          <Box sx={containerSx}>
            <ReportBuilderPageImage id={uniqueId()} />
          </Box>
        );
      default:
        return (
          <React.Fragment>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                fill="#3154F4"
                d="M9 3.75C9.41421 3.75 9.75 4.08579 9.75 4.5V8.25H13.5C13.9142 8.25 14.25 8.58579 14.25 9C14.2499 9.4141 13.9141 9.75 13.5 9.75H9.75V13.5C9.74987 13.9141 9.41413 14.25 9 14.25C8.58595 14.2499 8.25013 13.914 8.25 13.5V9.75H4.5C4.08595 9.7499 3.75013 9.41404 3.75 9C3.75 8.58585 4.08587 8.2501 4.5 8.25H8.25V4.5C8.25 4.08585 8.58587 3.7501 9 3.75Z"
              />
            </svg>
            <Typography fontSize="16px" color="#3154f4">
              Click to add a component
            </Typography>
          </React.Fragment>
        );
    }
  }, [type]);

  return (
    <Box
      sx={{
        gap: "10px",
        width: "100%",
        height: "100px",
        display: "flex",
        cursor: "pointer",
        borderRadius: "4px",
        alignItems: "center",
        bgcolor: "#d6ddfd",
        flexDirection: "row",
        position: "relative",
        padding: !type ? "10px" : 0,
        justifyContent: "flex-start",
        transition: "all 0.3s ease-in-out",
        border: `1px ${!type ? "dashed" : "none"} #3154f4`,
      }}
      onClick={() => {
        if (!type) {
          setShowTypes(true);
        }
      }}
    >
      {content}
      {showTypes && (
        <Box
          sx={{
            top: 0,
            left: 0,
            gap: "5px",
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            "> div": {
              gap: "5px",
              display: "flex",
              cursor: "pointer",
              borderRadius: "4px",
              padding: "5px 10px",
              bgcolor: "#ffffff",
              alignItems: "center",
              flexDirection: "column",
              border: "1px solid #cfd4da",
              "&:hover": {
                bgcolor: "#f8f8f8",
              },
              "> p": {
                color: "#3154f4",
              },
            },
          }}
        >
          <Box onClick={handleTypeSelect("text")}>
            <Title htmlColor="#3154F4" />
            <Typography>Text</Typography>
          </Box>
          <Box onClick={handleTypeSelect("chart")}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                strokeWidth="2"
                stroke="#3154f4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 17.5V9.5M18 17.5V5.5M3 3.5V19.5C3 20.0304 3.21071 20.5391 3.58579 20.9142C3.96086 21.2893 4.46957 21.5 5 21.5H21M8 17.5V14.5"
              />
            </svg>
            <Typography>Chart</Typography>
          </Box>
          <Box onClick={handleTypeSelect("table")}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M12 3.5V21.5M3 9.5H21M3 15.5H21M5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5Z"
                stroke="#3154F4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography>Table</Typography>
          </Box>
          <Box onClick={handleTypeSelect("image")}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path
                d="M21 15.4999L17.914 12.4139C17.5389 12.039 17.0303 11.8284 16.5 11.8284C15.9697 11.8284 15.4611 12.039 15.086 12.4139L6 21.4999M5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5ZM11 9.5C11 10.6046 10.1046 11.5 9 11.5C7.89543 11.5 7 10.6046 7 9.5C7 8.39543 7.89543 7.5 9 7.5C10.1046 7.5 11 8.39543 11 9.5Z"
                stroke="#3154F4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography>Image</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const ReportBuilderPageGrid: React.FC<{
  id: string;
  length: number;
  setEditor: (id: Editor | null) => void;
}> = ({ id, length, setEditor }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [items, setItems] = React.useState<
    (null | "text" | "chart" | "table" | "image")[]
  >(Array(length).fill(null));

  const removeItem = useStoreActions(
    (actions) => actions.RBReportItemsState.removeItem,
  );

  const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteItem = () => {
    removeItem(id);
    handleClose();
  };

  const handleItemTypeChange = (
    index: number,
    type: null | "text" | "chart" | "table" | "image",
  ) => {
    const newItems = [...items];
    newItems[index] = type;
    setItems(newItems);
  };

  const gridReady = React.useMemo(
    () => items.some((item) => item !== null),
    [items],
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        "&:hover": {
          ".top-right-actions": {
            display: "flex",
            height: "fit-content",
          },
        },
      }}
    >
      <Box
        sx={{
          gap: "10px",
          width: "100%",
          display: "grid",
          padding: "10px",
          cursor: "pointer",
          borderRadius: "4px",
          border: "1px dashed #3154f4",
          transition: "all 0.3s ease-in-out",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {items.map((item, i) => (
          <GridItem
            key={i}
            index={i}
            type={item}
            setActiveRTE={setEditor}
            onTypeChange={handleItemTypeChange}
          />
        ))}
      </Box>
      <Box className="top-right-actions">
        {gridReady && (
          <React.Fragment>
            <IconButton onClick={handleMoreVertClick}>
              <MoreVert fontSize="small" />
            </IconButton>
            <ReportBuilderPageItemMenu
              itemId={id}
              anchorEl={anchorEl}
              deleteItem={handleDeleteItem}
              handleClose={() => setAnchorEl(null)}
            />
          </React.Fragment>
        )}
        {!gridReady && (
          <IconButton onClick={handleDeleteItem}>
            <Close fontSize="small" htmlColor="#ea1541" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
