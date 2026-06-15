import type { Meta, StoryObj } from "@storybook/react";

import { HomeBlock1 } from "app/pages/home/blocks/block-1";

const meta: Meta<typeof HomeBlock1> = {
  title: "Pages/Home/Blocks/Block1",
  component: HomeBlock1,
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
