import React, { MouseEventHandler, forwardRef } from "react";
import { Button } from "./Button";
import Logo from "../../assets/logo.svg";
import styled, { CSSProperties, css } from "styled-components";
import { IButton } from "../ui/ThemedButton";
import { SvgImage } from "../ui/SvgImage";
import { Grid } from "../ui/Grid";

const Wrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
    fill: ${({ $color }) => ($color === "black" ? "white" : "black")};
  }
  &:hover:not(:disabled) * {
    fill: ${({ $color }) => ($color === "black" ? "black" : "white")};
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
} & (
  | { onTaglineClick: MouseEventHandler<HTMLDivElement>; tagline: true }
  | { onTaglineClick?: undefined; tagline?: false }
);

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
      tagline = true,
      onTaglineClick,
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
          withBosonStyle
          $color={color}
          $shape={shape}
        >
          <Grid
            flexDirection={layout === "horizontal" ? "row" : "column"}
            gap="1rem"
          >
            Buy Physical NFT with
            <SvgImage
              src={Logo}
              width={`${logoWidthPx}px`}
              height={`${(logoWidthPx * 218) / 947}px`}
            />
          </Grid>
        </StyledButton>
        {tagline && (
          <div
            role="button"
            onClick={onTaglineClick}
            style={{ cursor: "pointer" }}
          >
            What is a physical NFT?
          </div>
        )}
      </Wrapper>
    );
  }
);
