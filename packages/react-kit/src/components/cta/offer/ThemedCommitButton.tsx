import React from "react";
import { CommitButtonProps, CommitButton } from "./CommitButton";
import { useBosonTheme } from "../../widgets/BosonThemeProvider";
import { colorToVariant } from "../../buttons/commit/const";

export type ThemedCommitButtonProps = Omit<
  CommitButtonProps,
  "$color" | "themeVal"
>;
export const ThemedCommitButton = (props: ThemedCommitButtonProps) => {
  const { themeKey } = useBosonTheme();

  const color =
    themeKey === "light"
      ? "green"
      : themeKey === "blackAndWhite"
        ? "black"
        : "white";
  const commitButtonThemeKey = colorToVariant[color];
  return (
    <CommitButton {...props} themeVal={commitButtonThemeKey} $color={color} />
  );
};
