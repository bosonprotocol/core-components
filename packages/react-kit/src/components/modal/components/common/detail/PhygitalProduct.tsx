import { ArrowSquareUpRight } from "phosphor-react";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { useBundleItemsImages } from "../../../../../hooks/bundles/useBundleItemsImages";
import { useErc1155Name } from "../../../../../hooks/contracts/erc1155/useErc1155Name";
import { useErc721Name } from "../../../../../hooks/contracts/erc721/useErc721Name";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { formatAddress } from "../../../../../lib/address/address";
import { isNftItem, isProductV1Item } from "../../../../../lib/bundle/filter";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { theme } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { Tooltip } from "../../../../tooltip/Tooltip";
import { Grid } from "../../../../ui/Grid";
import IpfsImage from "../../../../ui/IpfsImage";
import ThemedButton from "../../../../ui/ThemedButton";
import { Typography } from "../../../../ui/Typography";
import Video from "../../../../ui/Video";
import { digitalTypeMappingDisplay } from "../../../../../lib/bundle/const";
const colors = theme.colors.light;
const imageSize = "2.5rem";

const MediaWrapper = styled.div`
  border-radius: 9999px;
  background-color: #f1f3f9;
  height: ${imageSize};
  min-width: ${imageSize};
  overflow: hidden;
  .loading-container {
    padding-top: 100%;
  }
`;
const Pill = styled.div`
  border: 3px solid ${({ theme }) => theme?.colors?.light.accent};
  background: white;
  white-space: nowrap;
  min-width: 9ch;
  box-sizing: content-box;
  text-align: center;
`;
const ActionText = ({ children }: { children: ReactNode }) => {
  return <span style={{ fontSize: "0.75rem" }}>{children}</span>;
};
type PhygitalProductProps = {
  offer: Offer;
};

export const PhygitalProduct: React.FC<PhygitalProductProps> = ({ offer }) => {
  const coreSDK = useCoreSDKWithContext();

  const { bundleItems } = getOfferDetails(offer);
  const contracts = bundleItems?.map((bundleItem) =>
    isNftItem(bundleItem) ? bundleItem.contract : null
  );
  const { data: erc721Names } = useErc721Name(
    {
      contractAddresses: contracts
    },
    { enabled: !!contracts?.length, coreSDK }
  );
  const { data: erc1155Names } = useErc1155Name(
    {
      contractAddresses: contracts
    },
    { enabled: !!contracts?.length, coreSDK }
  );
  const { images } = useBundleItemsImages({ bundleItems, coreSDK });
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1rem">
      <Typography>
        This is what you'll get when you purchase this product.
      </Typography>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography>
          <b>This product includes:</b>
        </Typography>
        <Grid as="ul" flexDirection="column" gap="1rem" padding="0">
          {bundleItems?.map((bundleItem, index) => {
            let quantity = 1;
            let name: string | ReactNode;
            let contract: string | undefined | null;
            let imageSrc: string | undefined | null;
            let videoSrc: string | undefined | null;
            let rangeText: JSX.Element | undefined | null;
            let pill: ReactNode | undefined | null;
            if (isProductV1Item(bundleItem)) {
              quantity = 1;
              name = bundleItem.product.title;
              imageSrc =
                bundleItem.productOverrides?.visuals_images?.[0]?.url ||
                bundleItem.product.visuals_images?.[0]?.url;
              videoSrc =
                bundleItem.productOverrides?.visuals_videos?.[0]?.url ||
                bundleItem.product.visuals_videos?.[0]?.url;
              pill = <Pill>Physical</Pill>;
            } else if (isNftItem(bundleItem)) {
              quantity = bundleItem.quantity || 1;
              name =
                bundleItem.name ||
                erc721Names?.[index] ||
                erc1155Names?.[index] ||
                "Untitled";
              contract = bundleItem.contract;
              if (name === contract && typeof name === "string" && contract) {
                name = (
                  <Tooltip
                    content={contract}
                    maxWidth="none"
                    interactive
                    hideOnClick={false}
                    wrap={false}
                  >
                    <span style={{ wordBreak: "keep-all" }}>
                      {formatAddress(contract)}
                    </span>
                  </Tooltip>
                );
              }
              imageSrc = images?.[index];
              videoSrc = bundleItem.animationUrl;
              rangeText =
                bundleItem.tokenIdRange?.min ||
                bundleItem.tokenIdRange?.max ||
                bundleItem.tokenId ? (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "18px",
                      wordBreak: "break-all"
                    }}
                  >
                    {bundleItem.tokenIdRange?.min ===
                      bundleItem.tokenIdRange?.max ||
                    (!bundleItem.tokenIdRange && bundleItem.tokenId)
                      ? `ID: ${
                          bundleItem.tokenIdRange?.min || bundleItem.tokenId
                        }`
                      : `IDs: ${bundleItem.tokenIdRange?.min}-${bundleItem.tokenIdRange?.max}`}
                  </span>
                ) : null;
              const type = bundleItem.attributes?.find(
                (attribute) => attribute.traitType === "type"
              );
              pill =
                type &&
                digitalTypeMappingDisplay[
                  type.value as keyof typeof digitalTypeMappingDisplay
                ] ? (
                  <Pill>
                    {
                      digitalTypeMappingDisplay[
                        type.value as keyof typeof digitalTypeMappingDisplay
                      ]
                    }
                  </Pill>
                ) : null;
            } else {
              name = "Unknown";
            }

            return (
              <Grid
                flexGrow={0}
                flexShrink={0}
                gap="1rem"
                justifyContent="flex-start"
                flex={0}
                as="li"
                key={bundleItem.metadataUri}
                style={{
                  color: colors.darkGrey
                }}
              >
                {videoSrc ? (
                  <MediaWrapper>
                    <Video src={videoSrc} data-video-src={videoSrc} />
                  </MediaWrapper>
                ) : imageSrc ? (
                  <MediaWrapper>
                    <IpfsImage
                      src={imageSrc}
                      overrides={{ ipfsGateway: "https://ipfs.io/ipfs" }}
                      data-image-src={imageSrc}
                    />
                  </MediaWrapper>
                ) : (
                  <MediaWrapper></MediaWrapper>
                )}
                {pill}
                <div>{quantity}x</div>
                <Grid
                  flexDirection="column"
                  alignItems="flex-start"
                  style={{ wordBreak: "break-all" }}
                >
                  {name} {rangeText}
                </Grid>
                {contract && (
                  <a
                    href={coreSDK.getTxExplorerUrl?.(contract, true)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ flex: 0 }}
                  >
                    <ThemedButton size="regular" themeVal="blankSecondary">
                      <ActionText>Contract</ActionText>{" "}
                      <ArrowSquareUpRight size="16" />
                    </ThemedButton>
                  </a>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
