import { RBReportItemTypes } from "app/state/api/action-reducers/report-builder/sync";

export interface AllAssetsViewProps {
  selectedView: "cards" | "list";
  assets: {
    isLoading: boolean;
    data: {
      id: string;
      name: string;
      public?: boolean;
      shared?: boolean;
      isFolder?: boolean;
      description: string;
      createdDate: string;
      updatedDate: string;
      assetCount?: number;
      folderCount?: number;
      type?: RBReportItemTypes;
    }[];
  };
  refetch: () => void;
  detailsSidePanelOpen: boolean;
  handleFolderOpen: (id: string) => void;
  onDeleteAsset: (id: string, name: string) => void;
  onDeleteFolder: (id: string, name: string) => void;
  onMoveItemToFolder: (
    id: string,
    name: string,
    type: "asset" | "folder",
  ) => void;
  onDetailsClick: (details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    type: "report" | "asset" | "folder";
    content?: {
      assetCount: number;
      reportCount: number;
      folderCount: number;
    };
  }) => void;
}
