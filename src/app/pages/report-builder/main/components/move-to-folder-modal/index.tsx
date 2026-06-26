import React from "react";
import get from "lodash/get";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input/Input";
import Search from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { ReportBuilderMoveToFolderModalProps } from "app/pages/report-builder/main/components/move-to-folder-modal/data";
import {
  useGetFolders,
  useMultiAddItemsToFolder,
} from "app/hooks/queries/report-builder";
import {
  buildTree,
  filterTree,
  FolderTreeItem,
} from "app/pages/report-builder/main/components/move-to-folder-modal/tree-view";

export const ReportBuilderMoveToFolderModal: React.FC<
  ReportBuilderMoveToFolderModalProps
> = ({
  open,
  type,
  items,
  refetch,
  onClose,
  itemLocation,
  folderStructure,
  setOpenedFolders,
  clearSelectedItems,
  refetchOpenedFolder,
}) => {
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    __root__: true,
  });

  const addItemsToFolder = useMultiAddItemsToFolder();
  const allFolders = useGetFolders({
    type,
    search: "",
    includeSubFolders: true,
    sort: "createdDate DESC",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const onSuccess = () => {
    refetch();
    onClose();
    clearSelectedItems();
    const folderIdToOpen = selectedId === "__root__" ? undefined : selectedId;
    if (folderIdToOpen) {
      const items: { id: string; name: string }[] = [];
      const fFolder = get(allFolders, "data.data", []).find(
        (f) => f.id === folderIdToOpen,
      );
      if (fFolder && fFolder.locationPath) {
        const parts = fFolder.locationPath.split(" > ");
        const pathItems = parts.map((name) => {
          if (name === "__root__") {
            return null;
          }
          const folder = get(allFolders, "data.data", []).find(
            (f) => f.name === name,
          );
          return folder ? { id: folder.id, name: folder.name } : null;
        });
        items.push(...(pathItems.filter(Boolean) as any[]));
      } else {
        items.push({
          id: folderIdToOpen,
          name: fFolder ? fFolder.name : "Unknown",
        });
      }
      setOpenedFolders(items.filter(Boolean) as { id: string; name: string }[]);
      setTimeout(() => {
        refetchOpenedFolder();
      }, 100);
    } else {
      setOpenedFolders([]);
    }
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    addItemsToFolder.mutate({ items, folderId: selectedId }, { onSuccess });
  };

  const tree = React.useMemo(
    () => buildTree("__root__", "My Workspace", folderStructure ?? []),
    [folderStructure],
  );

  const filtered = React.useMemo(
    () => filterTree(tree, search),
    [tree, search],
  );

  React.useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedId(null);
      setExpanded({ __root__: true });
    }
  }, [open]);

  return (
    <Modal disableScrollLock open={open} onClose={onClose}>
      <Box
        sx={{
          top: "50%",
          left: "50%",
          width: "500px",
          position: "absolute",
          background: "#ffffff",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            padding: "4px 10px",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #cfd4da",
          }}
        >
          <Typography variant="h6" fontSize="16px">
            Move to Folder
          </Typography>
          <IconButton onClick={onClose} sx={{ mr: "-12px" }}>
            <CloseIcon fontSize="small" htmlColor="#000" />
          </IconButton>
        </Box>
        <Box
          sx={{
            gap: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Input
            value={search}
            disableUnderline
            onChange={handleSearchChange}
            placeholder="Search folders..."
            startAdornment={
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            }
            sx={{
              flexGrow: 1,
              height: "43px",
              fontSize: "14px",
              padding: "0px 8px",
              borderRadius: "4px",
              background: "#f1f3f5",
              border: "1px solid #98a1aa",
            }}
          />
          <Box
            sx={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #cfd4da",
              maxHeight: "260px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {filtered ? (
              <FolderTreeItem
                level={0}
                items={items}
                node={filtered}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={handleToggle}
                onSelect={setSelectedId}
              />
            ) : (
              <Typography fontSize="14px" sx={{ color: "#6b7480", p: "4px" }}>
                No folders found
              </Typography>
            )}
          </Box>
          <Typography fontSize="14px">
            Current location: {itemLocation}
          </Typography>
        </Box>
        <Box
          sx={{
            gap: "10px",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 16px 16px 16px",
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedId}
            sx={{
              fontWeight: "400",
              color: "#ffffff",
              textTransform: "none",
              background: "#3154f4",
            }}
          >
            Move
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
