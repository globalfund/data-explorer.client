import {
  DocumentsIcon,
  DonorsIcon,
  GrantsIcon,
  LocationsIcon,
  PartnersIcon,
  ResultsIcon,
} from "app/components/search/icons";

export interface SearchProps {
  hocClose?: () => void;
  withCatMenu?: boolean;
  forceCategory?: string;
  handleSearch?: (value: string) => void;
}

export const getCategoryIcon = (label: string): JSX.Element | undefined => {
  switch (label) {
    case "Locations":
      return <LocationsIcon />;
    case "Grants":
      return <GrantsIcon />;
    case "Partners":
      return <PartnersIcon />;
    case "Donors":
      return <DonorsIcon />;
    case "Results":
      return <ResultsIcon />;
    case "Documents":
      return <DocumentsIcon />;
    default:
      return undefined;
  }
};
