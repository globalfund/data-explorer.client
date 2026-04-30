import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "@chromatic-com/storybook"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    defaultName: "Documentation",
    docsMode: true,
  },
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: false,
  },
};

export default config;
