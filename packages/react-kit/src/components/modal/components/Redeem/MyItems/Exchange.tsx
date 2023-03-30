import React from "react";
import { CameraSlash } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import mockedAvatar from "../../../../../assets/frame.png";

import {
  ExchangeCard,
  ExchangeCardStatus
} from "../../../../exchangeCard/ExchangeCard";
import { Currencies } from "../../../../currencyDisplay/CurrencyDisplay";
import { exchanges } from "@bosonprotocol/core-sdk";
import { theme } from "../../../../../theme";
import { useCurrentSellers } from "../../../../../hooks/useCurrentSellers";
import { getLensProfilePictureUrl } from "../../../../../lib/lens/profile";
import { calcPrice } from "../../../../../lib/price/prices";
import { useIpfsContext } from "../../../../ipfs/IpfsContext";
import {
  getFallbackImageUrl,
  getImageUrl,
  getLensImageUrl
} from "../../../../../lib/images/images";
import { useHandleText } from "../../../../../hooks/useHandleText";
import { ExtendedExchange } from "../../../../../hooks/useExchanges";
import { Exchange as IExchange } from "../../../../../types/exchange";

const colors = theme.colors.light;

interface Props {
  offer: ExtendedExchange["offer"];
  exchange: ExtendedExchange;
  onCardClick: (exchange: IExchange) => void;
  onRedeemClick: (exchange: IExchange) => void;
}

const ExchangeCardWrapper = styled.div`
  [data-card="exchange-card"] {
    height: 500px;
    color: ${colors.black};
    [data-image-wrapper] {
      img {
        object-fit: contain;
      }
    }
  }
  [data-avatarname="product-card"] {
    max-width: 100%;
    word-break: break-word;
  }
`;

export default function Exchange({
  offer,
  exchange,
  onRedeemClick,
  onCardClick
}: Props) {
  const { lens: lensProfiles } = useCurrentSellers({
    sellerId: offer?.seller?.id
  });
  const { ipfsGateway } = useIpfsContext();
  const [lens] = lensProfiles;
  const avatar = getLensImageUrl(getLensProfilePictureUrl(lens), ipfsGateway);

  // const { showModal, modalTypes } = useModal();
  // const navigate = useNavigate();
  const offerImageUrl = offer.metadata?.imageUrl || "";
  const imageSrc = getImageUrl(offerImageUrl, ipfsGateway, {
    height: 500
  });
  const { address } = useAccount();
  const isBuyer = exchange?.buyer.wallet === address?.toLowerCase();

  const handleText = useHandleText(offer);

  const status = useMemo(
    () => exchanges.getExchangeState(exchange),
    [exchange]
  );

  const price = useMemo(
    () => calcPrice(offer.price, offer.exchangeToken.decimals),
    [offer.exchangeToken.decimals, offer.price]
  );

  const handleOnCardClick = () => {
    // navigate({
    //   pathname: generatePath(BosonRoutes.Exchange, {
    //     [UrlParameters.exchangeId]: exchange.id
    //   })
    // });
    onCardClick(exchange);
  };

  const handleOnAvatarClick = () => {
    // navigate({
    //   pathname: generatePath(BosonRoutes.SellerPage, {
    //     [UrlParameters.sellerId]: offer.seller.id
    //   })
    // });
    console.log("avatar click");
  };

  // const convertedPrice = useConvertedPrice({
  //   value: offer.price,
  //   decimals: offer.exchangeToken.decimals,
  //   symbol: offer.exchangeToken.symbol
  // });

  // const OFFER_DETAIL_DATA_MODAL = useMemo(
  //   () => getOfferDetailData(offer, convertedPrice, true),
  //   [offer, convertedPrice]
  // );

  // const BASE_MODAL_DATA = useMemo(
  //   () => ({
  //     data: OFFER_DETAIL_DATA_MODAL,
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     exchange: exchange!,
  //     animationUrl: offer.metadata.animationUrl || "",
  //     image: offer.metadata.imageUrl,
  //     name: offer.metadata.name
  //   }),
  //   [
  //     OFFER_DETAIL_DATA_MODAL,
  //     exchange,
  //     offer.metadata.imageUrl,
  //     offer.metadata.name,
  //     offer.metadata.animationUrl
  //   ]
  // );

  const createSpecificCardConfig = () => {
    switch (status) {
      case "REDEEMED": {
        const handleDispute = () => {
          // showModal(modalTypes.RAISE_DISPUTE, {
          //   title: "Raise a problem",
          //   exchangeId: exchange?.id || ""
          // });
          console.log("raise dispute");
        };
        return {
          status: "REDEEMED" as Extract<ExchangeCardStatus, "REDEEMED">,
          isCTAVisible: isBuyer,
          disputeButtonConfig: {
            onClick: handleDispute,
            variant: "secondaryInverted" as const,
            showBorder: false
          }
        };
      }
      case "CANCELLED":
        return {
          status: "CANCELLED" as Extract<ExchangeCardStatus, "CANCELLED">,
          isCTAVisible: isBuyer
        };
      case "COMMITTED": {
        const handleRedeem = () => {
          // showModal(
          //   modalTypes.REDEEM,
          //   {
          //     title: "Redeem your item",
          //     exchangeId: exchange?.id || "",
          //     offerName: offer.metadata.name,
          //     offerId: offer.id,
          //     buyerId: exchange?.buyer.id || "",
          //     sellerId: exchange?.seller.id || "",
          //     sellerAddress: exchange?.seller.assistant || "",
          //     refetch
          //   },
          //   "s"
          // );
          onRedeemClick(exchange);
        };
        const handleCancel = () => {
          if (!exchange) {
            return;
          }
          // showModal(modalTypes.CANCEL_EXCHANGE, {
          //   title: "Cancel exchange",
          //   exchange,
          //   BASE_MODAL_DATA,
          //   refetch
          // });
          console.log("cancel");
        };
        return {
          status: "COMMITTED" as Extract<ExchangeCardStatus, "COMMITTED">,
          isCTAVisible: isBuyer,
          bottomText: handleText,
          redeemButtonConfig: {
            onClick: handleRedeem
          },
          cancelButtonConfig: {
            onClick: handleCancel
          }
        };
      }
      default:
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: status as any
        };
    }
  };

  return (
    <ExchangeCardWrapper>
      <ExchangeCard
        onCardClick={handleOnCardClick}
        dataCard="exchange-card"
        id={offer.id}
        title={offer.metadata.name}
        avatarName={lens?.name ? lens?.name : `Seller ID: ${offer.seller.id}`}
        avatar={avatar || mockedAvatar}
        imageProps={{
          src: imageSrc,
          fallbackSrc: getFallbackImageUrl(imageSrc, ipfsGateway),
          withLoading: true,
          errorConfig: {
            errorIcon: <CameraSlash size={32} color={colors.white} />
          }
        }}
        onAvatarNameClick={handleOnAvatarClick}
        price={Number(price)}
        currency={offer.exchangeToken.symbol as Currencies}
        {...createSpecificCardConfig()}
      />
    </ExchangeCardWrapper>
  );
}
