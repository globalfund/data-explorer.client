import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { RBFolderModelResponse } from "app/state/api/action-reducers/report-builder/sync";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface FolderTreeItemProps {
  level: number;
  node: TreeNode;
  items: {
    id: string;
    name: string;
    locationPath: string;
    type: "folder" | "report" | "asset";
  }[];
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  expanded: Record<string, boolean>;
}

export const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  node,
  items,
  level,
  expanded,
  onToggle,
  onSelect,
  selectedId,
}) => {
  const hasChildren = React.useMemo(
    () => !!node.children && node.children.length > 0,
    [node.children],
  );

  const isExpanded = React.useMemo(
    () => expanded[node.id] ?? true,
    [expanded, node.id],
  );

  const isSelected = React.useMemo(
    () => selectedId === node.id,
    [selectedId, node.id],
  );

  const isDisabled = React.useMemo(
    () => items.some((item) => item.id === node.id && item.type === "folder"),
    [node.id, items],
  );

  return (
    <>
      <Box
        onClick={() => !isDisabled && onSelect(node.id)}
        sx={{
          gap: "6px",
          display: "flex",
          padding: "4px 6px",
          alignItems: "center",
          borderRadius: "4px",
          paddingLeft: `${6 + level * 24}px`,
          cursor: isDisabled ? "not-allowed" : "pointer",
          background: isSelected ? "#e8ecff" : "transparent",
          "&:hover": {
            background: isSelected ? "#e8ecff" : "#f1f3f5",
          },
        }}
      >
        <Box
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
          sx={{
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hasChildren ? "pointer" : "default",
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <KeyboardArrowDown sx={{ fontSize: "16px" }} />
            ) : (
              <KeyboardArrowRight sx={{ fontSize: "16px" }} />
            )
          ) : null}
        </Box>
        <FolderOutlined
          sx={{ fontSize: "16px" }}
          htmlColor={isDisabled ? "#b0b0b0" : "inherit"}
        />
        <Typography
          fontSize="14px"
          sx={{ color: isDisabled ? "#b0b0b0" : "inherit" }}
        >
          {node.name}
        </Typography>
      </Box>
      {hasChildren && isExpanded && (
        <>
          {node.children!.map((child) => (
            <FolderTreeItem
              node={child}
              key={child.id}
              items={items}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </>
      )}
    </>
  );
};

export const buildTree = (
  id: string,
  name: string,
  folders: RBFolderModelResponse[],
): TreeNode => ({
  id,
  name,
  children: folders.map((f) => buildTree(f.id, f.name, f.children ?? [])),
});

export const filterTree = (node: TreeNode, query: string): TreeNode | null => {
  const q = query.trim().toLowerCase();
  if (!q) return node;
  const filteredChildren =
    node.children
      ?.map((c) => filterTree(c, query))
      .filter((c): c is TreeNode => c !== null) ?? [];
  if (
    node.name.toLowerCase().includes(q) ||
    filteredChildren.length > 0 ||
    node.id === "__root__"
  ) {
    return { ...node, children: filteredChildren };
  }
  return null;
};
