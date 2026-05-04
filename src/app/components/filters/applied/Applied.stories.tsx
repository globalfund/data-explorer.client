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
  args: {},
};
