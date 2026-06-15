import type { Meta, StoryObj } from "@storybook/react";

import { ChangelogPage } from "app/pages/changelog";

const meta: Meta<typeof ChangelogPage> = {
  title: "Pages/Changelog",
  component: ChangelogPage,
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
