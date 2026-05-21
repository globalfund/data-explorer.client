export interface ReportBuilderDeleteFolderModalProps {
  open: boolean;
  folderId: string;
  folderName: string;
  onClose: () => void;
  refetch: () => void;
}
