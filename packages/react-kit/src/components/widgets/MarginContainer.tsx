import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";
import styled, { CSSProperties, css } from "styled-components";

const StyledContainer = styled.div<{
  $margin: CSSProperties["margin"];
  $marginVertical: string;
}>`
  ${({ $margin, $marginVertical }) => css`
    margin: ${$margin};
    max-height: calc(100vh - ${$marginVertical});
    overflow: hidden;
    > * {
      max-height: inherit;
    }
  `}
`;
export type MarginContainerProps = {
  children: ReactNode;
  lookAndFeel: "regular" | "modal";
  modalMargin?: CSSProperties["margin"];
};
export function MarginContainer({
  lookAndFeel,
  modalMargin,
  children
}: MarginContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [marginVertical, setMarginVertical] = useState("");

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { marginTop, marginBottom } = window.getComputedStyle(
        containerRef.current
      );
      setMarginVertical(`(${marginTop} + ${marginBottom})`);
    }
  }, [containerRef, modalMargin]);
  return lookAndFeel === "regular" ? (
    <>{children}</>
  ) : (
    <StyledContainer
      $margin={modalMargin}
      data-margin
      ref={containerRef}
      $marginVertical={marginVertical}
    >
      {children}
    </StyledContainer>
  );
}
