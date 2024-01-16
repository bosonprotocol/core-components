import React, { ElementRef, useRef } from "react";
import styled, { css } from "styled-components";
import Grid from "../../../../ui/Grid";
import { DetailViewCore } from "./DetailViewCore";
import { DetailViewProps } from "./types";

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

export type InnerDetailViewWithPortalProps = DetailViewProps;
export function InnerDetailViewWithPortal(props: DetailViewProps) {
  const portalRef = useRef<ElementRef<"div">>(null);
  const { selectedVariant } = props;
  const hasVariations = !!selectedVariant.variations?.length;
  const isBosonExclusive = true; // TODO: change
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
