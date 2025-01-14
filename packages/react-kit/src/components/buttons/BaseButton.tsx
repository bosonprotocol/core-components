import React, {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  useCallback
} from "react";
import styled, { css, CSSProperties, RuleSet } from "styled-components";

import { Tooltip } from "../tooltip/Tooltip";
import * as Styles from "../ui/styles";
import { colors } from "../../theme";
import { Loading } from "../ui/loading/Loading";
import { ButtonSize } from "../ui/buttonSize";
import { AddDollarPrefixToKeys, AnyString } from "../../types/helpers";

type ButtonWithThemePropsType = AddDollarPrefixToKeys<{
  size: ButtonSizeProp;
  fill: boolean | undefined;
}> & { theme: BaseButtonTheme };
const ButtonWithThemeProps = styled.button<ButtonWithThemePropsType>`
  ${() => Styles.button};
  ${(props) => Styles[props.$size as keyof typeof Styles]}
  border-style: solid;
  border-color: ${(props) => props.theme?.borderColor || "transparent"};
  border-width: ${(props) => props.theme?.borderWidth || 0}px;
  border-radius: ${(props) =>
    typeof props.theme?.borderRadius === "number"
      ? `${props.theme.borderRadius || 0}px`
      : props.theme?.borderRadius};
  ${(props) =>
    props.theme?.boxShadow ? `box-shadow: ${props.theme.boxShadow}` : ""};
  color: ${(props) => props.theme?.color || "#000000"};
  background-color: ${(props) => props.theme?.background || "transparent"};

  svg {
    ${(props) =>
      props.theme.svg &&
      css`
        stroke: ${(props) => props.theme?.svg.stroke};
        ${props.theme.svg.fill &&
        css`
          fill: ${props.theme.svg.fill};
        `};
        line {
          ${props.theme.svg.line?.stroke &&
          css`
            stroke: ${props.theme.svg.line.stroke};
          `};
        }
        polyline {
          ${props.theme.svg.polyline?.stroke &&
          css`
            stroke: ${props.theme.svg.polyline?.stroke};
          `};
        }
        path {
          ${props.theme.svg.path?.stroke &&
          css`
            stroke: ${props.theme.svg.path.stroke};
          `};
          ${props.theme.svg.path?.fill &&
          css`
            fill: ${props.theme.svg.path.fill};
          `};
        }
      `}
  }
  ${(props) =>
    props.$fill
      ? css`
          width: 100%;
        `
      : ""};

  ${(props) => {
    props.className === "closeeeee" &&
      console.log(
        "baseButton",
        props.className,
        props,
        props.theme?.hover,
        props.theme.hover?.svg?.line?.stroke
      );
    return "";
  }}
  ${(props) =>
    props.theme?.hover &&
    css`
      &:hover:not(:disabled) {
        background-color: ${props.theme?.hover.background};
        ${props.theme?.hover.color &&
        css`
          color: ${props.theme.hover.color};
        `};

        svg {
          fill: ${props.theme.hover?.svg?.fill};
          line {
            stroke: ${props.theme.hover?.svg?.line?.stroke};
          }
          polyline {
            stroke: ${props.theme.hover?.svg?.polyline?.stroke};
          }
          path {
            stroke: ${props.theme.hover?.svg?.path?.stroke};
            ${props.theme.hover?.svg?.path?.fill &&
            css`
              fill: ${props.theme.hover?.svg?.path?.fill};
            `};
          }
        }
        ${props.theme?.hover.borderColor &&
        css`
          border-color: ${props.theme.hover.borderColor};
        `};
      }
    `}
  ${(props) =>
    props.theme?.padding !== undefined
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
            color: ${props.theme.disabled?.color || colors.greyDark};
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.5;
          }
        `
      : css`
          &:disabled {
            background-color: ${colors.greyLight};
            color: ${colors.greyDark};
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.5;
          }
        `};
  ${(props) => {
    if (props.theme.applyCustomStyles) {
      return props.theme.applyCustomStyles(props);
    }
    return "";
  }}
`;

type SvgTheme = Partial<{
  stroke: CSSProperties["color"];
  fill: CSSProperties["color"];
  line: Partial<{
    stroke: CSSProperties["color"];
  }>;
  polyline: Partial<{
    stroke: CSSProperties["color"];
  }>;
  path: Partial<{
    stroke: CSSProperties["color"];
    fill: CSSProperties["color"];
  }>;
}>;

export type BaseButtonTheme = {
  background?: CSSProperties["backgroundColor"];
  borderColor?: CSSProperties["borderColor"];
  borderRadius?: `${string}px` | AnyString;
  borderWidth?: CSSProperties["borderWidth"];
  boxShadow?: CSSProperties["boxShadow"];
  color?: CSSProperties["color"];
  padding?: CSSProperties["padding"];
  gap?: CSSProperties["gap"];
  svg?: SvgTheme;
  hover?: {
    background?: CSSProperties["backgroundColor"];
    borderColor?: CSSProperties["borderColor"];
    color?: CSSProperties["color"];
    svg?: SvgTheme;
  };
  disabled?: {
    background?: CSSProperties["backgroundColor"];
    color?: CSSProperties["color"];
  };
  applyCustomStyles?: (
    buttonWithThemePropsType: ButtonWithThemePropsType
  ) => RuleSet<object>;
};
type ButtonSizeProp = "small" | "regular" | "large" | ButtonSize;

export type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  size?: ButtonSizeProp;
  theme: BaseButtonTheme;
  fill?: boolean;
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
        <Wrapper>
          <ButtonWithThemeProps
            onClick={onClick}
            type={type}
            $size={size}
            $fill={fill ? fill : undefined}
            theme={theme}
            {...rest}
            ref={ref}
          >
            {isLoading ? <Loading /> : children}
          </ButtonWithThemeProps>
        </Wrapper>
      </>
    );
  }
);
