import type { Meta, StoryObj } from "@storybook/react";

import { SankeyChart } from "app/components/charts/sankey";
import { STORY_DATA_VARIANT_1 } from "app/components/charts/sankey/data";

const meta = {
  title: "Components/Charts/Sankey chart",
  component: SankeyChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof SankeyChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const SankeyChartVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
  },
};
