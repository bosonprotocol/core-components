import { fn } from "@storybook/test";
import {
  CountryCode,
  CountrySelect,
  CountrySelectProps,
  theme
} from "../../index";
import React from "react";
import { Meta } from "@storybook/react";
import { Formik } from "formik";

const inputWithErrors = "With error";
const inputName = "test";
const countries: CountryCode[] = [
  "AR",
  "AU",
  "AT",
  "BE",
  "BR",
  "GR",
  "HK",
  "IS",
  "IN",
  "IE",
  "IL",
  "IT",
  "JP",
  "KR",
  "LU"
];
const colors = theme.colors.light;
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Selects/CountrySelect",
  component: CountrySelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: { onClick: fn() },
  argTypes: {
    name: {
      table: {
        disable: true // remove name input in controls
      }
    },
    countries: {
      table: {
        disable: true
      }
    },
    theme: {
      table: {
        disable: true
      }
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" }
  },
  decorators: [
    (Story, { args, name }) => {
      return (
        <Formik<{ [inputName]: unknown }>
          onSubmit={() => {
            //
          }}
          initialErrors={
            name === inputWithErrors
              ? { [inputName]: "There has been an error!" }
              : {}
          }
          initialValues={{ [inputName]: "" }}
          initialTouched={{ [inputName]: true }}
        >
          <Story args={{ ...args, name: inputName }} />
        </Formik>
      );
    }
  ]
} satisfies Meta<typeof CountrySelect>;

const BASE_ARGS = {
  name: inputName,
  countries
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: { ...BASE_ARGS } satisfies CountrySelectProps
};

export const CustomTheme = {
  args: {
    ...BASE_ARGS,
    theme: {
      controlHeight: "45px",
      borderRadius: "30px",
      controlBackground: colors.lightGrey,
      controlFocusBorderColor: colors.blue,
      controlHoverBorderColor: colors.red,
      controlUnfocusedBorderColor: colors.border,
      selectedOptionBackground: colors.lightGrey,
      selectedOptionColor: colors.orange,
      unselectedOptionBackground: colors.white,
      unselectedOptionColor: colors.black
    }
  } satisfies CountrySelectProps
};

export const WithError = {
  name: inputWithErrors,
  args: {
    ...BASE_ARGS,
    placeholder: "this is a placeholder"
  } satisfies CountrySelectProps
};
