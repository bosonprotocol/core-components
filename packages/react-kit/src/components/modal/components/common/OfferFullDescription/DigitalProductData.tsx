import React from "react";
import styled from "styled-components";
import { useIsPhygital } from "../../../../../hooks/offer/useIsPhygital";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { theme } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { useConfigContext } from "../../../../config/ConfigContext";
import Price from "../../../../price/Price";
import { Grid } from "../../../../ui/Grid";
import { GridContainer } from "../../../../ui/GridContainer";
import { Typography } from "../../../../ui/Typography";
import { useNotCommittableOfferStatus } from "../../Commit/useNotCommittableOfferStatus";
import { Break } from "../detail/Detail.style";
import DetailTable from "../detail/DetailTable";
import { useDetailViewContext } from "../detail/DetailViewProvider";
import { TokenGatedItem } from "../detail/TokenGatedItem";
import { OnClickBuyOrSwapHandler } from "../detail/types";
import {
  UseGetOfferDetailDataProps,
  useGetOfferDetailData
} from "../detail/useGetOfferDetailData";
import { Exchange } from "../../../../../types/exchange";
import { SlickSlider, initialSettings } from "../detail/SlickSlider";
const colors = theme.colors.light;
type DigitalProductDataProps = {
  offer: Offer;
  imagesToShow: number;
};

export const DigitalProductData: React.FC<DigitalProductDataProps> = ({
  offer,
  imagesToShow
}) => {
  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Typography tag="h3">Physical product images</Typography>

      {/* <SlickSlider
        settings={{ ...initialSettings, slidesToShow: imagesToShow }}
        mediaFiles={mediaFiles}
        alignLeft
        imageOptimizationOpts={{ height: 500 }}
      /> */}
      <Break />
    </Grid>
  );
};
