import type { Meta, StoryObj } from "@storybook/react";

import { DonutChart } from "app/components/charts/donut";

const meta = {
  title: "Components/Charts/Donut",
  component: DonutChart,
  parameters: {
    layout: "centered",
  },
  tags: [],
  argTypes: {
    value: { control: "number" },
    valueColor: { control: "color" },
    label: { control: "text" },
  },
} as Meta<typeof DonutChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    value: 75.5,
    valueColor: "#013E77",
    label: "Complete",
  },
};

export const Half: StoryType = {
  args: {
    value: 50,
    valueColor: "#FFA500",
    label: "Half",
  },
};

export const Full: StoryType = {
  args: {
    value: 100,
    valueColor: "#00FF00",
    label: "Full",
  },
};
