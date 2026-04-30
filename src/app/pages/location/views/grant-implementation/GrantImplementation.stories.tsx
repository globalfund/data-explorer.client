import type { Meta, StoryObj } from "@storybook/react";

import { GrantImplementation } from "app/pages/location/views/grant-implementation";

const meta = {
  title: "Pages/Location/Views/Financial Insights",
  component: GrantImplementation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof GrantImplementation>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    page: 1,
    setPage: () => {},
  },
};
