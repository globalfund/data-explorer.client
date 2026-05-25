export interface ReportBuilderDeleteReportModalProps {
  open: boolean;
  reportId: string;
  reportName: string;
  onClose: () => void;
  refetch: () => void;
}
