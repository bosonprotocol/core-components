/* eslint @typescript-eslint/no-var-requires: "off" */
const {
  override,
  addBabelPlugins,
  addBundleVisualizer,
  addWebpackPlugin,
  addWebpackResolve
} = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
  addWebpackResolve({
    fallback: {
      buffer: require.resolve("buffer")
    }
  }),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    })
  ),
  addBabelPlugins("babel-plugin-styled-components"),
  process.env.BUNDLE_VISUALIZE &&
    addBundleVisualizer({
      analyzerMode: "server"
    })
);
