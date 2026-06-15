import type { Meta, StoryObj } from "@storybook/react";

import { ExpandableHorizontalBar } from "app/components/charts/expandable-horizontal-bar";
import { STORY_DATA_VARIANT_1 } from "app/components/charts/expandable-horizontal-bar/data";

const meta = {
  title: "Components/Charts/Expandable Horizontal Bar chart",
  component: ExpandableHorizontalBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof ExpandableHorizontalBar>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const BarChartVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
    yAxisLabel: "Donor Types & Donors",
    xAxisLabel: "Amount",
    valueLabels: {
      value: "Pledge",
      value1: "Contribution",
    },
  },
};
