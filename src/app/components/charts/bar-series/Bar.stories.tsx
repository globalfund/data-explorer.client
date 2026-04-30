import type { Meta, StoryObj } from "@storybook/react";

import { BarSeriesChart } from "app/components/charts/bar-series";
import {
  KEYS,
  STORY_DATA_VARIANT_1,
} from "app/components/charts/bar-series/data";

const meta = {
  title: "Components/Charts/Bar series chart",
  component: BarSeriesChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof BarSeriesChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const BarSeriesChartVariant1: StoryType = {
  args: {
    keys: KEYS,
    data: STORY_DATA_VARIANT_1,
  },
};
