import React, { HTMLAttributes, forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";
import { getTransientCustomProps } from "./getTransientCustomProps";

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
  ${({ $display }) => ($display ? `display:${$display};` : "")}
  ${({ $alignItems }) => $alignItems && `align-items: ${$alignItems}`};
  ${({ $flexBasis }) => $flexBasis && `flex-basis: ${$flexBasis}`};
  ${({ $flexDirection }) =>
    $flexDirection && `flex-direction: ${$flexDirection}`};
  ${({ $flexGrow }) => $flexGrow && `flex-grow: ${$flexGrow}`};
  ${({ $flexShrink }) => $flexShrink && `flex-shrink: ${$flexShrink}`};
  ${({ $justifyContent }) =>
    $justifyContent && `justify-content: ${$justifyContent}`};
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


  ${({ $fontSize }) => ($fontSize ? `font-size:${$fontSize};` : "")}
  ${({ $fontWeight }) => ($fontWeight ? `font-weight:${$fontWeight};` : "")}
  ${({ $lineHeight }) => ($lineHeight ? `line-height:${$lineHeight};` : "")}
  ${({ $color }) => ($color ? `color:${$color};` : "")}
  ${({ $background }) => ($background ? `background:${$background};` : "")}
  ${({ $cursor }) => ($cursor ? `cursor:${$cursor};` : "")}
  ${({ $letterSpacing }) =>
    $letterSpacing ? `letter-spacing:${$letterSpacing};` : ""}
    ${({ $textAlign }) => ($textAlign ? `text-align:${$textAlign};` : "")}
    ${({ $opacity }) => ($opacity ? `opacity:${$opacity};` : "")}
    ${({ $width }) => ($width ? `width:${$width};` : "")}
`;

export type TypographyProps = WrapperProps &
  HTMLAttributes<unknown> & {
    children?: string | React.ReactNode;
    tag?: keyof JSX.IntrinsicElements;
    style?: React.CSSProperties;
    onClick?: () => void;
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
