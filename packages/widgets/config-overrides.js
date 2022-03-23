const {
  override,
  addBabelPlugins,
  addBundleVisualizer
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("customize-cra");

module.exports = override(
  addBabelPlugins("babel-plugin-styled-components"),
  process.env.BUNDLE_VISUALIZE &&
    addBundleVisualizer({
      analyzerMode: "server"
    })
);
