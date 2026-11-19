import { InfoPanelType } from "app/components/chart-block/components/button-toolbar/data";

export interface ChartBlockProps {
  data: any;
  id: string;
  title: string;
  text?: string;
  empty?: boolean;
  subtitle: string;
  loading?: boolean;
  exportName: string;
  latestUpdate?: string;
  noSplitText?: boolean;
  dropdownWidth?: number;
  showCycleAll?: boolean;
  infoType: InfoPanelType;
  children: React.ReactNode;
  noBottomToolbar?: boolean;
  dropdownSelected?: string;
  unitButtons?: React.ReactNode;
  extraDropdown?: React.ReactElement;
  handleDropdownChange?: (value: string) => void;
  selectedCycles?: { name: string; value: string }[];
  dropdownItems?: { value: string; label: string }[];
  cycles?: { name: string; value: string; disabled?: boolean }[];
  handleCycleChange?: (cycle: { name: string; value: string }) => void;
}
