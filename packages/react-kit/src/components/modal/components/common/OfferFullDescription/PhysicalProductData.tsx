import React, { useMemo } from "react";
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
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { isTruthy } from "../../../../../types/helpers";
const colors = theme.colors.light;
type PhysicalProductDataProps = {
  offer: Offer;
  imagesToShow: number;
};

export const PhysicalProductData: React.FC<PhysicalProductDataProps> = ({
  offer,
  imagesToShow
}) => {
  const { description, animationUrl, images, offerImg } =
    getOfferDetails(offer);
  const allImages = useMemo(() => {
    return Array.from(new Set([offerImg || "", ...(images || [])])).filter(
      isTruthy
    );
  }, [offerImg, images]);
  const mediaFiles = useMemo(() => {
    const imgs = [...allImages.map((img) => ({ url: img, type: "image" }))];
    return (
      animationUrl
        ? [
            { url: animationUrl, type: "video" },
            ...allImages.map((img) => ({ url: img, type: "image" }))
          ]
        : imgs
    ) as { url: string; type: "image" | "video" }[];
  }, [allImages, animationUrl]);
  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Typography tag="h3">Physical product data</Typography>
      <Typography
        tag="p"
        data-testid="description"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {description}
      </Typography>
      <Typography tag="h3">Physical product images</Typography>
      <div style={{ width: "100%" }}>
        <SlickSlider
          settings={{ ...initialSettings, slidesToShow: imagesToShow }}
          mediaFiles={mediaFiles}
          alignLeft
          imageOptimizationOpts={{ height: 500 }}
        />
      </div>
    </Grid>
  );
};
