import type { StorybookConfig } from "@storybook/react-webpack5";

import { join, dirname } from "path";
import webpack from "webpack";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-themes")
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  webpackFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        stream: false,
        crypto: false
      }
    };
    config.plugins?.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      })
    );

    // This modifies the existing image rule to exclude `.svg` files
    // since we handle those with `@svgr/webpack`.
    const imageRule = config.module?.rules?.find((rule) => {
      if (typeof rule !== "string" && rule.test instanceof RegExp) {
        return rule.test.test(".svg");
      }
    });
    if (typeof imageRule !== "string" && imageRule) {
      imageRule.exclude = /\.svg$/;
    }

    config.module?.rules?.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      // disable plugins
                      removeViewBox: false
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    });
    config.plugins = config.plugins?.filter((plugin) => !!plugin);
    return config;
  },
  env: (config) => {
    console.log("main storybook", config, process.env);
    return {
      ...config
    };
  }
};
export default config;
