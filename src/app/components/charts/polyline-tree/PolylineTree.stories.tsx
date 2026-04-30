import type { Meta, StoryObj } from "@storybook/react";

import { PolylineTree } from "app/components/charts/polyline-tree";
import { STORY_DATA_VARIANT_1 } from "app/components/charts/polyline-tree/data";

const meta = {
  title: "Components/Charts/PolylineTree",
  component: PolylineTree,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof PolylineTree>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const PolylineTreeVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
  },
};
