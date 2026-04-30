import type { Meta, StoryObj } from "@storybook/react";

import { Table } from "app/components/table";
import {
  TABLE_VARIATION_1_DATA,
  TABLE_VARIATION_1_COLUMNS,
  TABLE_VARIATION_2_DATA,
  TABLE_VARIATION_2_COLUMNS,
  TABLE_VARIATION_3_DATA,
  TABLE_VARIATION_3_COLUMNS,
  TABLE_VARIATION_4_DATA,
  TABLE_VARIATION_4_COLUMNS,
  TABLE_VARIATION_5_DATA,
  TABLE_VARIATION_5_COLUMNS,
  TABLE_VARIATION_6_DATA,
  TABLE_VARIATION_6_COLUMNS,
  TABLE_VARIATION_7_DATA,
  TABLE_VARIATION_7_COLUMNS,
  TABLE_VARIATION_8_DATA,
  TABLE_VARIATION_8_COLUMNS,
  TABLE_VARIATION_9_DATA,
  TABLE_VARIATION_9_COLUMNS,
  TABLE_VARIATION_10_DATA,
  TABLE_VARIATION_10_COLUMNS,
  TABLE_VARIATION_11_DATA,
  TABLE_VARIATION_11_COLUMNS,
  TABLE_VARIATION_12_DATA,
  TABLE_VARIATION_12_COLUMNS,
} from "app/components/table/data";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Table>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Variant1: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_1_DATA,
    columns: TABLE_VARIATION_1_COLUMNS,
  },
};

export const Variant2: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    dataTreeBranchElement: false,
    data: TABLE_VARIATION_2_DATA,
    columns: TABLE_VARIATION_2_COLUMNS.slice(0, 7),
    extraColumns: TABLE_VARIATION_2_COLUMNS.slice(
      7,
      TABLE_VARIATION_2_COLUMNS.length - 1,
    ),
  },
};

export const Variant3: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    dataTreeBranchElement: false,
    data: TABLE_VARIATION_3_DATA,
    columns: TABLE_VARIATION_3_COLUMNS,
  },
};

export const Variant4: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_4_DATA,
    columns: TABLE_VARIATION_4_COLUMNS.slice(0, 1),
    extraColumns: TABLE_VARIATION_4_COLUMNS.slice(
      1,
      TABLE_VARIATION_2_COLUMNS.length - 1,
    ),
  },
};

export const Variant5: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_5_DATA,
    columns: TABLE_VARIATION_5_COLUMNS,
  },
};

export const Variant6: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_6_DATA,
    columns: TABLE_VARIATION_6_COLUMNS,
  },
};

export const Variant7: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_7_DATA,
    columns: TABLE_VARIATION_7_COLUMNS,
  },
};

export const Variant8: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_8_DATA,
    columns: TABLE_VARIATION_8_COLUMNS,
  },
};

export const Variant9: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    dataTreeStartExpanded: true,
    data: TABLE_VARIATION_9_DATA,
    columns: TABLE_VARIATION_9_COLUMNS,
  },
};

export const Variant10: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    dataTreeStartExpanded: true,
    data: TABLE_VARIATION_10_DATA,
    columns: TABLE_VARIATION_10_COLUMNS,
  },
};

export const Variant11: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_11_DATA,
    columns: TABLE_VARIATION_11_COLUMNS,
  },
};

export const Variant12: StoryType = {
  args: {
    id: "table",
    dataTree: true,
    data: TABLE_VARIATION_12_DATA,
    columns: TABLE_VARIATION_12_COLUMNS,
  },
};
