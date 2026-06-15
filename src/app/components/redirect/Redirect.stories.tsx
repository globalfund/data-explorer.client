import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import { Redirect } from "app/components/redirect";

const meta: Meta<typeof Redirect> = {
  title: "Components/Redirect",
  component: Redirect,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {
    to: { control: "text" },
  },
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  render: (args) => (
    <MemoryRouter>
      <Redirect {...args} />
    </MemoryRouter>
  ),
  args: {
    to: "/home",
  },
};
