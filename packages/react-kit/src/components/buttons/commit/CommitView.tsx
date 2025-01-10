import React from "react";
import Logo from "../../../assets/logo.svg";
import { SvgImage } from "../../ui/SvgImage";
import { Grid } from "../../ui/Grid";

export type CommitViewProps = {
  layout: "vertical" | "horizontal";
};

const logoWidthPx = 100;
export const CommitView = ({ layout = "horizontal" }: CommitViewProps) => {
  return (
    <Grid
      flexDirection={layout === "horizontal" ? "row" : "column"}
      gap="0.375rem"
      justifyContent="center"
    >
      Buy with
      <SvgImage
        src={Logo}
        width={`${logoWidthPx}px`}
        height={`${(logoWidthPx * 218) / 947}px`}
      />
    </Grid>
  );
};
