export interface ReportBuilderDeleteAssetModalProps {
  open: boolean;
  assetId: string;
  assetName: string;
  onClose: () => void;
  refetch: () => void;
}
