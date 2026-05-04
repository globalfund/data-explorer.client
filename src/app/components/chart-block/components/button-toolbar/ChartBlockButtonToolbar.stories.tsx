import type { Meta, StoryObj } from "@storybook/react";

import { ChartBlockButtonToolbar } from "app/components/chart-block/components/button-toolbar";

const meta = {
  title: "Components/ChartBlock/ButtonToolbar",
  component: ChartBlockButtonToolbar,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {
    infoType: { control: "text" },
  },
} as Meta<typeof ChartBlockButtonToolbar>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    infoType: "global",
  },
};
