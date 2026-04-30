import type { Meta, StoryObj } from "@storybook/react";

import { LocationOverview } from "app/pages/location/views/overview";

const meta = {
  title: "Pages/Location/Views/Overview",
  component: LocationOverview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof LocationOverview>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
