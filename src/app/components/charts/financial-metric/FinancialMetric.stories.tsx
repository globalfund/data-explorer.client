import type { Meta, StoryObj } from "@storybook/react";

import { FinancialMetric } from "app/components/charts/financial-metric";

const meta = {
  title: "Components/Charts/FinancialMetric",
  component: FinancialMetric,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof FinancialMetric>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    title: "Financial Overview",
    legends: [
      { name: "Allocated", color: "#013E77" },
      { name: "Spent", color: "#FFA500" },
    ],
    donutChart: {
      id: "donut-1",
      value: 65.5,
      valueColor: "#013E77",
      label: "Complete",
    },
    items: [
      {
        name: "Category A",
        value: 80,
        color: "#013E77",
        level: 0,
        items: [
          {
            name: "Subcategory A1",
            value: 90,
            color: "#015C9F",
            level: 1,
            items: [],
          },
          {
            name: "Subcategory A2",
            value: 70,
            color: "#015C9F",
            level: 1,
            items: [],
          },
        ],
      },
      {
        name: "Category B",
        value: 50,
        color: "#FFA500",
        level: 0,
        items: [],
      },
    ],
  },
};
