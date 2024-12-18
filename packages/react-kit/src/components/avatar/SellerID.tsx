import React from "react";
import { Image as AccountImage } from "@davatar/react";
import styled, { css } from "styled-components";
import { Grid, GridProps } from "../../components/ui/Grid";
import { theme } from "../../theme";
import { subgraph } from "@bosonprotocol/core-sdk";
import { Offer } from "../../types/offer";
import { MediaSet } from "../../lib/lens/generated";
import { getLensImageUrl } from "../../lib/images/images";
import { getLensProfilePictureUrl } from "../../lib/lens/profile";
import { getOfferDetails } from "../../lib/offer/getOfferDetails";
import { useIpfsContext } from "../ipfs/IpfsContext";
import { useAccount } from "../../hooks/connection/connection";
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
          color: ${colors.violet};
          font-family: "Plus Jakarta Sans";
        `
      : css`
          color: var(--accent);
        `};

  font-style: normal;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 18px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .avatar {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    padding: 0;
  }
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
  } & GridProps &
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
  // TODO: remove/change once we migrate to lens v2
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lens = {} as any;
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
              <img
                src={getLensImageUrl(
                  getLensProfilePictureUrl(lens) ||
                    ((artist?.images?.[0]?.url || "") as string),
                  ipfsGateway
                )}
                alt="avatar"
                className="avatar"
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
