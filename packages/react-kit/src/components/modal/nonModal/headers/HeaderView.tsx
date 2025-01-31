import React from "react";
import { Typography } from "../../../ui/Typography";
import { useNonModalContext } from "../NonModal";
import { Grid } from "../../../ui/Grid";
import { ThemedBosonLogo } from "../../components/common/ThemedBosonLogo";

export type HeaderViewProps = {
  text: string | undefined;
  showBosonLogoInHeader: boolean;
};
export const HeaderView = ({
  showBosonLogoInHeader,
  text
}: HeaderViewProps) => {
  const { showConnectButton } = useNonModalContext();

  return (
    <>
      <Typography tag="h3">{text}</Typography>
      <Grid
        gap="1rem"
        style={{ flex: "1 1" }}
        justifyContent={showConnectButton ? "center" : "flex-end"}
      >
        {showBosonLogoInHeader && <ThemedBosonLogo />}
      </Grid>
    </>
  );
};
