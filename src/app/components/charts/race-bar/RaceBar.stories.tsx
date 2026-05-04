import type { Meta, StoryObj } from "@storybook/react";

import { RaceBarChart } from "app/components/charts/race-bar";
import { STORY_DATA_VARIANT_1 } from "app/components/charts/race-bar/data";

const meta = {
  title: "Components/Charts/Race bar chart",
  component: RaceBarChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof RaceBarChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const RaceBarChartVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
  },
};
