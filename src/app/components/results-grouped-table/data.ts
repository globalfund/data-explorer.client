export interface GroupedByComponentTableProps {
  data: {
    name: string;
    indicators: {
      name: string;
      value: number;
      numOfCountries: number;
    }[];
    numOfCountries: number;
  }[];
  expanded: string[];
  setExpanded: React.Dispatch<React.SetStateAction<string[]>>;
  yearSelected: string | null;
}

export interface ToolbarComponentProps {
  label: string;
  searchValue: string;
  buttonLabel: string;
  onExpandAll: () => void;
  setSearchValue: (value: string) => void;
}
