export interface ReportBuilderNewFolderModalProps {
  open: boolean;
  nameValue: string;
  reload: () => void;
  onClose: () => void;
  currentFolderId?: string;
  type: "report" | "asset";
  refetchFolders: () => void;
  setNameValue: (value: string) => void;
}
