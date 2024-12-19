import React, { forwardRef } from "react";
import { Button } from "./Button";
import Logo from "../../assets/logo.svg";
import styled, { CSSProperties, css } from "styled-components";
import { IButton } from "../ui/ThemedButton";
import { SvgImage } from "../ui/SvgImage";
import { Grid } from "../ui/Grid";
const StyledButton = styled(Button)<{
  $color: CommitButtonViewProps["color"];
  $shape: CommitButtonViewProps["shape"];
}>`
  ${({ $shape }) => {
    if ($shape === "pill") {
      return css`
        border-radius: 9999px;
      `;
    }
    if ($shape === "rounded") {
      return css`
        border-radius: 4px;
      `;
    }
    return "";
  }}
  svg * {
    fill: black;
  }
  &:not(:disabled) svg * {
    fill: ${({ $color }) => ($color === "black" ? "white" : "black")};
  }
  &:hover:not(:disabled) * {
    fill: ${({ $color }) => ($color === "black" ? "black" : "white")};
  }
`;

const Wrapper = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${StyledButton} {
    transition: background 150ms ease-in-out;
    padding: 0.75rem 0.625rem;
    svg {
      max-width: 100%;
    }
  }
`;

export type CommitButtonViewProps = {
  disabled?: boolean;
  layout?: "vertical" | "horizontal";
  onClick: IButton["onClick"];
  minWidth?: CSSProperties["minWidth"];
  minHeight?: CSSProperties["minHeight"];
  color?: "green" | "black" | "white";
  shape?: "sharp" | "rounded" | "pill";
};

const colorToVariant = {
  green: "bosonPrimary",
  black: "black",
  white: "white"
} as const;
const logoWidthPx = 100;
export const CommitButtonView = forwardRef<
  HTMLDivElement,
  CommitButtonViewProps
>(
  (
    {
      disabled,
      onClick,
      minWidth,
      minHeight,
      layout = "horizontal",
      color = "green",
      shape = "sharp"
    },
    ref
  ) => {
    return (
      <Wrapper ref={ref}>
        <StyledButton
          disabled={disabled}
          onClick={onClick}
          style={{
            minWidth,
            minHeight
          }}
          themeVal={colorToVariant[color] || "primary"}
          variant={null}
          $color={color}
          $shape={shape}
        >
          <Grid
            flexDirection={layout === "horizontal" ? "row" : "column"}
            gap="0.375rem"
          >
            Buy with
            <SvgImage
              src={Logo}
              width={`${logoWidthPx}px`}
              height={`${(logoWidthPx * 218) / 947}px`}
            />
          </Grid>
        </StyledButton>
      </Wrapper>
    );
  }
);
