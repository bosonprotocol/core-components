import React, { ElementRef, useRef } from "react";
import { DetailViewCore, DetailViewProps } from "./common/DetailViewCore";
import Grid from "../../../../ui/Grid";

export type DetailViewWithPortalProps = DetailViewProps;
export function InnerDetailViewWithPortal(props: DetailViewProps) {
  const portalRef = useRef<ElementRef<"div">>(null);

  return (
    <Grid flexDirection="column">
      <div
        ref={portalRef}
        style={{ width: "100%", height: "3rem", position: "relative" }}
      />
      <DetailViewCore {...props} ref={portalRef}>
        {props.children}
      </DetailViewCore>
    </Grid>
  );
}
