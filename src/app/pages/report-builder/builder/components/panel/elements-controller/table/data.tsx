import DataIcon from "app/assets/vectors/RBDatabase2.svg?react";
import PaintBucketIcon from "app/assets/vectors/Paint_Bucket.svg?react";
import LayoutTemplateIcon from "app/assets/vectors/Layout_Template.svg?react";

export const tabList = [
  {
    value: "mapping",
    icon: <DataIcon />,
    ariaLabel: "Data",
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
];
