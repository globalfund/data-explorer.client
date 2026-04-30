import type { Meta, StoryObj } from "@storybook/react";

import { stats } from "app/pages/home/components/results-stats/data";
import { HomeResultsStats } from "app/pages/home/components/results-stats";

const meta = {
  title: "Pages/Home/Components/Results stats",
  component: HomeResultsStats,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof HomeResultsStats>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const HomeResultsStatsStory: StoryType = {
  args: {
    stats,
  },
};
