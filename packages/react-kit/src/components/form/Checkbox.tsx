import React from "react";

import { theme } from "../../theme";
import { BaseCheckbox, BaseCheckboxProps } from "./BaseCheckbox";

const colors = theme.colors.light;
export const bosonCheckboxTheme = {
  backgroundColor: colors.greyLight,
  borderColor: colors.border,
  hover: {
    borderColor: colors.violet
  },
  error: {
    borderColor: colors.orange
  }
} satisfies BaseCheckboxProps["theme"];
export type CheckboxProps = Omit<BaseCheckboxProps, "theme">;
export function Checkbox(props: CheckboxProps) {
  return <BaseCheckbox {...props} theme={bosonCheckboxTheme} />;
}
