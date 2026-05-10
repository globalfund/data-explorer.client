export interface ReportBuilderNewFolderModalProps {
  open: boolean;
  nameValue: string;
  reload: () => void;
  onClose: () => void;
  setNameValue: (value: string) => void;
}
