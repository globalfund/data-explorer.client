import { RBFolderModelResponse } from "app/state/api/action-reducers/report-builder/sync";

export interface ReportBuilderMoveToFolderModalProps {
  open: boolean;
  itemId: string;
  itemName: string;
  refetch: () => void;
  onClose: () => void;
  itemLocation: string;
  type: "report" | "asset";
  itemType: "report" | "asset" | "folder";
  refetchOpenedFolder: () => void;
  folderStructure: RBFolderModelResponse[];
  setOpenedFolders: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
      }[]
    >
  >;
}
