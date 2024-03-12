import React from "react";
import { Offer } from "../../../../../types/offer";
import { Grid } from "../../../../ui/Grid";
import { GridContainer } from "../../../../ui/GridContainer";
import { Typography } from "../../../../ui/Typography";
import { Break } from "../detail/Detail.style";

type OverviewProps = {
  offer: Offer;
};

export const Overview: React.FC<OverviewProps> = ({ offer }) => {
  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <GridContainer
        itemsPerRow={{
          xs: 2,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
        style={{ alignItems: "center", width: "100%" }}
      >
        <Typography tag="h3">Phygital name</Typography>
        <Typography>{offer.metadata?.name}</Typography>
      </GridContainer>
      <Break />
      <GridContainer
        itemsPerRow={{
          xs: 2,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
        style={{ alignItems: "center", width: "100%" }}
      >
        <Typography tag="h3">Phygital description</Typography>
        <Typography>{offer.metadata?.description}</Typography>
      </GridContainer>
    </Grid>
  );
};
