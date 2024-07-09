import { fn } from "@storybook/test";
import React from "react";
import { Meta } from "@storybook/react";
import { Upload } from "../..";
import { EnvironmentProvider } from "../../components/environment/EnvironmentProvider";
import { IpfsProvider } from "../../components/ipfs/IpfsProvider";
import { Formik } from "formik";
import { QueryClientProviderCustom } from "../../components/queryClient/withQueryClientProvider";
import {
  bosonButtonThemeKeys,
  bosonButtonThemes
} from "../../components/ui/ThemedButton";
const name = "upload";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/Upload",
  component: Upload,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // args: { onClick: fn() },
  argTypes: {
    name: {
      table: {
        disabled: true
      }
    },
    accept: {
      control: "select",
      options: ["image/*", "video/*", "image/*,video/*"]
    },
    disabled: { control: "boolean" },
    withEditor: { control: "boolean" },
    // @ts-expect-error saveButtonThemeKey is not a valid prop name of Upload but saveButtonTheme is so we get the theme from the key
    saveButtonThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    },
    placeholder: { control: "text" },
    width: { control: "number" },
    height: { control: "number" },
    borderRadius: { control: "number" }
  },
  decorators: [
    (Story, { args }) => {
      return (
        <QueryClientProviderCustom>
          <EnvironmentProvider configId="testing-80002-0" envName="testing">
            <IpfsProvider>
              <Formik initialValues={{ [name]: [] }} onSubmit={console.log}>
                <Story
                  args={{
                    ...args,
                    saveButtonTheme: bosonButtonThemes({
                      withBosonStyle: false
                      // @ts-expect-error saveButtonThemeKey is not a valid prop name of Upload but saveButtonTheme is so we get the theme from the key
                    })[args.saveButtonThemeKey]
                  }}
                />
              </Formik>
            </IpfsProvider>
          </EnvironmentProvider>
        </QueryClientProviderCustom>
      );
    }
  ]
} satisfies Meta<typeof Upload>;

const BASE_ARGS = {
  name
} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: {
    ...BASE_ARGS
  }
};

export const VideoOnly = {
  args: {
    ...BASE_ARGS,
    accept: "video/mp4",
    withUpload: true
  }
};
