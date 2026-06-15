import type { Meta, StoryObj } from "@storybook/react";

import { HomeBlock4 } from "app/pages/home/blocks/block-4";

const meta: Meta<typeof HomeBlock4> = {
  title: "Pages/Home/Blocks/Block4",
  component: HomeBlock4,
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
