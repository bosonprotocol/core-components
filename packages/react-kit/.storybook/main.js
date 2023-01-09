const webpack = require("webpack");


module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app",
    "storybook-addon-styled-component-theme/dist/preset",
    "@storybook/addon-viewport"
  ],
  "framework": "@storybook/react",
  "core": {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
      },
    },
  },

  webpackFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        stream: false,
        crypto: false,
      }
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
}