import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import { Page } from "app/components/page";

const meta: Meta<typeof Page> = {
  title: "Components/Page",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  render: (args) => (
    <MemoryRouter>
      <Page {...args} />
    </MemoryRouter>
  ),
  args: {},
};
