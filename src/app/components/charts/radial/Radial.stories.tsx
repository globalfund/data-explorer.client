import type { Meta, StoryObj } from "@storybook/react";

import { RadialChart } from "app/components/charts/radial";
import {
  STORY_DATA_VARIANT_1,
  STORY_DATA_VARIANT_2,
  STORY_DATA_VARIANT_3,
  STORY_DATA_VARIANT_4,
  STORY_DATA_VARIANT_5,
} from "app/components/charts/radial/data";

const meta = {
  title: "Components/Charts/Radial chart",
  component: RadialChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof RadialChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const RadialChartVariant1: StoryType = {
  args: {
    tooltipLabel: "Amount",
    data: STORY_DATA_VARIANT_1,
    itemLabelFormatterType: "name-percent",
  },
};

export const RadialChartVariant2: StoryType = {
  args: {
    tooltipLabel: "Amount",
    data: STORY_DATA_VARIANT_2,
    itemLabelFormatterType: "name",
  },
};

export const RadialChartVariant3: StoryType = {
  args: {
    tooltipLabel: "Amount",
    data: STORY_DATA_VARIANT_3,
    itemLabelFormatterType: "name",
  },
};

export const RadialChartVariant4: StoryType = {
  args: {
    tooltipLabel: "Amount",
    data: STORY_DATA_VARIANT_4,
    itemLabelFormatterType: "name-value-percent",
  },
};

export const RadialChartVariant5: StoryType = {
  args: {
    tooltipLabel: "Amount",
    data: STORY_DATA_VARIANT_5,
    itemLabelFormatterType: "name",
  },
};
