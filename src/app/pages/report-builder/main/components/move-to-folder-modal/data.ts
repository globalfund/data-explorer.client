import { RBFolderModelResponse } from "app/state/api/action-reducers/report-builder/sync";

export interface ReportBuilderMoveToFolderModalProps {
  open: boolean;
  items: {
    id: string;
    name: string;
    locationPath: string;
    type: "folder" | "report" | "asset";
  }[];
  refetch: () => void;
  onClose: () => void;
  itemLocation: string;
  type: "report" | "asset";
  clearSelectedItems: () => void;
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
