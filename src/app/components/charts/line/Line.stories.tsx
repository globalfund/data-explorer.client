import type { Meta, StoryObj } from "@storybook/react";

import { LineChart } from "app/components/charts/line";
import { STORY_DATA_VARIANT_1 } from "app/components/charts/line/data";

const meta = {
  title: "Components/Charts/Line chart",
  component: LineChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof LineChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const LineChartVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
    xAxisKeys: [
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
    ],
  },
};
