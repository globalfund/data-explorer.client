import React from "react";
import { Box, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkipToMainButton } from ".";

const meta = {
  title: "Components/SkipToMainButton",
  component: SkipToMainButton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof SkipToMainButton>;

export default meta;
type StoryType = StoryObj<typeof meta>;

export const Primary: StoryType = {
  render: () => (
    <Box padding="32px">
      <SkipToMainButton />
      <Typography>
        Focus the page and press Tab to reveal the skip link.
      </Typography>
    </Box>
  ),
};
