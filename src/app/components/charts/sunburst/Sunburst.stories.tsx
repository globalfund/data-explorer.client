import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SunburstChart } from "app/components/charts/sunburst";
import {
  STORY_DATA_VARIANT_1,
  SunburstDataItem,
  SunburstProps,
} from "app/components/charts/sunburst/data";

const Wrapper = (props: SunburstProps) => {
  const [selectedItem, setSelectedItem] = React.useState<{
    dataIndex: number;
    item: SunburstDataItem;
  } | null>(null);

  return (
    <SunburstChart
      {...props}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    />
  );
};

const meta = {
  title: "Components/Charts/Sunburst chart",
  component: Wrapper,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof SunburstChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const SunburstChartVariant1: StoryType = {
  args: {
    tooltipLabel: "Pledge",
    data: STORY_DATA_VARIANT_1,
    centerLabel: "Total Pledge",
    selectedItem: null,
    setSelectedItem: () => {},
  },
};

export const SunburstChartVariant2: StoryType = {
  args: {
    tooltipLabel: "Allocation",
    data: STORY_DATA_VARIANT_1,
    centerLabel: "Total Allocation",
    selectedItem: null,
    setSelectedItem: () => {},
  },
};
