import type { Preview } from "@storybook/react";

import React from "react";
import { MemoryRouter } from "react-router-dom";
import Providers from "../src/app/Providers";
import { useCMSData } from "../src/app/hooks/useCMSData";
import { useInitialLoad } from "../src/app/hooks/useInitialLoad";
import { useCMSCollections } from "../src/app/hooks/useCMSCollections";

const CMSLoaderDecorator = () => {
  useInitialLoad();
  useCMSData({ loadData: true });
  useCMSCollections({ loadData: true });

  return null;
};

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <Providers>
        <CMSLoaderDecorator />
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
