import React, { ButtonHTMLAttributes, forwardRef } from "react";

import { colors, getCssVar } from "../../theme";
import { BaseButton, BaseButtonTheme } from "../buttons/BaseButton";
import { ButtonSize } from "./buttonSize";

export const bosonButtonThemeKeys = [
  "primary",
  "secondary",
  "tertiary",
  "secondaryInverted",
  "accentInverted",
  "orangeInverse",
  "violet",
  "orange",
  "outline",
  "ghostSecondary",
  "blank",
  "blankSecondary",
  "blankSecondaryOutline",
  "blankOutline",
  "white",
  "black",
  "warning",
  "escalate",
  "accentFill"
] as const;
export const bosonButtonThemes = () => {
  return {
    primary: {
      color: getCssVar("--main-button-text-color"),
      background: getCssVar("--main-accent-color"),
      borderColor: getCssVar("--main-accent-color"),
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: getCssVar("--main-accent-hover-color"),
        color: getCssVar("--main-button-text-hover-color"),
        borderColor: getCssVar("--main-accent-hover-color")
      }
    },
    secondary: {
      color: getCssVar("--secondary-button-text-color"),
      background: getCssVar("--secondary-accent-color"),
      borderColor: getCssVar("--secondary-button-text-color"),
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: getCssVar("--secondary-accent-hover-color"),
        color: getCssVar("--secondary-button-text-hover-color"),
        borderColor: getCssVar("--secondary-accent-hover-color")
      }
    },
    tertiary: {
      color: getCssVar("--tertiary-button-text-color"),
      background: getCssVar("--tertiary-accent-color"),
      borderColor: getCssVar("--tertiary-button-text-color"),
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: getCssVar("--tertiary-accent-hover-color"),
        color: getCssVar("--tertiary-button-text-hover-color"),
        borderColor: getCssVar("--tertiary-accent-hover-color")
      }
    },
    secondaryInverted: {
      // TODO: not actually inverted from secondary
      background: "transparent",
      color: colors.violet,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.greyLight,
        color: colors.black
      }
    },
    accentInverted: {
      background: "transparent",
      color: colors.violet,
      borderColor: colors.violet,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    orangeInverse: {
      color: colors.orange,
      borderColor: colors.orange,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.orange,
        color: colors.white
      }
    },
    violet: {
      color: colors.white,
      borderColor: colors.violet,
      background: colors.violet,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        color: colors.white,
        borderColor: colors.black,
        background: colors.black
      }
    },
    orange: {
      color: colors.orange,
      borderColor: colors.border,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.border
      }
    },
    outline: {
      color: colors.black,
      borderColor: colors.border,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.border,
        color: colors.violet
      }
    },
    ghostSecondary: {
      color: colors.violet,
      borderColor: colors.border,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.border
      }
    },
    blank: {
      color: `${colors.black}4d`,
      background: "transparent",
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        color: colors.black
      },
      disabled: {
        background: "transparent"
      }
    },
    blankSecondary: {
      color: colors.violet,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        borderColor: colors.violet,
        background: colors.border,
        color: colors.black
      }
    },
    blankSecondaryOutline: {
      color: colors.violet,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      borderColor: colors.violet,
      hover: {
        borderColor: colors.violet,
        background: colors.border,
        color: colors.black
      }
    },
    blankOutline: {
      color: colors.black,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        borderColor: colors.violet,
        background: colors.border,
        color: colors.black
      }
    },
    white: {
      color: colors.black,
      background: colors.white,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      borderColor: colors.border,
      hover: {
        color: colors.white,
        background: colors.black
      }
    },
    black: {
      color: colors.white,
      background: colors.black,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      borderColor: colors.black,
      hover: {
        color: colors.black,
        background: colors.white
      }
    },
    warning: {
      color: colors.black,
      borderColor: colors.orange,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.orange,
        color: colors.white
      }
    },
    escalate: {
      color: colors.black,
      background: colors.orange,
      borderColor: colors.orange,
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    accentFill: {
      color: colors.black,
      background: colors.violet,
      borderColor: "transparent",
      borderWidth: 2,
      borderRadius: getCssVar("--button-border-radius"),
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    }
  } satisfies Record<(typeof bosonButtonThemeKeys)[number], BaseButtonTheme>;
};

export type IButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  size?: "small" | "regular" | "large" | ButtonSize;
  themeVal?: keyof ReturnType<typeof bosonButtonThemes>;
  type?: "button" | "submit" | "reset" | undefined;
  fill?: boolean;
  step?: number;
  isLoading?: boolean;
  tooltip?: string;
};
const bosonThemes = bosonButtonThemes();
const ThemedButton = forwardRef<HTMLButtonElement, IButton>(
  ({ themeVal = "primary", ...rest }, ref) => {
    return <BaseButton {...rest} ref={ref} theme={bosonThemes[themeVal]} />;
  }
);

export default ThemedButton;
