import React from "react";
import { Image as AccountImage } from "@davatar/react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAccount } from "wagmi";

import Grid, { IGrid } from "../../components/ui/Grid";
import { theme } from "../../theme";
import { subgraph } from "@bosonprotocol/core-sdk";
import { Offer } from "../../types/offer";
import { useCurrentSellers } from "../../hooks/useCurrentSellers";
import { MediaSet } from "../../lib/lens/generated";
import { Image } from "../image/Image";
import { getLensImageUrl } from "../../lib/images/images";
import { getLensProfilePictureUrl } from "../../lib/lens/profile";
import { getOfferDetails } from "../../lib/offer/getOfferDetails";
import { useIpfsContext } from "../ipfs/IpfsContext";
const colors = theme.colors.light;
const AddressContainer = styled(Grid)`
  gap: 10px;
  margin: 0;
`;

const SellerContainer = styled.div<{ $hasCursorPointer: boolean }>`
  ${({ $hasCursorPointer }) => $hasCursorPointer && `cursor: pointer;`}

  display: flex;
  align-items: center;
  gap: 10px;
`;

const SellerInfo = styled.div<{ $withBosonStyles?: boolean }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

  ${({ $withBosonStyles }) =>
    $withBosonStyles
      ? css`
          color: ${colors.secondary};
          font-family: "Plus Jakarta Sans";
        `
      : css`
          color: var(--accent);
        `};

  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Buyer = Pick<subgraph.Buyer, "id" | "wallet">;
type Seller = Pick<subgraph.Seller, "id" | "assistant">;

const SellerID: React.FC<
  {
    children?: React.ReactNode;
    offer: Offer;
    buyerOrSeller: Buyer | Seller;
    accountImageSize?: number;
    withProfileImage: boolean;
    withProfileText?: boolean;
    withBosonStyles?: boolean;
    onClick?: null | undefined | React.MouseEventHandler<HTMLDivElement>;
  } & IGrid &
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">
> = ({
  children,
  offer,
  buyerOrSeller,
  withProfileImage,
  onClick,
  accountImageSize,
  withProfileText = true,
  withBosonStyles = false,
  ...rest
}) => {
  const { ipfsGateway } = useIpfsContext();
  const { address } = useAccount();
  const { lens: lensProfiles } = useCurrentSellers({
    sellerId: offer?.seller?.id
  });
  const [lens] = lensProfiles;
  const { artist } = getOfferDetails(offer);

  const userId = buyerOrSeller?.id;
  const isSeller = buyerOrSeller ? "assistant" in buyerOrSeller : false;
  const userAddress = buyerOrSeller
    ? isSeller
      ? (buyerOrSeller as Seller).assistant
      : (buyerOrSeller as Buyer).wallet
    : address;
  const hasCursorPointer = !!onClick;

  return (
    <AddressContainer {...rest} data-address-container>
      <SellerContainer
        $hasCursorPointer={hasCursorPointer}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          }
        }}
        data-seller-container
      >
        {withProfileImage && userId && (
          <ImageContainer>
            {(lens?.picture as MediaSet) ||
            (artist?.images && artist?.images.length > 0) ? (
              <Image
                src={getLensImageUrl(
                  getLensProfilePictureUrl(lens) ||
                    ((artist?.images?.[0]?.url || "") as string),
                  ipfsGateway
                )}
                style={{
                  height: "1rem",
                  width: "1rem",
                  borderRadius: "50%",
                  padding: 0
                }}
              />
            ) : (
              <AccountImage
                size={accountImageSize || 17}
                address={userAddress}
              />
            )}
          </ImageContainer>
        )}
        {withProfileText && userId && (
          <SellerInfo
            data-testid="seller-info"
            $withBosonStyles={withBosonStyles}
          >
            {isSeller
              ? lens?.name
                ? lens?.name
                : `Seller ID: ${userId}`
              : `Buyer ID: ${userId}`}
          </SellerInfo>
        )}
      </SellerContainer>
      {children || ""}
    </AddressContainer>
  );
};

export default SellerID;
