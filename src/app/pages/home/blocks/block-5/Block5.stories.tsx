import type { Meta, StoryObj } from "@storybook/react";

import { HomeBlock5 } from "app/pages/home/blocks/block-5";

const meta: Meta<typeof HomeBlock5> = {
  title: "Pages/Home/Blocks/Block5",
  component: HomeBlock5,
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
