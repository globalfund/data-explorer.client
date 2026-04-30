import type { Meta, StoryObj } from "@storybook/react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PieChart } from "app/components/charts/pie";
import {
  STORY_DATA_VARIANT_1,
  STORY_DATA_VARIANT_2,
  STORY_DATA_VARIANT_3,
} from "app/components/charts/pie/data";

const meta = {
  title: "Components/Charts/Pie chart",
  component: PieChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof PieChart>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const PieChartVariant1: StoryType = {
  args: {
    data: STORY_DATA_VARIANT_1,
  },
  render: () => (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        gap="16px"
        display="flex"
        alignItems="center"
        width="calc(100% / 3)"
        flexDirection="column"
      >
        <Typography color="#000" fontSize="18px" fontWeight="700">
          Components
        </Typography>
        <PieChart data={STORY_DATA_VARIANT_1} />
      </Box>
      <Box
        gap="16px"
        display="flex"
        alignItems="center"
        width="calc(100% / 3)"
        flexDirection="column"
      >
        <Typography color="#000" fontSize="18px" fontWeight="700">
          Principal Recipients
        </Typography>
        <PieChart data={STORY_DATA_VARIANT_2} />
      </Box>
      <Box
        gap="16px"
        display="flex"
        alignItems="center"
        width="calc(100% / 3)"
        flexDirection="column"
      >
        <Typography color="#000" fontSize="18px" fontWeight="700">
          Investments
        </Typography>
        <PieChart data={STORY_DATA_VARIANT_3} />
      </Box>
    </Box>
  ),
};
