import React from "react";
import { CommitButtonView } from "./CommitButtonView";
import { useBosonTheme } from "../../widgets/BosonThemeProvider";
import { CommitButtonViewProps } from "./types";

export type ThemedCommitButtonViewProps = Omit<
  CommitButtonViewProps,
  "color" | "shape" | "onClick"
> & { onClick?: CommitButtonViewProps["onClick"] };
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
          ? "black"
          : "white"
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
