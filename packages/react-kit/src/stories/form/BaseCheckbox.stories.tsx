import React from "react";
import { BaseCheckbox, BaseCheckboxProps } from "../../components/form";
import { Formik } from "formik";
import type { Meta } from "@storybook/react";
import { theme } from "../../theme";
import { bosonCheckboxTheme } from "../../components/form/Checkbox";
const colors = theme.colors.light;

const inputName = "test";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Inputs/BaseCheckbox",
  component: BaseCheckbox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    disabled: { control: "boolean" },
    text: { control: "text" }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
  decorators: [
    (Story, { name }) => {
      return (
        <Formik<{ [inputName]: unknown }>
          onSubmit={() => {
            //
          }}
          initialErrors={
            name.toLowerCase().includes("error")
              ? { [inputName]: "Checkbox error!" }
              : {}
          }
          initialValues={{ [inputName]: "" }}
          initialTouched={{ [inputName]: true }}
        >
          <Story />
        </Formik>
      );
    }
  ] satisfies Meta<typeof BaseCheckbox>["decorators"]
} satisfies Meta<typeof BaseCheckbox>;

const BASE_ARGS = {
  name: inputName,
  text: "text next to checkbox via 'text' prop",
  theme: bosonCheckboxTheme
};

export const Simple = {
  args: {
    ...BASE_ARGS
  }
};

export const CustomTheme = {
  name: "With custom theme",
  args: {
    ...BASE_ARGS,
    theme: {
      backgroundColor: colors.blue,
      borderColor: colors.green,
      color: colors.red,
      borderRadius: "4px",
      hover: {
        borderColor: colors.red,
        backgroundColor: colors.primary,
        color: colors.darkRed
      },
      checked: {
        borderColor: "#ff00d4",
        color: "#ff00d4",
        backgroundColor: "#ff00d444"
      },
      error: {
        color: colors.orange,
        borderColor: colors.bosonSkyBlue,
        backgroundColor: colors.cyan
      }
    } satisfies BaseCheckboxProps["theme"]
  }
};
export const InputWithError = {
  name: "With error",
  args: {
    ...BASE_ARGS
  }
};

export const CustomThemeWithError = {
  name: "With custom theme and error",
  args: {
    ...BASE_ARGS,
    theme: {
      backgroundColor: colors.blue,
      borderColor: colors.green,
      hover: {
        borderColor: colors.red,
        backgroundColor: colors.grey
      },
      error: {
        color: colors.orange,
        borderColor: colors.bosonSkyBlue,
        backgroundColor: colors.cyan
      }
    } satisfies BaseCheckboxProps["theme"]
  }
};
