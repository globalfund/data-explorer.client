import type { Meta, StoryObj } from "@storybook/react";

import { NoMobile } from "app/components/no-mobile";

const meta: Meta<typeof NoMobile> = {
  title: "Components/NoMobile",
  component: NoMobile,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
