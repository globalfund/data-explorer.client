import type { Meta, StoryObj } from "@storybook/react";

import { GlossaryPage } from "app/pages/glossary";

const meta = {
  title: "Pages/Glossary",
  component: GlossaryPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof GlossaryPage>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {},
};
