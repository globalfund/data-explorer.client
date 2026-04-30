import type { Meta, StoryObj } from "@storybook/react";

import { Home } from "app/pages/home";

const meta = {
  title: "Pages/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Home>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
