import React, { forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";

export type IGrid = Pick<
  CSSProperties,
  | "alignItems"
  | "flexBasis"
  | "flexDirection"
  | "justifyContent"
  | "flexGrow"
  | "flexShrink"
  | "flexWrap"
  | "gap"
  | "flex"
  | "padding"
  | "margin"
  | "rowGap"
  | "columnGap"
  | "alignSelf"
  | "justifySelf"
  | "marginTop"
  | "marginRight"
  | "marginBottom"
  | "marginLeft"
> & {
  $width?: CSSProperties["width"];
  $height?: CSSProperties["height"];
};

const Container = styled.div<IGrid>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "initial"};
  display: flex;
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-basis: ${({ flexBasis }) => flexBasis || "auto"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  flex-grow: ${({ flexGrow }) => flexGrow || "initial"};
  flex-shrink: ${({ flexShrink }) => flexShrink || "initial"};
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};

  ${({ flexWrap }) => (flexWrap ? `flex-wrap:${flexWrap};` : "")}
  ${({ rowGap }) => (rowGap ? `row-gap:${rowGap};` : "")}
  ${({ columnGap }) => (columnGap ? `column-gap:${columnGap};` : "")}
  ${({ gap }) => (gap ? `gap:${gap};` : "")}
  ${({ flex }) => (flex ? `> * { flex: ${flex}; }` : "")}
  ${({ padding }) => (padding ? `padding:${padding};` : "")}
  ${({ margin }) => (margin ? `margin:${margin};` : "")}
  ${({ marginTop }) => (marginTop ? `margin-top:${marginTop};` : "")}
  ${({ marginRight }) => (marginRight ? `margin-right:${marginRight};` : "")}
  ${({ marginBottom }) =>
    marginBottom ? `margin-bottom:${marginBottom};` : ""}
  ${({ marginLeft }) => (marginLeft ? `margin-left:${marginLeft};` : "")}
  ${({ alignSelf }) => (alignSelf ? `align-self:${alignSelf};` : "")}
  ${({ justifySelf }) => (justifySelf ? `justify-self:${justifySelf};` : "")}
`;
type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  src?: string;
} & IGrid &
  React.HTMLAttributes<HTMLDivElement>;

const Grid = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, ref) => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // TODO: check
      <Container {...props} ref={ref}>
        {children}
      </Container>
    );
  }
);

export default Grid;
