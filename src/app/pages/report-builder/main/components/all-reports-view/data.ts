export interface AllReportsViewProps {
  refetch: () => void;
  selectedView: "cards" | "list";
  handleFolderOpen: (id: string) => void;
  onDeleteReport: (id: string, name: string) => void;
  onDeleteFolder: (id: string, name: string) => void;
  onMoveItemToFolder: (
    id: string,
    name: string,
    type: "report" | "folder",
  ) => void;
  onDetailsClick: (details: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string;
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
}

export interface ReportCardProps {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  imageVersion: number;
  selectedItemForRenaming: string | null;
  setSelectedItemForRenaming: (id: string | null) => void;
  handleRenameEnter: (id: string, type: "report" | "folder") => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemClick: (id: string, type: "report" | "folder") => () => void;
  handleEditClick: (id: string) => () => void;
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
  handleRenameEnter: (id: string, type: "report" | "folder") => void;
  handleItemMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleItemClick: (id: string, type: "report" | "folder") => () => void;
}
