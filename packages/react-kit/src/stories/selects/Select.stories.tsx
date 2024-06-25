import { fn } from "@storybook/test";
import { Select, SelectProps, theme } from "../../index";
import React from "react";
import { Meta } from "@storybook/react";
import { Formik } from "formik";

const inputWithErrors = "With error";
const inputName = "test";

const colors = theme.colors.light;
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Selects/Select",
  component: Select,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: { onChange: fn() },
  argTypes: {
    name: {
      table: {
        disable: true // remove name input in controls
      }
    },
    theme: {
      table: {
        disable: true // remove name input in controls
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
} satisfies Meta<typeof Select>;

const BASE_ARGS = {
  name: inputName,
  options: [
    { label: "first option", value: "1" },
    { label: "second option", value: "2" },
    { label: "third option", value: "3" }
  ]
} as SelectProps;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: { ...BASE_ARGS } satisfies SelectProps
};

export const CustomTheme = {
  args: {
    ...BASE_ARGS,
    theme: {
      control: {
        background: colors.arsenic,
        borderRadius: "16px",
        padding: "3px",
        boxShadow: "1px 2px 3px 4px blue",
        borderWidth: undefined,
        border: "1px solid green",
        focus: {
          border: "1px solid red"
        },
        hover: {
          borderColor: undefined,
          borderWidth: undefined,
          border: "1px solid purple"
        },
        error: {
          border: "1px solid orange"
        }
      },
      option: {
        opacity: "1",
        background: "pink",
        color: "brown",
        selected: {
          background: "yellow",
          color: "cyan"
        },
        disabled: {
          opacity: "0.8"
        }
      }
    }
  } satisfies SelectProps
};

export const WithError = {
  name: inputWithErrors,
  args: {
    ...BASE_ARGS,
    placeholder: "this is a placeholder"
  } satisfies SelectProps
};
