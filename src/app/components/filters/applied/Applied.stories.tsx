import type { Meta, StoryObj } from "@storybook/react";

import { FiltersApplied } from "app/components/filters/applied";

const meta: Meta<typeof FiltersApplied> = {
  title: "Components/Filters/Applied",
  component: FiltersApplied,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {},
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    items: [],
    filterGroups: [],
    appliedFilterBgColors: {
      normal: "#F5F6F7",
      hover: "#373D43",
    },
  },
};
