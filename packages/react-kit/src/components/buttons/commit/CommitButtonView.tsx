import React, { forwardRef } from "react";
import { Button } from "../Button";
import styled, { css } from "styled-components";
import { CommitView } from "./CommitView";
import { CommitButtonViewProps } from "./types";
import { colorToVariant } from "./const";
import { buttonBorderRadius } from "../../../borders";
import { useBosonTheme } from "../../widgets/BosonThemeProvider";
const StyledButton = styled(Button)<{
  $color: CommitButtonViewProps["color"];
  $shape: CommitButtonViewProps["shape"];
}>`
  ${({ $shape }) => {
    if ($shape === "pill") {
      return css`
        border-radius: ${buttonBorderRadius["high"]};
      `;
    }
    if ($shape === "rounded") {
      return css`
        border-radius: ${buttonBorderRadius["mid"]};
      `;
    }
    return css`
      border-radius: ${buttonBorderRadius["min"]};
    `;
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
    const { themeKey } = useBosonTheme();
    console.log("CommitButtonView", { themeKey });
    return (
      <Wrapper ref={ref} data-test="commit-button-view">
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
          <CommitView layout={layout} />
        </StyledButton>
      </Wrapper>
    );
  }
);
