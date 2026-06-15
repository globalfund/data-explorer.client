import type { Meta, StoryObj } from "@storybook/react";

import { FilterPanel } from "app/components/filters/panel";

const meta: Meta<typeof FilterPanel> = {
  title: "Components/Filters/Panel",
  component: FilterPanel,
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
