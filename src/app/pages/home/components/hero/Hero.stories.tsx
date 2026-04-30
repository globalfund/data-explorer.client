import type { Meta, StoryObj } from "@storybook/react";

import { HomeHero } from "app/pages/home/components/hero";

const meta = {
  title: "Pages/Home/Components/Hero",
  component: HomeHero,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof HomeHero>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const HomeHeroStory: StoryType = {};
