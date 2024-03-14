import React from "react";
import ReactComponent from "../../../../assets/logo.svg";
import { Grid } from "../../../ui/Grid";

export function BosonFooter() {
  return (
    <Grid justifyContent="center" padding="1.5rem 0">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore  */}
      <ReactComponent height="24px" />
    </Grid>
  );
}
