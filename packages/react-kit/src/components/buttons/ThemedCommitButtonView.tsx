import React from "react";
import { CommitButtonView, CommitButtonViewProps } from "./CommitButtonView";
import { useBosonTheme } from "../widgets/BosonThemeProvider";
import { useTheme } from "styled-components";

export type ThemedCommitButtonViewProps = Omit<CommitButtonViewProps, "color">;
export const ThemedCommitButtonView = (props: ThemedCommitButtonViewProps) => {
  const themeFromStyledComponents = useTheme();
  const { theme, themeKey } = useBosonTheme();
  console.log("ThemedCommitButtonView theme", {
    themeKey,
    themeFromStyledComponents,
    theme
  });
  return (
    <CommitButtonView {...props} color={theme.backgroundButtonPrimaryName} />
  );
};
