import React from "react";
import { useBreakpoints } from "../../../../../hooks/useBreakpoints";
import { theme } from "../../../../../theme";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { CSSProperties } from "styled-components";
const colors = theme.colors.light;
interface Props {
  children?: string | React.ReactNode;
  secondChildren?: React.ReactNode | null;
  style?: CSSProperties;
  typographyStyle?: CSSProperties;
}
export default function DetailTopRightLabel({
  children,
  secondChildren,
  style,
  typographyStyle
}: Props) {
  return (
    <Grid
      flexDirection="column"
      alignItems="flex-end"
      justifyContent="center"
      style={style}
    >
      <Typography
        tag="p"
        style={{ color: colors.orange, margin: 0, ...typographyStyle }}
      >
        {children}
      </Typography>
      {secondChildren}
    </Grid>
  );
}
