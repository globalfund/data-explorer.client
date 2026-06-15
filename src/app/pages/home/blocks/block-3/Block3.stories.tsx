import type { Meta, StoryObj } from "@storybook/react";

import { HomeBlock3 } from "app/pages/home/blocks/block-3";

const meta: Meta<typeof HomeBlock3> = {
  title: "Pages/Home/Blocks/Block3",
  component: HomeBlock3,
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
