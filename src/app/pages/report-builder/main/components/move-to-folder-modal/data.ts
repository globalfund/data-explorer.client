import { RBFolderModelResponse } from "app/state/api/action-reducers/report-builder/sync";

export interface ReportBuilderMoveToFolderModalProps {
  open: boolean;
  onClose: () => void;
  folderStructure: RBFolderModelResponse[];
}
