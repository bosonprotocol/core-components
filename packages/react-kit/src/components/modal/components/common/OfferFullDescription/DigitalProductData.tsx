import uniqBy from "lodash.uniqby";
import React from "react";

import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { isTruthy } from "../../../../../types/helpers";
import { Offer } from "../../../../../types/offer";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { Break } from "../detail/Detail.style";
import DetailTable from "../detail/DetailTable";
import { SlickSlider, initialSettings } from "../detail/SlickSlider";

type DigitalProductDataProps = {
  offer: Offer;
  imagesToShow: number;
};

export const DigitalProductData: React.FC<DigitalProductDataProps> = ({
  offer,
  imagesToShow
}) => {
  const { nftMediaItems, nftItems } = getOfferDetails(offer);
  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Typography tag="h3">Digital product data</Typography>
      <Grid
        flexDirection="column"
        gap="0.5rem"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Typography tag="h4">Traits</Typography>
        <DetailTable
          align={false}
          noBorder
          data={
            uniqBy(
              nftItems
                ?.flatMap((nftItem) => nftItem.attributes)
                .filter(isTruthy),
              (attribute) => `${attribute.traitType}-${attribute.value}`
            ).map((attribute) => {
              return {
                name: attribute.traitType,
                value: <Typography tag="p">{attribute.value}</Typography>
              };
            }) ?? []
          }
          inheritColor={false}
        />
        <Grid
          flexDirection="column"
          gap="0.5rem"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {nftItems?.map((nftItem) => {
            return (
              <Grid
                flexDirection="column"
                gap="0.5rem"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Typography tag="h5">Name: {nftItem.name}</Typography>
                <Typography>Description: {nftItem.description}</Typography>
                <DetailTable
                  align={false}
                  noBorder
                  data={[
                    {
                      name: "How will it be sent to the buyer?",
                      value: (
                        <Typography tag="p">
                          {nftItem.transferMethod}
                        </Typography>
                      )
                    },
                    {
                      name: "When will it be sent to the buyer?",
                      value: (
                        <Typography tag="p">{nftItem.transferDelay}</Typography>
                      )
                    },
                    {
                      name: "Shipping in days",
                      value: <Typography tag="p">-</Typography>
                    }
                  ]}
                  inheritColor={false}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      <Typography tag="h3">Digital product images</Typography>
      <div style={{ width: "100%" }}>
        <SlickSlider
          settings={{ ...initialSettings, slidesToShow: imagesToShow }}
          mediaFiles={nftMediaItems ?? []}
          alignLeft
          imageOptimizationOpts={{ height: 500 }}
        />
      </div>
      <Break />
    </Grid>
  );
};
