import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Dropdown } from "app/components/dropdown";

const items = [
  { label: "Investment Landscape", value: "Investment Landscape" },
  { label: "Modules & Interventions", value: "Modules & Interventions" },
];

const Wrapper: React.FC = () => {
  const [dropdownSelected, setDropdownSelected] = React.useState(
    items[0].value,
  );

  const handleSelectionChange = (value: string) => {
    setDropdownSelected(value);
  };

  return (
    <Dropdown
      dropdownItems={items}
      dropdownSelected={dropdownSelected}
      handleDropdownChange={handleSelectionChange}
    />
  );
};

const meta = {
  title: "Components/Dropdown",
  component: Wrapper,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof Dropdown>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
