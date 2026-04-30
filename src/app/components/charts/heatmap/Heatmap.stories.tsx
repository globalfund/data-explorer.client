import type { Meta, StoryObj } from "@storybook/react";

import { Heatmap } from "app/components/charts/heatmap";
import {
  getEligibilityColor,
  getPercentageColor,
  STORY_DATA_VARIANT_1,
  STORY_DATA_VARIANT_2,
} from "app/components/charts/heatmap/data";

const meta = {
  title: "Components/Charts/Heatmap",
  component: Heatmap,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Heatmap>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const HeatmapVariant1: StoryType = {
  args: {
    rowCategory: "component",
    columnCategory: "cycle",
    valueType: "amount",
    hoveredLegend: null,
    data: STORY_DATA_VARIANT_1,
    getItemColor: getPercentageColor,
    contentProp: "value",
  },
};

export const HeatmapVariant2: StoryType = {
  args: {
    rowCategory: "component",
    columnCategory: "year",
    valueType: "amount",
    hoveredLegend: null,
    data: STORY_DATA_VARIANT_2,
    getItemColor: getEligibilityColor,
    contentProp: "diseaseBurden",
    itemWidth: 42,
  },
};
