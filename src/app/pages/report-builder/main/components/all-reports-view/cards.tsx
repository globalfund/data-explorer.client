import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import capitalize from "lodash/capitalize";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVert from "@mui/icons-material/MoreVert";
import GridIcon from "app/assets/vectors/RBGrid.svg?react";
import ChartIcon from "app/assets/vectors/RBChart.svg?react";
import ImageIcon from "app/assets/vectors/RBImage.svg?react";
import ColumnIcon from "app/assets/vectors/RBColumn.svg?react";
import FolderIcon from "app/assets/vectors/FolderBig.svg?react";
import LetterTextIcon from "app/assets/vectors/Letter_Text.svg?react";
import EmptyFolderIcon from "app/assets/vectors/EmptyFolder.svg?react";
import {
  ReportCardProps,
  FolderCardProps,
  AssetCardProps,
} from "app/pages/report-builder/main/components/all-reports-view/data";
import { format } from "date-fns";

export const ReportCard: React.FC<ReportCardProps> = ({
  id,
  name,
  description,
  imageVersion,
  handleItemClick,
  handleEditClick,
  handleRenameEnter,
  handleItemMenuClick,
  selectedItemForRenaming,
  setSelectedItemForRenaming,
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
              backgroundImage: `url(${import.meta.env.VITE_API}/report-thumbnail/${id}.png?v=${imageVersion})`,
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
        <IconButton id={id} onClick={handleItemMenuClick} sx={{ p: "0px" }}>
          <MoreVert htmlColor="#454545" />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};

export const AssetCard: React.FC<AssetCardProps> = ({
  id,
  name,
  type,
  createdDate,
  imageVersion,
  handleItemClick,
  handleRenameEnter,
  handleItemMenuClick,
  selectedItemForRenaming,
  setSelectedItemForRenaming,
  handleUseAsset,
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    chart: <ChartIcon />,
    column: <ColumnIcon />,
    text: <LetterTextIcon />,
    grid: <GridIcon />,
    image: <ImageIcon />,
  };

  return (
    <React.Fragment>
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
            backgroundImage: `url(${import.meta.env.VITE_API}/asset-thumbnail/${id}.png?v=${imageVersion})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          },
        }}
        onClick={handleItemClick(id, "asset")}
      >
        <div />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          marginTop: "12px",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {type && (
          <Box
            sx={{
              borderRadius: "4px",
              background: "#D6DDFD",
              gap: "4px",
              alignItems: "center",
              padding: "3px 5.5px",
              display: "flex",
            }}
          >
            {iconMap[type]}
            <Typography variant="body2" fontSize={"16px"}>
              {capitalize(type)}
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          marginTop: "12px",
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
              handleRenameEnter(id, "asset");
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSelectedItemForRenaming(null);
              }
              if (e.key === "Enter") {
                handleRenameEnter(id, "asset");
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
            onClick={handleItemClick(id, "asset")}
          >
            {name}
          </Typography>
        )}
      </Box>
      <Typography
        variant="body2"
        width="calc(100% - 40px)"
        sx={{ cursor: "pointer", lineHeight: "normal", marginTop: "4px" }}
        onClick={handleItemClick(id, "asset")}
      >
        Saved on {format(createdDate, "dd-MM-yyyy")}
      </Typography>
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
        <Button onClick={handleUseAsset(id)}>{"+  Use Asset"}</Button>
        <Button onClick={handleItemClick(id, "asset")}>Preview</Button>
        <IconButton id={id} onClick={handleItemMenuClick} sx={{ p: "0px" }}>
          <MoreVert htmlColor="#454545" />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};

export const FolderCard: React.FC<FolderCardProps> = ({
  id,
  name,
  assetCount,
  reportCount,
  folderCount,
  handleItemClick,
  handleRenameEnter,
  handleItemMenuClick,
  selectedItemForRenaming,
  setSelectedItemForRenaming,
}) => {
  const text = React.useMemo(() => {
    if (assetCount === 0 && reportCount === 0 && folderCount === 0) {
      return "Empty Folder";
    }
    if (assetCount > 0 && reportCount === 0 && folderCount === 0) {
      return `${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount > 0 && reportCount > 0 && folderCount === 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount > 0 && reportCount === 0 && folderCount > 0) {
      return `${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
    }
    if (assetCount === 0 && reportCount > 0 && folderCount === 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} inside`;
    }
    if (assetCount === 0 && reportCount > 0 && folderCount > 0) {
      return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} inside`;
    }
    return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"}, ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} and ${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} inside`;
  }, [assetCount, reportCount, folderCount]);

  const disableClick = React.useMemo(() => {
    return reportCount === 0 && assetCount === 0 && folderCount === 0;
  }, [reportCount, assetCount, folderCount]);

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
            alignItems: "center",
            bgcolor: "#f8f9fa",
            flexDirection: "column",
            justifyContent: "center",
            cursor: disableClick ? "default" : "pointer",
          }}
          onClick={!disableClick ? handleItemClick(id, "folder") : undefined}
        >
          {assetCount === 0 && reportCount === 0 && folderCount === 0 ? (
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
              sx={{ cursor: disableClick ? "default" : "pointer" }}
              onClick={
                !disableClick ? handleItemClick(id, "folder") : undefined
              }
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
        <Button disabled={disableClick} onClick={handleItemClick(id, "folder")}>
          Open Folder
        </Button>
        <IconButton
          id={id}
          name="folder"
          sx={{ p: "0px" }}
          onClick={handleItemMenuClick}
        >
          <MoreVert htmlColor="#454545" />
        </IconButton>
      </Box>
    </React.Fragment>
  );
};
