import React from "react";
import ReactComponent from "../../../../assets/logo.svg";
import { Grid, GridProps } from "../../../ui/Grid";
import { SvgImage, SvgImageProps } from "../../../ui/SvgImage";

export type BosonLogoProps = {
  className?: string;
  gridProps?: GridProps;
  svgImageProps?: Omit<SvgImageProps, "src">;
};
export function BosonLogo({
  gridProps,
  svgImageProps,
  className
}: BosonLogoProps = {}) {
  return (
    <Grid
      justifyContent="center"
      padding="1.5rem 0"
      {...gridProps}
      className={className}
    >
      <SvgImage
        src={ReactComponent}
        height="24px"
        {...svgImageProps}
        style={{ maxWidth: "100%", ...svgImageProps?.style }}
      />
    </Grid>
  );
}
