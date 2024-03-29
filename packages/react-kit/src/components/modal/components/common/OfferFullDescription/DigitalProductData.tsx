import React from "react";

import styled from "styled-components";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { Offer } from "../../../../../types/offer";
import { NftItemIcon } from "../../../../nftItem/NftItemIcon";
import { DetailsSummary } from "../../../../ui/DetailsSummary";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import DetailTable from "../detail/DetailTable";
import { SlickSlider, initialSettings } from "../detail/SlickSlider";
import {
  digitalNftTypeMapping,
  digitalTypeMappingDisplay
} from "../../../../../lib/bundle/const";

const StyledDetailsSummary = styled(DetailsSummary)`
  .icon-wrapper {
    padding: 0;
    width: 3.125rem;
    height: 3.125rem;
    border-radius: 999px;
    overflow: hidden;
  }
`;
const MediaWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
type DigitalProductDataProps = {
  offer: Offer;
  imagesToShow: number;
};

export const DigitalProductData: React.FC<DigitalProductDataProps> = ({
  offer,
  imagesToShow
}) => {
  const { nftItems } = getOfferDetails(offer);
  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Typography tag="h3">Digital product data</Typography>
      {nftItems?.map((nftItem, index) => {
        const nftMedia = [
          ...(nftItem.image
            ? [{ url: nftItem.image, type: "image" } as const]
            : []),
          ...(nftItem.animationUrl
            ? [
                {
                  url: nftItem.animationUrl,
                  type: "video"
                } as const
              ]
            : [])
        ];
        const icon = <NftItemIcon nftItem={nftItem} />;
        return (
          <StyledDetailsSummary
            key={nftItem.id}
            icon={icon ? <MediaWrapper>{icon}</MediaWrapper> : null}
            summaryText={nftItem.name || nftItem.contract || ""}
            initiallyOpen={index === 0}
          >
            <DetailTable
              align={false}
              noBorder
              data={[
                ...(nftItem.contract
                  ? [
                      {
                        name: "Contract address",
                        value: (
                          <Typography tag="p">{nftItem.contract}</Typography>
                        )
                      }
                    ]
                  : []),
                ...(nftItem.description
                  ? [
                      {
                        name: "Description",
                        value: (
                          <Typography tag="p">{nftItem.description}</Typography>
                        )
                      }
                    ]
                  : []),
                ...(nftItem.attributes || []).map((attribute) => ({
                  name: attribute.displayType || attribute.traitType,
                  value: (
                    <Typography tag="p">
                      {digitalTypeMappingDisplay[
                        attribute.value as keyof typeof digitalTypeMappingDisplay
                      ]
                        ? digitalTypeMappingDisplay[
                            attribute.value as keyof typeof digitalTypeMappingDisplay
                          ]
                        : digitalNftTypeMapping[
                            attribute.value as keyof typeof digitalNftTypeMapping
                          ]
                        ? digitalNftTypeMapping[
                            attribute.value as keyof typeof digitalNftTypeMapping
                          ]
                        : attribute.value}
                    </Typography>
                  )
                })),
                ...(nftItem.tokenIdRange?.min && nftItem.tokenIdRange.max
                  ? [
                      {
                        name: "Token IDs",
                        value: (
                          <Typography tag="p">
                            {nftItem.tokenIdRange?.max}-
                            {nftItem.tokenIdRange?.max}
                          </Typography>
                        )
                      }
                    ]
                  : []),
                ...(nftItem.terms || []).map((term) => ({
                  name: term.displayKey || term.key,
                  value: <Typography tag="p">{term.value}</Typography>
                }))
              ]}
              inheritColor={false}
            />
            {!!nftMedia.length && (
              <div style={{ width: "100%", padding: "0 2rem 1.5rem 2rem" }}>
                <SlickSlider
                  settings={{ ...initialSettings, slidesToShow: imagesToShow }}
                  mediaFiles={nftMedia}
                  alignLeft
                  imageOptimizationOpts={{ height: 500 }}
                />
              </div>
            )}
          </StyledDetailsSummary>
        );
      })}
    </Grid>
  );
};
