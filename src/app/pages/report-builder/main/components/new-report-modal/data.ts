export interface ReportBuilderNewReportModalProps {
  open: boolean;
  nameValue: string;
  onClose: () => void;
  descriptionValue: string;
  setNameValue: (value: string) => void;
  setDescriptionValue: (value: string) => void;
}
