import React, { ElementRef, HTMLAttributes, forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";
import { getTransientCustomProps } from "./getTransientCustomProps";
const pickedProps = {
  alignItems: true,
  flexBasis: true,
  flexDirection: true,
  justifyContent: true,
  flexGrow: true,
  flexShrink: true,
  flexWrap: true,
  gap: true,
  flex: true,
  padding: true,
  margin: true,
  rowGap: true,
  columnGap: true,
  alignSelf: true,
  justifySelf: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  width: true,
  height: true
} as const;
export type IGrid = Pick<CSSProperties, keyof typeof pickedProps>;

type InnerGridProps = Record<`$${keyof IGrid}`, IGrid[keyof IGrid]>;

const Container = styled.div<InnerGridProps>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "initial"};
  display: flex;
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  flex-basis: ${({ $flexBasis }) => $flexBasis || "auto"};
  flex-direction: ${({ $flexDirection }) => $flexDirection || "row"};
  flex-grow: ${({ $flexGrow }) => $flexGrow || "initial"};
  flex-shrink: ${({ $flexShrink }) => $flexShrink || "initial"};
  justify-content: ${({ $justifyContent }) =>
    $justifyContent || "space-between"};

  ${({ $flexWrap }) => ($flexWrap ? `flex-wrap:${$flexWrap};` : "")}
  ${({ $rowGap }) => ($rowGap ? `row-gap:${$rowGap};` : "")}
  ${({ $columnGap }) => ($columnGap ? `column-gap:${$columnGap};` : "")}
  ${({ $gap }) => ($gap ? `gap:${$gap};` : "")}
  ${({ $flex }) => ($flex ? `> * { flex: ${$flex}; }` : "")}
  ${({ $padding }) => ($padding ? `padding:${$padding};` : "")}
  ${({ $margin }) => ($margin ? `margin:${$margin};` : "")}
  ${({ $marginTop }) => ($marginTop ? `margin-top:${$marginTop};` : "")}
  ${({ $marginRight }) => ($marginRight ? `margin-right:${$marginRight};` : "")}
  ${({ $marginBottom }) =>
    $marginBottom ? `margin-bottom:${$marginBottom};` : ""}
  ${({ $marginLeft }) => ($marginLeft ? `margin-left:${$marginLeft};` : "")}
  ${({ $alignSelf }) => ($alignSelf ? `align-self:${$alignSelf};` : "")}
  ${({ $justifySelf }) => ($justifySelf ? `justify-self:${$justifySelf};` : "")}
`;
type Props = {
  children?: React.ReactNode;
  as?: React.ElementType;
  style?: CSSProperties | undefined;
  onClick?: ElementRef<"div">["onclick"];
} & IGrid &
  HTMLAttributes<unknown>;

export const Grid = forwardRef<HTMLDivElement, Props>(
  ({ children, as, style, ...props }, ref) => {
    const { transientProps, otherProps } = getTransientCustomProps<
      InnerGridProps,
      IGrid
    >(props, pickedProps);
    return (
      <Container
        {...transientProps}
        {...otherProps}
        ref={ref}
        as={as}
        style={style}
      >
        {children}
      </Container>
    );
  }
);
