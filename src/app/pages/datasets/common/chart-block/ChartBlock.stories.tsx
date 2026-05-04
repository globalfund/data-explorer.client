import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { BarChart } from "app/components/charts/bar";
import { STORY_DATA_VARIANT_2 } from "app/components/charts/bar/data";
import { DatasetChartBlock } from "app/pages/datasets/common/chart-block";
import { defaultAppliedFilters } from "app/state/api/action-reducers/sync/filters";

const items = [
  { label: "Bar Chart", value: "Bar Chart" },
  { label: "Table View", value: "Table View" },
];

const Wrapper: React.FC = () => {
  const [dropdownSelected, setDropdownSelected] = React.useState(
    items[0].value,
  );

  const handleSelectionChange = (value: string) => {
    setDropdownSelected(value);
  };

  return (
    <DatasetChartBlock
      id="chart-block"
      title="$84 Billion"
      subtitle="Funds raised to date"
      dropdownItems={items}
      dropdownSelected={dropdownSelected}
      exportName="pledges-and-contributions"
      handleDropdownChange={handleSelectionChange}
      filterGroups={[]}
      toggleFilter={() => {}}
      removeFilter={() => {}}
      handleResetFilters={() => {}}
      handleApplyFilters={() => {}}
      handleCancelFilters={() => {}}
      appliedFilters={[]}
      tempAppliedFiltersData={defaultAppliedFilters}
      data={STORY_DATA_VARIANT_2}
      infoType="global"
    >
      <BarChart
        data={STORY_DATA_VARIANT_2}
        valueLabels={{
          value: "Pledge",
          value1: "Contribution",
        }}
      />
    </DatasetChartBlock>
  );
};

const meta = {
  title: "Pages/Datasets/Common/Chart block",
  component: Wrapper,
  parameters: {
    layout: "fullscreen",
  },
  tags: [],
  argTypes: {},
} as Meta<typeof DatasetChartBlock>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {};
