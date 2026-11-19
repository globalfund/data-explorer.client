import { InfoPanelType } from "app/components/chart-block/components/button-toolbar/data";

export interface OpexPageChartBlockData {
  data: any;
  id: string;
  text: string;
  title: string;
  empty?: boolean;
  views?: string[];
  subtitle: string;
  loading?: boolean;
  exportName: string;
  viewSelected?: string;
  infoType: InfoPanelType;
  children?: React.ReactNode;
  onViewChange?: (view: string) => void;
}
