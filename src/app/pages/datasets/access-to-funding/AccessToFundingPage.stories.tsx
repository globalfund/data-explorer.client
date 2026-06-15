import type { Meta, StoryObj } from "@storybook/react";

import { AccessToFundingPage } from "app/pages/datasets/access-to-funding";

const meta: Meta<typeof AccessToFundingPage> = {
  title: "Pages/Datasets/AccessToFunding",
  component: AccessToFundingPage,
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
