import React from "react";

import styled from "styled-components";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { Offer } from "../../../../../types/offer";
import { DetailsSummary } from "../../../../ui/DetailsSummary";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import DetailTable from "../detail/DetailTable";
import { SlickSlider, initialSettings } from "../detail/SlickSlider";
import {
  buyerTransferInfoMapping,
  digitalNftTypeMapping,
  digitalTypeMappingDisplay,
  ercTokenMapping
} from "../../../../../lib/bundle/const";
import { useBundleItemsImages } from "../../../../../hooks/bundles/useBundleItemsImages";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { isNftItem } from "../../../../../lib/bundle/filter";
import { isTruthy } from "../../../../../types/helpers";
import Video from "../../../../ui/Video";
import IpfsImage from "../../../../ui/IpfsImage";

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
  .loading-container {
    padding-top: 100%;
  }
`;
type DigitalProductDataProps = {
  offer: Offer;
  imagesToShow: number;
};

export const DigitalProductData: React.FC<DigitalProductDataProps> = ({
  offer,
  imagesToShow
}) => {
  const { bundleItems } = getOfferDetails(offer);
  const { images } = useBundleItemsImages({
    bundleItems,
    coreSDK: useCoreSDKWithContext()
  });

  return (
    <Grid
      flexDirection="column"
      gap="0.5rem"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Typography tag="h3">Digital product data</Typography>
      {bundleItems
        ?.map((bundleItem, index) => {
          if (!isNftItem(bundleItem)) {
            return null;
          }
          const nftItem = bundleItem;
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
          const imageSrc = images?.[index];
          const videoSrc = bundleItem.animationUrl;
          const icon = videoSrc ? (
            <MediaWrapper>
              <Video src={videoSrc} />
            </MediaWrapper>
          ) : imageSrc ? (
            <MediaWrapper>
              <IpfsImage
                src={imageSrc}
                overrides={{ ipfsGateway: "https://ipfs.io/ipfs" }}
              />
            </MediaWrapper>
          ) : (
            <MediaWrapper></MediaWrapper>
          );
          return (
            <StyledDetailsSummary
              key={nftItem.id}
              icon={icon ? <MediaWrapper>{icon}</MediaWrapper> : null}
              summaryText={nftItem.name || nftItem.contract || ""}
              initiallyOpen={index === 0}
            >
              <DetailTable
                align={false}
                textAlign="right"
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
                            <Typography tag="p">
                              {nftItem.description}
                            </Typography>
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
                          name:
                            nftItem.tokenIdRange?.min ===
                            nftItem.tokenIdRange?.max
                              ? "Token ID"
                              : "Token IDs",
                          value:
                            nftItem.tokenIdRange?.min ===
                            nftItem.tokenIdRange?.max ? (
                              <Typography tag="p">
                                {nftItem.tokenIdRange?.min}
                              </Typography>
                            ) : (
                              <Typography tag="p">
                                {nftItem.tokenIdRange?.min}-
                                {nftItem.tokenIdRange?.max}
                              </Typography>
                            )
                        }
                      ]
                    : []),
                  ...(nftItem.terms || []).map((term) => ({
                    name: term.displayKey || term.key,
                    value: (
                      <Typography tag="p">
                        {buyerTransferInfoMapping[
                          term.value as keyof typeof buyerTransferInfoMapping
                        ]
                          ? buyerTransferInfoMapping[
                              term.value as keyof typeof buyerTransferInfoMapping
                            ]
                          : ercTokenMapping[
                                term.value as keyof typeof ercTokenMapping
                              ]
                            ? ercTokenMapping[
                                term.value as keyof typeof ercTokenMapping
                              ]
                            : term.value}
                      </Typography>
                    )
                  }))
                ]}
                inheritColor={false}
              />
              {!!nftMedia.length && (
                <div style={{ width: "100%", padding: "0 2rem 1.5rem 2rem" }}>
                  <SlickSlider
                    settings={{
                      ...initialSettings,
                      slidesToShow: imagesToShow
                    }}
                    mediaFiles={nftMedia}
                    alignLeft
                    imageOptimizationOpts={{ height: 500 }}
                  />
                </div>
              )}
            </StyledDetailsSummary>
          );
        })
        .filter(isTruthy)}
    </Grid>
  );
};
