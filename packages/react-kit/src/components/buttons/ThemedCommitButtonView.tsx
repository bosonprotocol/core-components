import React from "react";
import { CommitButtonView, CommitButtonViewProps } from "./CommitButtonView";
import { useBosonTheme } from "../widgets/BosonThemeProvider";

export type ThemedCommitButtonViewProps = Omit<
  CommitButtonViewProps,
  "color" | "shape"
>;
export const ThemedCommitButtonView = (props: ThemedCommitButtonViewProps) => {
  const { roundness, themeKey } = useBosonTheme();
  const commitButtonTheme: Pick<
    CommitButtonViewProps,
    "color" | "layout" | "shape"
  > = {
    shape:
      roundness === "min" ? "sharp" : roundness === "mid" ? "rounded" : "pill",
    layout: "horizontal",
    color:
      themeKey === "light"
        ? "green"
        : themeKey === "blackAndWhite"
          ? "white"
          : "black"
  };
  return (
    <CommitButtonView
      {...props}
      color={commitButtonTheme?.color}
      shape={commitButtonTheme?.shape}
      layout={commitButtonTheme?.layout}
    />
  );
};
