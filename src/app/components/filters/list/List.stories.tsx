import type { Meta, StoryObj } from "@storybook/react";

import { FilterList } from "app/components/filters/list";

const meta: Meta<typeof FilterList> = {
  title: "Components/Filters/List",
  component: FilterList,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {},
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
