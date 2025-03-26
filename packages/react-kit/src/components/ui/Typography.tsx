import React, { HTMLAttributes, forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";
import { getTransientCustomProps } from "./getTransientCustomProps";
import { isDefined } from "./common";

const pickedProps = {
  alignItems: true,
  flexBasis: true,
  flexDirection: true,
  flexGrow: true,
  flexShrink: true,
  justifyContent: true,
  flexWrap: true,
  rowGap: true,
  columnGap: true,
  gap: true,
  flex: true,
  padding: true,
  margin: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  fontSize: true,
  fontWeight: true,
  lineHeight: true,
  color: true,
  background: true,
  cursor: true,
  letterSpacing: true,
  textAlign: true,
  opacity: true,
  width: true,
  display: true
} as const;
type WrapperProps = Pick<CSSProperties, keyof typeof pickedProps>;

type InnerTypographyProps = Record<
  `$${keyof WrapperProps}`,
  WrapperProps[keyof WrapperProps]
>;
const Wrapper = styled.div<InnerTypographyProps>`
  display: flex;
  ${({ $display }) => (isDefined($display) ? `display:${$display};` : "")}
  ${({ $alignItems }) =>
    isDefined($alignItems) && `align-items: ${$alignItems}`};
  ${({ $flexBasis }) => isDefined($flexBasis) && `flex-basis: ${$flexBasis}`};
  ${({ $flexDirection }) =>
    isDefined($flexDirection) && `flex-direction: ${$flexDirection}`};
  ${({ $flexGrow }) => isDefined($flexGrow) && `flex-grow: ${$flexGrow}`};
  ${({ $flexShrink }) =>
    isDefined($flexShrink) && `flex-shrink: ${$flexShrink}`};
  ${({ $justifyContent }) =>
    isDefined($justifyContent) && `justify-content: ${$justifyContent}`};
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


  ${({ $fontSize }) => (isDefined($fontSize) ? `font-size:${$fontSize};` : "")}
  ${({ $fontWeight }) =>
    isDefined($fontWeight) ? `font-weight:${$fontWeight};` : ""}
  ${({ $lineHeight }) =>
    isDefined($lineHeight) ? `line-height:${$lineHeight};` : ""}
  ${({ $color }) => (isDefined($color) ? `color:${$color};` : "")}
  ${({ $background }) =>
    isDefined($background) ? `background:${$background};` : ""}
  ${({ $cursor }) => (isDefined($cursor) ? `cursor:${$cursor};` : "")}
  ${({ $letterSpacing }) =>
    isDefined($letterSpacing) ? `letter-spacing:${$letterSpacing};` : ""}
    ${({ $textAlign }) =>
    isDefined($textAlign) ? `text-align:${$textAlign};` : ""}
    ${({ $opacity }) => (isDefined($opacity) ? `opacity:${$opacity};` : "")}
    ${({ $width }) => (isDefined($width) ? `width:${$width};` : "")}
`;

export type TypographyProps = WrapperProps &
  HTMLAttributes<unknown> & {
    children?: string | React.ReactNode;
    tag?: keyof JSX.IntrinsicElements;
    style?: React.CSSProperties;
    className?: string;
  };

export const Typography = forwardRef<HTMLDivElement, TypographyProps>(
  (
    { tag = "div", children, style = {}, className, onClick, ...props },
    ref
  ) => {
    const { transientProps, otherProps } = getTransientCustomProps<
      InnerTypographyProps,
      WrapperProps
    >(props, pickedProps);
    return (
      <Wrapper
        style={style}
        className={className}
        {...transientProps}
        {...otherProps}
        onClick={onClick}
        as={tag}
        ref={ref}
      >
        {children}
      </Wrapper>
    );
  }
);
