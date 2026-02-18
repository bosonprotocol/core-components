import React from "react";
import styled from "styled-components";
import { Offer } from "../../../../../types/offer";
import { Grid } from "../../../../ui/Grid";
import { GridContainer } from "../../../../ui/GridContainer";
import { Typography } from "../../../../ui/Typography";
import { Break } from "../detail/Detail.style";
import { breakpoint } from "../../../../../lib/ui/breakpoint";

// Styled GridContainer with responsive fixed-width first column
const ResponsiveGridContainer = styled(GridContainer)`
  ${breakpoint.xxs} {
    grid-template-columns: minmax(0, 1fr);
  }
  ${breakpoint.xs} {
    grid-template-columns: 300px minmax(0, 1fr);
  }
`;

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
      <ResponsiveGridContainer
        itemsPerRow={{
          xxs: 1,
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
      </ResponsiveGridContainer>
      <Break />
      <ResponsiveGridContainer
        itemsPerRow={{
          xxs: 1,
          xs: 2,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
        style={{ alignItems: "center", width: "100%" }}
      >
        <Typography tag="h3">Phygital description</Typography>
        <Typography style={{ whiteSpace: "pre-wrap" }}>
          {offer.metadata?.description}
        </Typography>
      </ResponsiveGridContainer>
    </Grid>
  );
};
