import React from "react";
import { theme } from "../../theme";
import { BaseInput, BaseInputProps } from "./BaseInput";
const colors = theme.colors.light;
const bosonTheme = {
  background: colors.lightGrey,
  borderColor: colors.border,
  borderRadius: 0,
  focus: {
    caretColor: "initial"
  },
  hover: {
    borderColor: colors.lightGrey
  },
  error: {
    borderColor: colors.orange,
    hover: {
      borderColor: colors.orange
    },
    focus: {
      borderColor: colors.orange,
      caretColor: colors.orange
    },
    placeholder: {
      color: colors.orange
    }
  }
} satisfies BaseInputProps["theme"];
const clearButtonTheme = {
  fill: "#cccccc",
  stroke: "#cccccc",
  hover: {
    fill: "#999999",
    stroke: "#999999"
  }
} satisfies BaseInputProps["clearButtonTheme"];
export type InputProps = Omit<BaseInputProps, "theme" | "clearButtonTheme">;
export default function Input(props: InputProps) {
  return (
    <BaseInput
      {...props}
      theme={bosonTheme}
      clearButtonTheme={clearButtonTheme}
    />
  );
}
