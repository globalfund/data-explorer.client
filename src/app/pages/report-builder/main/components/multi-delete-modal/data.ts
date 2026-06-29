import { RBItemTypes } from "app/pages/report-builder/data";

export interface ReportBuilderMultiDeleteModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  checkedItems: {
    id: string;
    type: RBItemTypes;
  }[];
  setCheckedItems: (items: { id: string; type: RBItemTypes }[]) => void;
}
