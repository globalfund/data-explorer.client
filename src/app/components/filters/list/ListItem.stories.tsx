import type { Meta, StoryObj } from "@storybook/react";

import { FilterListItemContent } from "app/components/filters/list/listitem";

const meta: Meta<typeof FilterListItemContent> = {
  title: "Components/Filters/List/ListItem",
  component: FilterListItemContent,
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
