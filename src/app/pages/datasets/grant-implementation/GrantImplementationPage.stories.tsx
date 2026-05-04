import type { Meta, StoryObj } from "@storybook/react";

import { GrantImplementationPage } from "app/pages/datasets/grant-implementation";

const meta: Meta<typeof GrantImplementationPage> = {
  title: "Pages/Datasets/GrantImplementation",
  component: GrantImplementationPage,
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
