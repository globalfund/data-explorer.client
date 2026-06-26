export interface ReportBuilderMultiDeleteModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  checkedItems: {
    id: string;
    type: "report" | "folder" | "asset";
  }[];
  setCheckedItems: (
    items: { id: string; type: "report" | "folder" | "asset" }[],
  ) => void;
}
