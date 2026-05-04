import type { Meta, StoryObj } from "@storybook/react";

import { Footer } from "app/components/footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof Footer>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
