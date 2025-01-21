import styled, { CSSProperties, keyframes } from "styled-components";
import React from "react";

export const Loading = ({
  color,
  size = 1.5625, // in rem = 25px
  theme,
  style,
  borderWidthPx = 5
}: {
  color?: CSSProperties["color"];
  size?: number;
  theme?: { colors?: { light?: { accent: CSSProperties["color"] } } };
  style?: CSSProperties;
  borderWidthPx?: number;
}) => {
  return (
    <LoadingStyle
      $color={color}
      $size={size}
      theme={theme}
      style={style}
      $borderWidthPx={borderWidthPx}
    />
  );
};

const loadingAnimation = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;

const LoadingStyle = styled.span.attrs({ className: "loading" })<{
  $color?: CSSProperties["color"];
  $size?: number;
  $borderWidthPx: number;
}>`
  height: ${({ $size }) => $size}rem;
  width: ${({ $size }) => $size}rem;
  min-height: ${({ $size }) => $size}rem;
  min-width: ${({ $size }) => $size}rem;
  border: ${({ $borderWidthPx }) => $borderWidthPx}px solid
    ${({ theme, $color }) =>
      theme?.colors?.light?.accent || $color || "#000000"};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  animation-name: ${loadingAnimation};
`;
