import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { DatasetPage } from "app/pages/datasets/common/page";

const meta = {
  title: "Pages/Datasets/Common/Page",
  component: DatasetPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DatasetPage>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    title: "Resource Mobilization",
    filterGroups: [],
    appliedFilters: [],
    handleResetFilters: () => {},
    handleApplyFilters: () => {},
    handleCancelFilters: () => {},

    children: <div>Content</div>,
    subtitle:
      "Government, private sector, non-government and other donor pledges and contributions.",
  },
};
