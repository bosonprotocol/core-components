import React from "react";
import ReactComponent from "../../../../assets/logo.svg";
import { Grid } from "../../../ui/Grid";
import { SvgImage } from "../../../ui/SvgImage";

export function BosonFooter() {
  return (
    <Grid justifyContent="center" padding="1.5rem 0">
      <SvgImage src={ReactComponent} height="24px" />
    </Grid>
  );
}
