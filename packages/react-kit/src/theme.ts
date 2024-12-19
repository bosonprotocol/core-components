import "styled-components";
import { colors } from "./colors";
export { colors } from "./colors";

export const cssVarsKeys = {
  "--background-color": "--background-color",
  "--background-accent-color": "--background-accent-color",
  "--main-text-color": "--main-text-color",
  "--sub-text-color": "--sub-text-color",
  "--border-color": "--border-color",
  "--main-accent-color": "--main-accent-color",
  "--secondary-accent-color": "--secondary-accent-color",
  "--button-text-color": "--button-text-color",
  "--button-border-radius": "--button-border-radius"
} as const;
const otherThemeKeys = {
  backgroundButtonPrimaryName: "backgroundButtonPrimaryName"
} as const;

type CssVarKeys = keyof typeof cssVarsKeys;
export type ThemePalette = Record<
  CssVarKeys | keyof typeof otherThemeKeys,
  string
>;
export type Theme = "blackAndWhite" | "dark" | "light";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Themes = Record<Theme, ThemePalette>;
export const themeKeys = {
  light: "light",
  blackAndWhite: "blackAndWhite",
  dark: "dark"
} satisfies Record<Theme, Theme>;
const varsWithSameValuesAccrossThemes = {
  "--button-border-radius": "2px" as `${string}px`
} as const;
export const themes = {
  light: {
    ...varsWithSameValuesAccrossThemes,
    "--background-color": colors.greyLight, // --bg in figma
    "--background-accent-color": colors.white, // --lvl-1 in figma
    "--main-text-color": colors.black,
    "--sub-text-color": colors.greyDark,
    "--border-color": colors.border,
    "--main-accent-color": colors.green,
    "--secondary-accent-color": colors.violet,
    "--button-text-color": colors.blackPure,
    backgroundButtonPrimaryName: "green"
  },
  blackAndWhite: {
    ...varsWithSameValuesAccrossThemes,
    "--background-color": colors.greyLight,
    "--background-accent-color": colors.white,
    "--main-text-color": colors.blackPure,
    "--sub-text-color": colors.greyDark2,
    "--border-color": colors.border,
    "--main-accent-color": colors.blackPure,
    "--secondary-accent-color": colors.black2,
    "--button-text-color": colors.white,
    backgroundButtonPrimaryName: "black"
  },
  dark: {
    ...varsWithSameValuesAccrossThemes,
    "--background-color": colors.blackPure,
    "--background-accent-color": colors.black2,
    "--main-text-color": colors.white,
    "--sub-text-color": colors.greyLight3,
    "--border-color": colors.border,
    "--main-accent-color": colors.white,
    "--secondary-accent-color": colors.black2,
    "--button-text-color": colors.blackPure,
    backgroundButtonPrimaryName: "white"
  }
} as const satisfies Themes;

export const getCssVar = (name: CssVarKeys) => `var(${name})`;
