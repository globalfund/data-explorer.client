import { RBItemTypes } from "app/pages/report-builder/data";
import { RBReportItemTypes } from "app/state/api/action-reducers/report-builder/sync";

export interface AllReportsViewProps {
  refetch: () => void;
  detailsSidePanelOpen: boolean;
  selectedView: "cards" | "list";
  handleFolderOpen: (id: string) => void;
  onDeleteReport: (id: string, name: string) => void;
  onDeleteFolder: (id: string, name: string) => void;
  onMoveItemToFolder: (id: string, name: string, type: RBItemTypes) => void;
  onDetailsClick: (details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    type: RBItemTypes;
    content?: {
      assetCount: number;
      reportCount: number;
      folderCount: number;
    };
  }) => void;
  reports: {
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
      reportCount?: number;
      folderCount?: number;
    }[];
  };
  checkedItems: { id: string; type: RBItemTypes }[];
  setCheckedItems: React.Dispatch<
    React.SetStateAction<{ id: string; type: RBItemTypes }[]>
  >;
}

export interface ReportCardProps {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  imageVersion: number;
  selectedItemForRenaming: string | null;
  handleEditClick: (id: string) => () => void;
  setSelectedItemForRenaming: (id: string | null) => void;
  handleRenameEnter: (id: string, type: "report" | "folder") => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemClick: (id: string, type: "report" | "folder") => () => void;
}

export interface FolderCardProps {
  id: string;
  name: string;
  assetCount: number;
  reportCount: number;
  folderCount: number;
  createdDate: string;
  updatedDate: string;
  selectedItemForRenaming: string | null;
  setSelectedItemForRenaming: (id: string | null) => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleRenameEnter: (id: string, type: RBItemTypes) => void;
  handleItemClick: (id: string, type: RBItemTypes) => () => void;
}

export interface AssetCardProps {
  id: string;
  name: string;
  createdDate: string;
  updatedDate: string;
  type?: RBReportItemTypes;
  imageVersion: number;
  selectedItemForRenaming: string | null;
  setSelectedItemForRenaming: (id: string | null) => void;
  handleRenameEnter: (id: string, type: "asset" | "folder") => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemClick: (id: string, type: "asset" | "folder") => () => void;
  handleUseAsset: (id: string) => void;
}

export const getFolderContentText = (folder: {
  assetCount: number;
  reportCount: number;
  folderCount: number;
}) => {
  const { assetCount, reportCount, folderCount } = folder;
  if (assetCount === 0 && reportCount === 0 && folderCount === 0) {
    return "Empty Folder";
  }
  if (assetCount > 0 && reportCount === 0 && folderCount === 0) {
    return `${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
  }
  if (assetCount > 0 && reportCount > 0 && folderCount === 0) {
    return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
  }
  if (assetCount > 0 && reportCount === 0 && folderCount > 0) {
    return `${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} and ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} inside`;
  }
  if (assetCount === 0 && reportCount > 0 && folderCount === 0) {
    return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} inside`;
  }
  if (assetCount === 0 && reportCount > 0 && folderCount > 0) {
    return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"} and ${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} inside`;
  }
  return `${reportCount} ${reportCount === 1 ? "Report" : "Reports"}, ${assetCount} ${assetCount === 1 ? "Asset" : "Assets"} and ${folderCount} ${folderCount === 1 ? "Folder" : "Folders"} inside`;
};
