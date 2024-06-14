import React, { ButtonHTMLAttributes, forwardRef } from "react";

import { theme } from "../../theme";
import { BaseButton, BaseButtonTheme } from "../buttons/BaseButton";
import { ButtonSize } from "./buttonSize";

const colors = theme.colors.light;

export const bosonButtonThemeKeys = [
  "primary",
  "bosonPrimary",
  "secondary",
  "bosonSecondary",
  "secondaryInverted",
  "accentInvertedNoBorder",
  "accentInverted",
  "orangeInverse",
  "bosonSecondaryInverse",
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
export const bosonButtonThemes = ({
  withBosonStyle
}: {
  withBosonStyle?: boolean;
}) => {
  return {
    primary: {
      color: withBosonStyle ? colors.black : "var(--textColor)",
      background: withBosonStyle
        ? colors.green
        : `var(--accentNoDefault, ${colors.green})`,
      borderColor: withBosonStyle
        ? colors.green
        : `var(--accentNoDefault, ${colors.green})`,
      borderWidth: 2,
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    bosonPrimary: {
      color: colors.black,
      background: colors.primary,
      borderColor: colors.primary,
      borderWidth: 2,
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    secondary: {
      color: withBosonStyle ? colors.secondary : "var(--accent)",
      borderColor: withBosonStyle ? colors.secondary : "var(--accent)",
      borderWidth: 2,
      hover: {
        background: withBosonStyle ? colors.secondary : "var(--accent)",
        color: colors.white
      }
    },
    bosonSecondary: {
      color: colors.secondary,
      borderColor: colors.secondary,
      borderWidth: 2,
      hover: {
        background: colors.secondary,
        color: colors.white
      }
    },
    secondaryInverted: {
      background: "transparent",
      color: colors.secondary,
      hover: {
        background: colors.lightGrey,
        color: colors.black
      }
    },
    accentInvertedNoBorder: {
      background: "transparent",
      color: colors.accent,
      hover: {
        background: colors.black,
        color: colors.white
      }
    },
    accentInverted: {
      background: "transparent",
      color: colors.accent,
      borderColor: colors.accent,
      borderWidth: 2,
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
      hover: {
        background: colors.orange,
        color: colors.white
      }
    },
    bosonSecondaryInverse: {
      color: colors.white,
      borderColor: colors.secondary,
      background: colors.secondary,
      borderWidth: 2,
      hover: {
        color: colors.secondary,
        borderColor: colors.secondary,
        background: colors.white
      }
    },
    orange: {
      color: colors.orange,
      borderColor: colors.border,
      hover: {
        background: colors.border
      }
    },
    outline: {
      color: colors.black,
      borderColor: colors.border,
      borderWidth: 2,
      hover: {
        background: colors.border,
        color: "var(--accent)"
      }
    },
    ghostSecondary: {
      color: colors.secondary,
      borderColor: colors.border,
      hover: {
        background: colors.border
      }
    },
    blank: {
      color: `${colors.black}4d`,
      hover: {
        color: colors.black
      },
      background: "transparent",
      disabled: {
        background: "transparent"
      }
    },
    blankSecondary: {
      color: "var(--accent)",
      hover: {
        borderColor: colors.secondary,
        background: colors.border,
        color: colors.black
      }
    },
    blankSecondaryOutline: {
      color: "var(--accent)",
      borderWidth: 2,
      borderColor: colors.secondary,
      hover: {
        borderColor: colors.secondary,
        background: colors.border,
        color: colors.black
      }
    },
    blankOutline: {
      color: colors.black,
      borderWidth: 2,
      hover: {
        borderColor: colors.secondary,
        background: colors.border,
        color: colors.black
      }
    },
    white: {
      color: colors.black,
      background: colors.white,
      borderWidth: 2,
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
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    accentFill: {
      color: theme.colors.light.black,
      background: theme.colors.light.accent,
      borderColor: "transparent",
      borderWidth: 2,
      hover: {
        background: theme.colors.light.black,
        color: theme.colors.light.white,
        borderColor: theme.colors.light.black
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
  withBosonStyle?: boolean;
};

const ThemedButton = forwardRef<HTMLButtonElement, IButton>(
  ({ themeVal = "primary", withBosonStyle = false, ...rest }, ref) => {
    return (
      <BaseButton
        {...rest}
        ref={ref}
        theme={bosonButtonThemes({ withBosonStyle })[themeVal]}
      />
    );
  }
);

export default ThemedButton;
