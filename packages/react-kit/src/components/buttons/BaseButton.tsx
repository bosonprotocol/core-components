import React, {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  useCallback
} from "react";
import styled, { css, DefaultTheme, ThemeProvider } from "styled-components";

import { zIndex } from "../ui/zIndex";
import { Tooltip } from "../tooltip/Tooltip";
import * as Styles from "../ui/styles";
import { Typography } from "../ui/Typography";
import { theme } from "../../theme";
import { Loading } from "../Loading";
import { ButtonSize } from "../ui/buttonSize";

const colors = theme.colors.light;

const ButtonWithThemeProps = styled.button<{
  size: ButtonSizeProp;
  fill: boolean | undefined;
}>`
  ${() => Styles.button};
  ${(props) => Styles[props.size as keyof typeof Styles]}
  border-style: solid;
  border-color: ${(props) => props.theme?.borderColor || "transparent"};
  border-width: ${(props) => props.theme?.borderWidth || 0}px;
  border-radius: ${(props) => props.theme?.borderRadius || 0}px;
  color: ${(props) => props.theme?.color || "#000000"};
  background-color: ${(props) => props.theme?.background || "transparent"};
  svg {
    stroke: ${(props) => props.theme?.color || "#000000"};
  }
  ${(props) =>
    props.fill
      ? css`
          width: 100%;
        `
      : ""};
  ${(props) =>
    props.theme?.hover &&
    css`
      &:hover:not(:disabled) {
        background-color: ${props.theme?.hover?.background};
        ${props.theme?.hover?.color &&
        css`
          color: ${props.theme?.hover?.color} !important;
          svg {
            fill: ${props.theme?.hover?.color} !important;
            line {
              stroke: ${props.theme?.hover?.color} !important;
            }
            polyline {
              stroke: ${props.theme?.hover?.color} !important;
            }
            path {
              stroke: ${props.theme?.hover?.color} !important;
            }
          }
        `};
        ${props.theme?.hover?.borderColor &&
        css`
          border-color: ${props.theme.hover.borderColor};
        `};
      }
    `}
  ${(props) =>
    props.theme?.padding
      ? css`
          padding: ${props.theme.padding} !important;
        `
      : ""}

  ${(props) =>
    props.theme?.disabled
      ? css`
          &:disabled {
            background-color: ${props.theme.disabled?.background ||
            "transparent"};
            color: ${props.theme.disabled?.color || colors.darkGrey};
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

type Theme = DefaultTheme;
type ButtonSizeProp = "small" | "regular" | "large" | ButtonSize;

export type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  size?: ButtonSizeProp;
  theme: Theme;
  fill?: boolean;
  step?: number;
  isLoading?: boolean;
  tooltip?: string;
};

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      children,
      onClick,
      size = "regular",
      theme,
      type = "button",
      step = 0,
      fill = false,
      isLoading = false,
      tooltip = "",
      ...rest
    },
    ref
  ) => {
    const Wrapper = useCallback(
      ({ children }: { children: ReactNode }) => {
        if (tooltip !== "" && rest?.disabled) {
          return (
            <Tooltip wrap={false} content={tooltip}>
              {children}
            </Tooltip>
          );
        }
        return <>{children}</>;
      },
      [rest?.disabled, tooltip]
    );
    return (
      <>
        <ThemeProvider theme={theme}>
          <Wrapper>
            <ButtonWithThemeProps
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
            </ButtonWithThemeProps>
          </Wrapper>
        </ThemeProvider>
      </>
    );
  }
);
