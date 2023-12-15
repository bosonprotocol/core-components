import styled, { CSSProperties, css, keyframes } from "styled-components";
import { lighten } from "polished";

const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const LoadingBubble = styled.div<{
  $height?: CSSProperties["height"];
  $width?: CSSProperties["width"];
  $minWidth?: CSSProperties["minWidth"];
  $borderRadius?: CSSProperties["borderRadius"];
  $backgroundColor?: CSSProperties["backgroundColor"];
  delay?: string;
  margin?: CSSProperties["margin"];
}>`
  border-radius: 12px;
  ${({ $borderRadius }) =>
    $borderRadius != undefined && `border-radius: ${$borderRadius};`};
  ${({ margin }) => margin && `margin: ${margin}`};
  height: ${({ $height }) => $height ?? "24px"};
  width: 50%;
  width: ${({ $width }) => $width ?? "50%"};
  ${({ $minWidth }) => $minWidth && `minWidth: ${$minWidth};`};
  animation: ${loadingAnimation} 1.5s infinite;
  ${({ delay }) => delay && `animation-delay: ${delay};`}
  animation-fill-mode: both;
  background: ${({ $backgroundColor }) =>
    $backgroundColor
      ? css`linear-gradient(
    to left,
    ${$backgroundColor} 25%,
    ${lighten(0.075, `${$backgroundColor}`)} 50%,
    ${$backgroundColor} 75%
  )`
      : css`linear-gradient(
    to left,
    #a9a9ac 25%,
    ${lighten(0.075, "#a9a9ac")} 50%,
    #a9a9ac 75%
  )`};
  will-change: background-position;
  background-size: 400%;
`;