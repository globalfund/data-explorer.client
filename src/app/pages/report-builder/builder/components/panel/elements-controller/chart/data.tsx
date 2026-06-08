import DatabaseIcon from "app/assets/vectors/RBDatabase.svg?react";
import ChartIconLarge from "app/assets/vectors/RBChartLarge.svg?react";
import FilterIcon from "app/assets/vectors/FunnelPlus.svg?react";
import DataIcon from "app/assets/vectors/RBDatabase2.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";
import { MoreVert } from "@mui/icons-material";

export interface ChartInfoItem {
  buttonLabel: string;
  helperText: string;
  icon: React.ReactNode;
  type: "dataset" | "chartType";
  selectedItem: string;
}
export const chartInfo: ChartInfoItem[] = [
  {
    buttonLabel: "Select Dataset",
    helperText: "Select a dataset to get started",
    icon: <DatabaseIcon />,
    type: "dataset",
    selectedItem: "",
  },
  {
    buttonLabel: "Select Chart Type",
    helperText: "Select a chart to map data",
    icon: <ChartIconLarge />,
    type: "chartType",
    selectedItem: "",
  },
];

export const tabList = [
  {
    value: "mapping",
    icon: <DataIcon />,
    ariaLabel: "Data",
  },
  {
    value: "filter",
    icon: <FilterIcon />,
    ariaLabel: "Filter",
  },
  {
    value: "layout",
    icon: <LayoutTemplateIcon />,
    ariaLabel: "Layout",
  },
  {
    value: "style",
    icon: <PaintBucketIcon />,
    ariaLabel: "Style",
  },
  {
    value: "advanced",
    icon: <MoreVert htmlColor="#70777E" fontSize="small" />,
    ariaLabel: "Advanced",
  },
];
