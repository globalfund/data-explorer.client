import type { Meta, StoryObj } from "@storybook/react";

import { AnnualResultsPage } from "app/pages/datasets/annual-results";

const meta: Meta<typeof AnnualResultsPage> = {
  title: "Pages/Datasets/AnnualResults",
  component: AnnualResultsPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
