import "tippy.js/animations/shift-toward.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";

import Tippy from "@tippyjs/react";
import { IconWeight, Question } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { theme } from "../../theme";

export interface TooltipProps {
  content: string | JSX.Element | React.ReactNode;
  children?: React.ReactNode;
  interactive?: boolean;
  size?: number;
  weight?: IconWeight;
  wrap?: boolean;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "auto"
    | "auto-start"
    | "auto-end";
  trigger?:
    | "mouseenter focus"
    | "mouseenter click"
    | "click"
    | "focusin"
    | "manual";
}

const Button = styled.button`
  all: unset;
  display: flex;
  color: ${theme.colors.light.darkGrey};
  background-color: transparent;
  margin: 0 0.5rem;
  :hover {
    color: ${theme.colors.light.black};
  }
`;

export const Tooltip = ({
  content,
  children,
  placement = "bottom",
  interactive = false,
  size = 18,
  weight = "regular",
  trigger = "mouseenter focus",
  wrap = true,
  ...rest
}: TooltipProps) => {
  return (
    <Tippy
      content={content}
      placement={placement}
      theme="light-border"
      duration={300}
      animation="shift-toward"
      interactive={interactive}
      trigger={trigger}
      {...rest}
    >
      {wrap ? (
        <Button type="button" theme={theme}>
          {children ? children : <Question size={size} weight={weight} />}
        </Button>
      ) : (
        <button type="button" style={{ all: "unset" }}>
          {children ? children : <Question size={size} weight={weight} />}
        </button>
      )}
    </Tippy>
  );
};
