import type { Meta, StoryObj } from "@storybook/react";

import { ChartBlockCycles } from "app/components/chart-block/components/cycles";

const meta = {
  title: "Components/ChartBlock/Cycles",
  component: ChartBlockCycles,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {
    showCycleAll: { control: "boolean" },
  },
} as Meta<typeof ChartBlockCycles>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    cycles: [
      { name: "2020", value: "2020" },
      { name: "2021", value: "2021" },
      { name: "2022", value: "2022" },
    ],
    selectedCycles: [{ name: "2021", value: "2021" }],
    showCycleAll: true,
    handleCycleChange: () => {},
  },
};
