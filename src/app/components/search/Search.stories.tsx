import type { Meta, StoryObj } from "@storybook/react";

import { Search } from "app/components/search";

const meta = {
  title: "Components/Search",
  component: Search,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Search>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
