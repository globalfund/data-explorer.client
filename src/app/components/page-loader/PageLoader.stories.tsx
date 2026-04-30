import type { Meta, StoryObj } from "@storybook/react";

import { PageLoader } from "app/components/page-loader";

const meta = {
  title: "Components/Page loader",
  component: PageLoader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof PageLoader>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
