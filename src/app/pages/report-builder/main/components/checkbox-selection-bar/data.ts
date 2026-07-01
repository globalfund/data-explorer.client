export interface CheckboxSelectionBarProps {
  onDeleteCheckedItems: () => void;
  onMoveToFolderCheckedItems: () => void;
  checkedItems: { id: string; type: "folder" | "report" | "asset" }[];
  setCheckedItems: React.Dispatch<
    React.SetStateAction<{ id: string; type: "folder" | "report" | "asset" }[]>
  >;
}
