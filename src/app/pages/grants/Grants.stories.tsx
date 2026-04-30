import type { Meta, StoryObj } from "@storybook/react";

import { Grants } from "app/pages/grants";

const meta = {
  title: "Pages/Grants",
  component: Grants,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof Grants>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
