import styled, { CSSProperties } from "styled-components";
import React from "react";
const CrossIcon = (props: Record<string, unknown>) => (
  <svg
    height="20"
    width="20"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
  </svg>
);
export type ClearButtonTheme = {
  fill: CSSProperties["fill"];
  stroke: CSSProperties["stroke"];
  hover: {
    fill: CSSProperties["fill"];
    stroke: CSSProperties["stroke"];
  };
};
export const ClearButton = styled(CrossIcon)`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  margin: 0 5px;
  cursor: pointer;
  display: inline-block;
  fill: ${(props) => props.theme?.fill || "#cccccc"};
  line-height: 1;
  stroke: ${(props) => props.theme?.stroke || "#cccccc"};
  stroke-width: 0;
  &:hover * {
    stroke: ${(props) => props.theme?.hover?.stroke || "#999999"};
    fill: ${(props) => props.theme?.hover?.fill || "#999999"};
  }
`;
