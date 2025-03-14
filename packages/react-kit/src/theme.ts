import "styled-components";
import { colors } from "./colors";
import { buttonBorderRadius } from "./borders";
export { colors } from "./colors";

export const cssVarsKeys = {
  "--background-color": "--background-color",
  "--background-accent-color": "--background-accent-color",
  "--main-text-color": "--main-text-color",
  "--sub-text-color": "--sub-text-color",
  "--border-color": "--border-color",
  "--main-accent-color": "--main-accent-color",
  "--main-accent-hover-color": "--main-accent-hover-color",
  "--secondary-accent-color": "--secondary-accent-color",
  "--secondary-accent-hover-color": "--secondary-accent-hover-color",
  "--tertiary-accent-color": "--tertiary-accent-color",
  "--tertiary-accent-hover-color": "--tertiary-accent-hover-color",
  "--main-button-text-color": "--main-button-text-color",
  "--main-button-text-hover-color": "--main-button-text-hover-color",
  "--secondary-button-text-color": "--secondary-button-text-color",
  "--secondary-button-text-hover-color": "--secondary-button-text-hover-color",
  "--tertiary-button-text-color": "--tertiary-button-text-color",
  "--tertiary-button-text-hover-color": "--tertiary-button-text-hover-color",
  "--button-border-radius": "--button-border-radius",
  "--modal-border-radius": "--modal-border-radius"
};

export type CssVarKeys = keyof typeof cssVarsKeys;
export type ThemePalette = Record<CssVarKeys, string>;
export type Theme = "blackAndWhite" | "dark" | "light";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Themes = Record<Theme, ThemePalette>;
export const themeKeys = {
  light: "light",
  blackAndWhite: "blackAndWhite",
  dark: "dark"
} satisfies Record<Theme, Theme>;
export type Roundness = "min" | "mid" | "high";
export const roundnessKeys = {
  min: "min",
  mid: "mid",
  high: "high"
} satisfies Record<Roundness, Roundness>;

export const getThemes = ({ roundness }: { roundness: Roundness }) => {
  const varsWithSameValuesAccrossThemes = {
    "--button-border-radius":
      roundness === "min" || !roundness
        ? buttonBorderRadius["min"]
        : buttonBorderRadius[roundness] || buttonBorderRadius["min"],
    "--modal-border-radius":
      roundness === "min" || !roundness
        ? ("4px" as `${string}px`)
        : roundness === "mid"
          ? ("12px" as `${string}px`)
          : ("24px" as `${string}px`)
  } as const;
  return {
    light: {
      ...varsWithSameValuesAccrossThemes,
      "--background-color": colors.greyLight, // --bg in figma
      "--background-accent-color": colors.white, // --lvl-1 in figma
      "--main-text-color": colors.black,
      "--sub-text-color": colors.greyDark,
      "--border-color": colors.border,
      "--main-accent-color": colors.green,
      "--main-accent-hover-color": colors.black,
      "--secondary-accent-color": colors.white,
      "--secondary-accent-hover-color": colors.greyLight,
      "--tertiary-accent-color": colors.white,
      "--tertiary-accent-hover-color": colors.greyLight,
      "--main-button-text-color": colors.blackPure,
      "--main-button-text-hover-color": colors.white,
      "--secondary-button-text-color": colors.black,
      "--secondary-button-text-hover-color": colors.black,
      "--tertiary-button-text-color": colors.black,
      "--tertiary-button-text-hover-color": colors.black
    },
    blackAndWhite: {
      ...varsWithSameValuesAccrossThemes,
      "--background-color": colors.greyLight,
      "--background-accent-color": colors.white,
      "--main-text-color": colors.blackPure,
      "--sub-text-color": colors.greyDark2,
      "--border-color": colors.border,
      "--main-accent-color": colors.blackPure,
      "--main-accent-hover-color": colors.black,
      "--secondary-accent-color": colors.white,
      "--secondary-accent-hover-color": colors.greyDark, // it should be greyLight but it's not readable
      "--tertiary-accent-color": colors.white,
      "--tertiary-accent-hover-color": colors.greyLight,
      "--main-button-text-color": colors.white,
      "--main-button-text-hover-color": colors.white,
      "--secondary-button-text-color": colors.black,
      "--secondary-button-text-hover-color": colors.white,
      "--tertiary-button-text-color": colors.black,
      "--tertiary-button-text-hover-color": colors.white
    },
    dark: {
      ...varsWithSameValuesAccrossThemes,
      "--background-color": colors.blackPure,
      "--background-accent-color": colors.black2,
      "--main-text-color": colors.white,
      "--sub-text-color": colors.greyLight3,
      "--border-color": colors.border,
      "--main-accent-color": colors.white,
      "--main-accent-hover-color": colors.black,
      "--secondary-accent-color": colors.black,
      "--secondary-accent-hover-color": colors.greyLight,
      "--tertiary-accent-color": colors.black,
      "--tertiary-accent-hover-color": colors.greyLight,
      "--main-button-text-color": colors.blackPure,
      "--main-button-text-hover-color": colors.white,
      "--secondary-button-text-color": colors.white,
      "--secondary-button-text-hover-color": colors.black, // differs from figma because it's not readable there
      "--tertiary-button-text-color": colors.white,
      "--tertiary-button-text-hover-color": colors.black // differs from figma because it's not readable there
    }
  } as const satisfies Themes;
};

export const getCssVar = (name: CssVarKeys) => `var(${name})`;
