import React from "react";
import { useBreakpoints } from "../../../../../hooks/useBreakpoints";
import { theme } from "../../../../../theme";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
const colors = theme.colors.light;
interface Props {
  children?: string | React.ReactNode;
}
export default function DetailTopRightLabel({ children }: Props) {
  const { isLteXS } = useBreakpoints();
  return (
    <Grid
      $height="100%"
      alignItems="center"
      justifyContent="flex-end"
      style={{ marginTop: isLteXS ? "-7rem" : "0" }}
    >
      <Typography tag="p" style={{ color: colors.orange, margin: 0 }}>
        {children}
      </Typography>
    </Grid>
  );
}
