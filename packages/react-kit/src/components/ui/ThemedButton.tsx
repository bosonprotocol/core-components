import React, { ButtonHTMLAttributes, forwardRef, Fragment } from "react";
import styled, { css, ThemeProvider } from "styled-components";

import { zIndex } from "./zIndex";
import { Tooltip } from "../tooltip/Tooltip";
import * as Styles from "./styles";
import { Typography } from "./Typography";
import { theme } from "../../theme";
import { Loading } from "../Loading";
import { ButtonSize } from "./buttonSize";

const colors = theme.colors.light;

const BaseButton = styled.button<{
  size: IButton["size"];
  fill: IButton["fill"];
}>`
  ${() => Styles.button};
  ${(props) => Styles[props.size as keyof typeof Styles]}
  border-style: solid;
  border-color: ${(props) => props.theme.borderColor || "transparent"};
  border-width: ${(props) => props.theme.borderWidth || 0}px;
  color: ${(props) => props.theme.color || "#000000"};
  background-color: ${(props) => props.theme.background || "transparent"};
  svg {
    stroke: ${(props) => props.theme.color || "#000000"};
  }
  ${(props) =>
    props.fill
      ? css`
          width: 100%;
        `
      : ""};
  ${(props) =>
    props.theme.hover &&
    css`
      &:hover:not(:disabled) {
        background-color: ${props.theme.hover.background};
        ${props.theme.hover.color &&
        css`
          color: ${props.theme.hover.color} !important;
          svg {
            fill: ${props.theme.hover.color} !important;
            line {
              stroke: ${props.theme.hover.color} !important;
            }
            polyline {
              stroke: ${props.theme.hover.color} !important;
            }
            path {
              stroke: ${props.theme.hover.color} !important;
            }
          }
        `};
        ${props.theme.hover.borderColor &&
        css`
          border-color: ${props.theme.hover.borderColor};
        `};
      }
    `}
  ${(props) =>
    props.theme.padding
      ? css`
          padding: ${props.theme.padding} !important;
        `
      : ""}

  ${(props) =>
    props.theme.disabled
      ? css`
          &:disabled {
            background-color: ${props.theme.disabled.background ||
            "transparent"};
            color: ${props.theme.disabled.color || colors.darkGrey};
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.5;
          }
        `
      : css`
          &:disabled {
            background-color: ${colors.lightGrey};
            color: ${colors.darkGrey};
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.5;
          }
        `};
`;

const ChildWrapperButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: ${zIndex.Button};

  ${() => Styles.buttonText};
`;

const allThemes = ({ withBosonStyle }: { withBosonStyle?: boolean }) => {
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
      border: "none",
      hover: {
        background: colors.lightGrey,
        color: colors.black,
        border: "none"
      }
    },
    accentInvertedNoBorder: {
      background: "transparent",
      color: colors.accent,
      border: "none",
      hover: {
        background: colors.black,
        color: colors.white,
        border: "none"
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
        borderColor: colors.black,
        border: "none"
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
  };
};

export type IButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  size?: "small" | "regular" | "large" | ButtonSize;
  themeVal?: keyof ReturnType<typeof allThemes>;
  type?: "button" | "submit" | "reset" | undefined;
  fill?: boolean;
  step?: number;
  isLoading?: boolean;
  tooltip?: string;
  withBosonStyle?: boolean;
};

const ThemedButton = forwardRef<HTMLButtonElement, IButton>(
  (
    {
      children,
      onClick,
      size = "regular",
      themeVal = "primary",
      type = "button",
      step = 0,
      fill = false,
      isLoading = false,
      tooltip = "",
      withBosonStyle = false,
      ...rest
    },
    ref
  ) => {
    const Wrapper = tooltip !== "" && rest?.disabled ? Tooltip : Fragment;
    const wrapperParams =
      tooltip !== "" && rest?.disabled ? { wrap: false, content: tooltip } : {};
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ThemeProvider theme={allThemes({ withBosonStyle })[themeVal]}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Wrapper {...wrapperParams}>
            <BaseButton
              onClick={onClick}
              type={type}
              size={size}
              fill={fill ? fill : undefined}
              {...rest}
              ref={ref}
            >
              {isLoading ? (
                <Loading />
              ) : (
                <ChildWrapperButton data-child-wrapper-button>
                  {children}
                  {step !== 0 && (
                    <Typography>
                      <small>Step {step}</small>
                    </Typography>
                  )}
                </ChildWrapperButton>
              )}
            </BaseButton>
          </Wrapper>
        </ThemeProvider>
      </>
    );
  }
);

export default ThemedButton;
