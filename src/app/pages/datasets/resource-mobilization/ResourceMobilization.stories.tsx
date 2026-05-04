import type { Meta, StoryObj } from "@storybook/react";

import { ResourceMobilizationPage } from "app/pages/datasets/resource-mobilization";

const meta = {
  title: "Pages/Datasets/ResourceMobilization",
  component: ResourceMobilizationPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof ResourceMobilizationPage>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
