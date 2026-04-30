import type { Meta, StoryObj } from "@storybook/react";

import { Geography } from "app/pages/geography";

const meta = {
  title: "Pages/Geography List",
  component: Geography,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Geography>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
