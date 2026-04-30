import type { Meta, StoryObj } from "@storybook/react";

import { ResourceMobilization } from "app/pages/location/views/resource-mobilization";

const meta = {
  title: "Pages/Location/Views/Resource Mobilization",
  component: ResourceMobilization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof ResourceMobilization>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
