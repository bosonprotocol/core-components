import React from "react";
import { BosonLogo, BosonLogoProps } from "./BosonLogo";
import styled from "styled-components";
import { getCssVar } from "../../../../theme";

const StyledBosonLogo = styled(BosonLogo)`
  path {
    fill: ${getCssVar("--sub-text-color")};
  }
`;

export const defaultThemedBosonLogoProps = {
  svgImageProps: { width: undefined },
  gridProps: { width: "auto", padding: 0 }
} satisfies BosonLogoProps;

export function ThemedBosonLogo(props: BosonLogoProps = {}) {
  const {
    svgImageProps = defaultThemedBosonLogoProps.svgImageProps,
    gridProps = defaultThemedBosonLogoProps.gridProps
  } = props;
  return (
    <StyledBosonLogo
      {...props}
      svgImageProps={svgImageProps}
      gridProps={gridProps}
    />
  );
}
