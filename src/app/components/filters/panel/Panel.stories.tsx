import type { Meta, StoryObj } from "@storybook/react";

import { FilterPanel } from "app/components/filters/panel";

const meta: Meta<typeof FilterPanel> = {
  title: "Components/Filters/Panel",
  component: FilterPanel,
  parameters: {
    layout: "padded",
  },
  tags: [],
  argTypes: {},
};

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  args: {
    appliedFilters: ["filter1", "filter2"],
    appliedFilterBgColors: {
      normal: "#e0e0e0",
      hover: "#c0c0c0",
    },
    onClose: () => alert("Close panel"),
    handleResetFilters: () => alert("Reset filters"),
    filterGroups: [
      {
        id: "group1",
        name: "Group 1",
        options: [
          { value: "filter1", name: "Filter 1" },
          { value: "filter2", name: "Filter 2" },
          { value: "filter3", name: "Filter 3" },
        ],
      },
      {
        id: "group2",
        name: "Group 2",
        options: [
          { value: "filter4", name: "Filter 4" },
          { value: "filter5", name: "Filter 5" },
        ],
      },
    ],
    setPage: (value) => alert(`Set page to ${value}`),
    page: 1,
    search: "",
    setPageSearchValue: (value) => alert(`Set search value to ${value}`),
    handleCancelFilters: () => alert("Cancel filters"),
    handleApplyFilters: () => alert("Apply filters"),
  },
};
