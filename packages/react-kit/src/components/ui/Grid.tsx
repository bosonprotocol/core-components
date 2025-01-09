import React, { ElementRef, HTMLAttributes, forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";
import { getTransientCustomProps } from "./getTransientCustomProps";
import { isDefined } from "./common";
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
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingLeft: true,
  width: true,
  height: true,
  maxWidth: true,
  minWidth: true,
  maxHeight: true,
  minHeight: true
} as const;
type IGrid = Pick<CSSProperties, keyof typeof pickedProps>;

type InnerGridProps = Record<`$${keyof IGrid}`, IGrid[keyof IGrid]>;

const Container = styled.div<InnerGridProps>`
  ${({ $width }) => (isDefined($width) ? `width:${$width};` : "width: 100%;")}
  ${({ $maxWidth }) => (isDefined($maxWidth) ? `max-width:${$maxWidth}` : "")};
  ${({ $minWidth }) => (isDefined($minWidth) ? `min-width:${$minWidth}` : "")};
  ${({ $maxHeight }) =>
    isDefined($maxHeight) ? `max-height:${$maxHeight}` : ""};
  ${({ $minHeight }) =>
    isDefined($minHeight) ? `min-height:${$minHeight}` : ""};
  height: ${({ $height }) => (isDefined($height) ? $height : "initial")};
  display: flex;
  align-items: ${({ $alignItems }) =>
    isDefined($alignItems) ? $alignItems : "center"};
  flex-basis: ${({ $flexBasis }) =>
    isDefined($flexBasis) ? $flexBasis : "auto"};
  flex-direction: ${({ $flexDirection }) =>
    isDefined($flexDirection) ? $flexDirection : "row"};
  flex-grow: ${({ $flexGrow }) =>
    isDefined($flexGrow) ? $flexGrow : "initial"};
  flex-shrink: ${({ $flexShrink }) =>
    isDefined($flexShrink) ? $flexShrink : "initial"};
  justify-content: ${({ $justifyContent }) =>
    isDefined($justifyContent) ? $justifyContent : "space-between"};

  ${({ $flexWrap }) => (isDefined($flexWrap) ? `flex-wrap:${$flexWrap};` : "")}
  ${({ $rowGap }) => (isDefined($rowGap) ? `row-gap:${$rowGap};` : "")}
  ${({ $columnGap }) =>
    isDefined($columnGap) ? `column-gap:${$columnGap};` : ""}
  ${({ $gap }) => (isDefined($gap) ? `gap:${$gap};` : "")}
  ${({ $flex }) => (isDefined($flex) ? `> * { flex: ${$flex}; }` : "")}
  ${({ $padding }) => (isDefined($padding) ? `padding:${$padding};` : "")}
  ${({ $margin }) => (isDefined($margin) ? `margin:${$margin};` : "")}
  ${({ $marginTop }) =>
    isDefined($marginTop) ? `margin-top:${$marginTop};` : ""}
  ${({ $marginRight }) =>
    isDefined($marginRight) ? `margin-right:${$marginRight};` : ""}
  ${({ $marginBottom }) =>
    isDefined($marginBottom) ? `margin-bottom:${$marginBottom};` : ""}
  ${({ $marginLeft }) =>
    isDefined($marginLeft) ? `margin-left:${$marginLeft};` : ""}
  ${({ $paddingTop }) =>
    isDefined($paddingTop) ? `padding-top:${$paddingTop};` : ""}
  ${({ $paddingRight }) =>
    isDefined($paddingRight) ? `padding-right:${$paddingRight};` : ""}
  ${({ $paddingBottom }) =>
    isDefined($paddingBottom) ? `padding-bottom:${$paddingBottom};` : ""}
  ${({ $paddingLeft }) =>
    isDefined($paddingLeft) ? `padding-left:${$paddingLeft};` : ""}
  ${({ $alignSelf }) =>
    isDefined($alignSelf) ? `align-self:${$alignSelf};` : ""}
  ${({ $justifySelf }) =>
    isDefined($justifySelf) ? `justify-self:${$justifySelf};` : ""}
`;
export type GridProps = {
  children?: React.ReactNode;
  as?: React.ElementType;
  style?: CSSProperties | undefined;
  onClick?: ElementRef<"div">["onclick"];
} & IGrid &
  HTMLAttributes<unknown>;

export const Grid = forwardRef<HTMLDivElement, GridProps>(
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
