import type { Meta, StoryObj } from "@storybook/react";

import { HomeBlock2 } from "app/pages/home/blocks/block-2";

const meta: Meta<typeof HomeBlock2> = {
  title: "Pages/Home/Blocks/Block2",
  component: HomeBlock2,
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
