import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import FolderIcon from "app/assets/vectors/FolderBig.svg?react";
import EmptyFolderIcon from "app/assets/vectors/EmptyFolder.svg?react";

export const ReportCard: React.FC<{
  id: string;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  selectedItemForRenaming: string | null;
  setSelectedItemForRenaming: (id: string | null) => void;
  handleRenameEnter: (id: string, type: "report" | "folder") => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemClick: (id: string, type: "report" | "folder") => () => void;
  handleEditClick: (id: string) => () => void;
}> = ({
  id,
  name,
  description,
  selectedItemForRenaming,
  setSelectedItemForRenaming,
  handleRenameEnter,
  handleItemMenuClick,
  handleItemClick,
  handleEditClick,
}) => {
  return (
    <React.Fragment>
      <Box>
        <Box
          sx={{
            width: "100%",
            height: "180px",
            display: "flex",
            paddingTop: "8px",
            cursor: "pointer",
            justifyContent: "center",
            div: {
              width: "calc(100% - 10px)",
              backgroundImage: `url(${import.meta.env.VITE_API}/report-thumbnail/${id}.png)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            },
          }}
          onClick={handleItemClick(id, "report")}
        >
          <div />
        </Box>
        <Box
          sx={{
            margin: "10px 0 5px 0",
          }}
        >
          {selectedItemForRenaming === id ? (
            <TextField
              fullWidth
              autoFocus
              size="small"
              variant="standard"
              defaultValue={name}
              id={`rename-field-${id}`}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              onBlur={(e) => {
                if (e.relatedTarget?.id === "rb-item-menu-paper") {
                  return;
                }
                handleRenameEnter(id, "report");
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSelectedItemForRenaming(null);
                }
                if (e.key === "Enter") {
                  handleRenameEnter(id, "report");
                }
              }}
              sx={{
                input: {
                  fontWeight: "700",
                  pl: "0 !important",
                },
                ".MuiInputBase-root:before, .MuiInputBase-root:after": {
                  borderBottom: "2px solid #3154F4 !important",
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              fontSize="16px"
              lineHeight="normal"
              sx={{ cursor: "pointer" }}
              onClick={handleItemClick(id, "report")}
            >
              {name}
            </Typography>
          )}
        </Box>
        <Typography
          variant="body2"
          width="calc(100% - 40px)"
          sx={{ cursor: "pointer" }}
          onClick={handleItemClick(id, "report")}
        >
          {description}
        </Typography>
      </Box>
      <Box
        sx={{
          gap: "10px",
          width: "100%",
          display: "flex",
          marginTop: "12px",
          alignItems: "center",
          "> button:not(:last-child)": {
            flex: "1",
            fontSize: "14px",
            bgcolor: "#fff",
            fontWeight: "400",
            height: "36px",
            borderRadius: "4px",
            lineHeight: "normal",
            textTransform: "none",
            border: "1px solid #98a1aa",
            ":hover": {
              borderColor: "#3154f4",
            },
          },
        }}
      >
        <Button onClick={handleEditClick(id)}>Edit</Button>
        <Button onClick={handleItemClick(id, "report")}>Preview</Button>
        <IconButton id={id} onClick={handleItemMenuClick}>
          <MoreVert />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};

export const FolderCard: React.FC<{
  id: string;
  name: string;
  assetCount: number;
  reportCount: number;
  createdDate: string;
  updatedDate: string;
  selectedItemForRenaming: string | null;
  setSelectedItemForRenaming: (id: string | null) => void;
  handleRenameEnter: (id: string, type: "report" | "folder") => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemClick: (id: string, type: "report" | "folder") => () => void;
}> = ({
  id,
  name,
  assetCount,
  reportCount,
  selectedItemForRenaming,
  setSelectedItemForRenaming,
  handleRenameEnter,
  handleItemMenuClick,
  handleItemClick,
}) => {
  const text = React.useMemo(() => {
    if (assetCount === 0 && reportCount === 0) {
      return "Empty Folder";
    }
    if (assetCount > 0 && reportCount === 0) {
      return `${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount === 0 && reportCount > 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} inside`;
    }
    return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
  }, [assetCount, reportCount]);

  return (
    <React.Fragment>
      <Box>
        <Box
          sx={{
            gap: "10px",
            width: "100%",
            height: "180px",
            display: "flex",
            paddingTop: "8px",
            cursor: "pointer",
            alignItems: "center",
            bgcolor: "#f8f9fa",
            flexDirection: "column",
            justifyContent: "center",
          }}
          onClick={handleItemClick(id, "folder")}
        >
          {assetCount === 0 && reportCount === 0 ? (
            <React.Fragment>
              <EmptyFolderIcon />
              <Typography fontSize="14px">{text}</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FolderIcon />
              <Typography fontSize="14px">{text}</Typography>
            </React.Fragment>
          )}
        </Box>
        <Box
          sx={{
            margin: "10px 0 5px 0",
          }}
        >
          {selectedItemForRenaming === id ? (
            <TextField
              fullWidth
              autoFocus
              size="small"
              variant="standard"
              defaultValue={name}
              id={`rename-field-${id}`}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              onBlur={(e) => {
                if (e.relatedTarget?.id === "rb-item-menu-paper") {
                  return;
                }
                handleRenameEnter(id, "folder");
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSelectedItemForRenaming(null);
                }
                if (e.key === "Enter") {
                  handleRenameEnter(id, "folder");
                }
              }}
              sx={{
                input: {
                  fontWeight: "700",
                  pl: "0 !important",
                },
                ".MuiInputBase-root:before, .MuiInputBase-root:after": {
                  borderBottom: "2px solid #3154F4 !important",
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              fontSize="16px"
              lineHeight="normal"
              sx={{ cursor: "pointer" }}
              onClick={handleItemClick(id, "folder")}
            >
              {name}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          gap: "10px",
          width: "100%",
          display: "flex",
          marginTop: "12px",
          alignItems: "center",
          "> button:not(:last-child)": {
            flex: "1",
            fontSize: "14px",
            bgcolor: "#fff",
            fontWeight: "400",
            height: "36px",
            borderRadius: "4px",
            lineHeight: "normal",
            textTransform: "none",
            border: "1px solid #98a1aa",
            ":hover": {
              borderColor: "#3154f4",
            },
          },
        }}
      >
        <Button
          disabled={reportCount === 0}
          onClick={handleItemClick(id, "folder")}
        >
          Open Folder
        </Button>
        <IconButton id={id} name="folder" onClick={handleItemMenuClick}>
          <MoreVert />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};
