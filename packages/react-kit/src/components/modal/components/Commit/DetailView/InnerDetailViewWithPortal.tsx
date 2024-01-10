import React, { ElementRef, useRef } from "react";
import { DetailViewCore, DetailViewProps } from "./common/DetailViewCore";
import Grid from "../../../../ui/Grid";
import styled, { css } from "styled-components";

const BosonExclusive = styled.div<{
  $hasVariations: boolean;
  $isBosonExclusive: boolean;
}>`
  width: 100%;
  position: relative;
  height: 1rem;
  &:has(*) {
    height: 2rem;
  }
  ${({ $hasVariations, $isBosonExclusive }) =>
    $hasVariations &&
    $isBosonExclusive &&
    css`
      && {
        height: 3rem;
      }
    `}

  ${({ $hasVariations, $isBosonExclusive }) =>
    !$hasVariations &&
    !$isBosonExclusive &&
    css`
      && {
        height: 0;
      }
    `}
`;

export type DetailViewWithPortalProps = DetailViewProps;
export function InnerDetailViewWithPortal(props: DetailViewProps) {
  const portalRef = useRef<ElementRef<"div">>(null);
  const hasVariations = !!props.selectedVariant.variations?.length;
  const isBosonExclusive = true;

  return (
    <Grid flexDirection="column">
      <BosonExclusive
        ref={portalRef}
        $hasVariations={hasVariations}
        $isBosonExclusive={isBosonExclusive}
      />
      <DetailViewCore
        {...props}
        ref={portalRef}
        isBosonExclusive={isBosonExclusive}
      >
        {props.children}
      </DetailViewCore>
    </Grid>
  );
}
