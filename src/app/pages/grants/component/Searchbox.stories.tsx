import type { Meta, StoryObj } from "@storybook/react";

import Searchbox from "app/pages/grants/component/Searchbox";

const meta = {
  title: "Pages/Grants/Searchbox",
  component: Searchbox,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof Searchbox>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    search: "",
    searchInputRef: null,
    handleSearch: () => {},
    handleSearchIconClick: () => () => {},
  },
};
