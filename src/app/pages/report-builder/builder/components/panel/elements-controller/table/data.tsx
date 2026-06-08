import DataIcon from "app/assets/vectors/RBDatabase2.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";

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
];
