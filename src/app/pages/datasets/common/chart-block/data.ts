import { FilterGroupModel } from "app/components/filters/list/data";
import { AppliedFiltersModel } from "app/state/api/action-reducers/sync/filters";
import { InfoPanelType } from "app/components/chart-block/components/button-toolbar/data";

export interface DatasetChartBlockProps {
  data: any;
  id: string;
  title: string;
  empty?: boolean;
  subtitle: string;
  loading?: boolean;
  exportName: string;
  latestUpdate?: string;
  infoType: InfoPanelType;
  appliedFilters: string[];
  children: React.ReactNode;
  dropdownSelected?: string;
  disableCollapse?: boolean;
  unitButtons?: React.ReactNode;
  handleResetFilters: () => void;
  filterGroups: FilterGroupModel[];
  extraDropdown?: React.ReactElement;
  tempAppliedFiltersData?: AppliedFiltersModel;
  handleDropdownChange?: (value: string) => void;
  handleCancelFilters: () => void;
  handleApplyFilters: () => void;
  removeFilter: (value: string, types: string[]) => void;
  toggleFilter: (checked: boolean, value: string, type: string) => void;
  titleVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
  dropdownItems: { value: string; label: string; icon?: React.ReactElement }[];
  subtitleVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
}
