import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { DetailPageTabs } from "app/components/detail-page-tabs";
import {
  getGrantTabs,
  getLocationTabs,
  DetailPageTabsProps,
  GRANT_DROPDOWN_ITEMS,
} from "app/components/detail-page-tabs/data";

const Wrapper: React.FC<DetailPageTabsProps> = (props: DetailPageTabsProps) => {
  const [dropdownSelected, setDropdownSelected] = React.useState(
    props.dropdown?.dropdownItems[0].value,
  );

  const handleSelectionChange = (value: string) => {
    setDropdownSelected(value);
  };

  return (
    <DetailPageTabs
      baseRoute={props.baseRoute}
      activeTab={props.activeTab}
      tabs={props.tabs}
      dropdown={
        props.dropdown
          ? {
              dropdownSelected: dropdownSelected ?? "",
              dropdownItems: GRANT_DROPDOWN_ITEMS,
              handleDropdownChange: handleSelectionChange,
            }
          : undefined
      }
    />
  );
};

const meta = {
  title: "Components/Detail page tabs",
  component: Wrapper,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof Wrapper>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Grant: StoryType = {
  args: {
    tabs: getGrantTabs({}),
    baseRoute: "/grant",
    dropdown: {
      dropdownSelected: GRANT_DROPDOWN_ITEMS[0].value,
      dropdownItems: GRANT_DROPDOWN_ITEMS,
      handleDropdownChange: (value: string) => console.log(value),
    },
  },
};

export const Location: StoryType = {
  args: {
    tabs: getLocationTabs({}),
    baseRoute: "/location",
  },
};
