import type { Meta, StoryObj } from "@storybook/react";

import { GrantImplementation } from "app/pages/grant/views/grant-implementation";

const meta = {
  title: "Pages/Grant/Views/Financial Insights",
  component: GrantImplementation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof GrantImplementation>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
