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
    helperText: "Dataset not selected*",
    icon: <DatabaseIcon />,
    type: "dataset",
    selectedItem: "",
  },
  {
    buttonLabel: "Select Chart Type",
    helperText: "Chart type not selected*",
    icon: <ChartIconLarge />,
    type: "chartType",
    selectedItem: "",
  },
];

export const tabList = [
  {
    value: "mapping",
    icon: <DataIcon />,
    sx: {
      borderBottom: "2px solid #98A1AA",
      width: "59.2px",
      svg: {
        path: {
          stroke: "#70777E",
        },
      },
    },
    ariaLabel: "Data",
  },
  {
    value: "filter",
    icon: <FilterIcon />,
    sx: {
      borderBottom: "2px solid #98A1AA",
      width: "59.2px",
      svg: {
        path: {
          stroke: "#70777E",
        },
      },
    },
    ariaLabel: "Filter",
  },
  {
    value: "layout",
    icon: <LayoutTemplateIcon />,
    sx: {
      borderBottom: "2px solid #98A1AA",
      width: "59.2px",
      svg: {
        path: {
          stroke: "#70777E",
        },
      },
    },
    ariaLabel: "Layout",
  },
  {
    value: "style",
    icon: <PaintBucketIcon />,
    sx: {
      borderBottom: "2px solid #98A1AA",
      width: "59.2px",
      svg: {
        path: {
          stroke: "#70777E",
        },
      },
    },
    ariaLabel: "Style",
  },
  {
    value: "advanced",
    icon: <MoreVert htmlColor="#70777E" fontSize="small" />,
    sx: {
      borderBottom: "2px solid #98A1AA",
      width: "59.2px",
      svg: {
        path: {
          stroke: "#70777E",
        },
      },
    },
    ariaLabel: "Advanced",
  },
];
