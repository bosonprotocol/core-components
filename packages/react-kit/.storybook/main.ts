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
    if (config.module) {
      config.module.rules = config.module.rules?.map((rule) => {
        // @ts-ignore
        return "test" in rule && rule.test.test(".svg")
          ? // @ts-ignore
            { ...rule, exclude: /assets.+\.svg$/ }
          : rule;
      });
      config.module.rules?.unshift({
        test: /\.svg$/,
        // use: ["@svgr/webpack"]
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
    }
    config.plugins = config.plugins?.filter((plugin) => !!plugin);
    return config;
  },
  env: (config) => {
    return {
      ...config
    };
  }
};
export default config;
