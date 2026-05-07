/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../.storybook/stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-essentials", "@storybook/addon-links"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;

