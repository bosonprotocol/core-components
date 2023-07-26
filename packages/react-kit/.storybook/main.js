const webpack = require("webpack");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app",
    "storybook-addon-styled-component-theme/dist/preset",
    "@storybook/addon-viewport"
  ],
  framework: "@storybook/react",
  core: {
    builder: {
      name: "webpack5",
      options: {
        lazyCompilation: true
      }
    }
  },

  webpackFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        stream: false,
        crypto: false
      }
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      })
    );
    // TODO: remove this code so that ESLintWebpackPlugin is enabled again. Without this, the build did not succeed to eslint useGetLensProfiles -> packages/react-kit/src/lib/lens/generated.ts
    const indexOfEsLint = config.plugins.findIndex((plugin) => {
      return plugin.key === "ESLintWebpackPlugin";
    });
    if (indexOfEsLint === -1) {
      throw new Error("could not delete ESLintWebpackPlugin");
    }
    delete config.plugins[indexOfEsLint];

    config.plugins = config.plugins.filter((plugin) => !!plugin);
    return config;
  }
};
