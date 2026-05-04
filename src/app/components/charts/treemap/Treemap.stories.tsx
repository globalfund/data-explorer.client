import type { Meta, StoryObj } from "@storybook/react";

import { Treemap } from "app/components/charts/treemap";
import {
  STORY_DATA_VARIANT_1,
  STORY_DATA_VARIANT_2,
} from "app/components/charts/treemap/data";

const meta = {
  title: "Components/Charts/Treemap",
  component: Treemap,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof Treemap>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const TreemapVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
  },
};

export const TreemapVariant2: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_2,
  },
};
