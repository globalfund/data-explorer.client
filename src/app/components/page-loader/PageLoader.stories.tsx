import type { Meta, StoryObj } from "@storybook/react";

import { PageLoader } from "app/components/page-loader";

const meta = {
  title: "Components/Page loader",
  component: PageLoader,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof PageLoader>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
