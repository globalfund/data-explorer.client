import type { Preview } from "@storybook/react";

import React from "react";
import { MemoryRouter } from "react-router-dom";
import Providers from "../src/app/Providers";

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <Providers>
        <React.StrictMode>
          <Story />
        </React.StrictMode>
      </Providers>
    </MemoryRouter>
  ),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
