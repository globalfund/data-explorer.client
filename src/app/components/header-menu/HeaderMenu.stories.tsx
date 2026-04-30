import type { Meta, StoryObj } from "@storybook/react";

import { HeaderMenu } from "app/components/header-menu";

const meta = {
  title: "Components/HeaderMenu",
  component: HeaderMenu,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof HeaderMenu>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    mobileMenuOpen: false,
    setMobileMenuOpen: () => {},
  },
};
