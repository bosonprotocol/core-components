import React, { useMemo } from "react";
import { Button } from "../buttons/Button";
import { CancelButton, ICancelButton } from "../cta/exchange/CancelButton";
import { IRedeemButton, RedeemButton } from "../cta/exchange/RedeemButton";
import {
  CurrencyDisplay,
  Currencies
} from "../currencyDisplay/CurrencyDisplay";
import { IBaseImage, Image } from "../image/Image";

import {
  CommittedButtonWrapper,
  CommittedBottomText,
  ExchangeCarData,
  ExchangeCardBottom,
  ExchangeCardPrice,
  ExchangeCardPriceWrapper,
  ExchangeCardTop,
  ExchangeCardWrapper,
  ExchangeCreator,
  ExchangeCreatorAvatar,
  ExchangeCreatorName,
  ExchangeTitle,
  RedeemButtonWrapper,
  ExchangeStatus,
  ExchangeButtonWrapper,
  ExchangeImageWrapper
} from "./ExchangeCard.styles";

export type ExchangeCardStatus = "REDEEMED" | "CANCELLED" | "COMMITTED";

interface Base {
  id: string;
  title: string;
  price: number;
  currency: Currencies;
  avatar: string;
  avatarName: string;
  onCardClick?: (id: string | number) => void;
  imageProps: IBaseImage;
}

interface RedeemCard extends Base {
  status: Extract<ExchangeCardStatus, "REDEEMED">;
  disputeButtonConfig?: unknown; // TODO: disputeButton has not been implemented yet
  redeemConfig?: {
    // TODO: need to be replaced by disputeButtonConfig
    onDisputeClick: () => unknown;
    isDisputeLoading?: boolean;
    isDisputeDisabled?: boolean;
  };
}

interface CancelledCard extends Base {
  status: Extract<ExchangeCardStatus, "CANCELLED">;
}

interface CommittedCard extends Base {
  status: Extract<ExchangeCardStatus, "COMMITTED">;
  redeemButtonConfig: IRedeemButton;
  cancelButtonConfig: ICancelButton;
  bottomText?: string;
}

type ExchangeCardProps = CommittedCard | RedeemCard | CancelledCard;

export const ExchangeCard = (props: ExchangeCardProps) => {
  const {
    id,
    title,
    imageProps,
    price,
    currency,
    avatar,
    avatarName,
    onCardClick,
    status
  } = props;
  const exchangeCardBottom = useMemo(() => {
    switch (status) {
      case "REDEEMED": {
        const {
          redeemConfig: {
            onDisputeClick,
            isDisputeLoading,
            isDisputeDisabled
          } = {}
        } = props;
        return (
          <ExchangeButtonWrapper>
            <RedeemButtonWrapper>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDisputeClick?.();
                }}
                variant="ghostOrange"
                disabled={!!isDisputeDisabled}
                loading={!!isDisputeLoading}
              >
                Dispute
              </Button>
            </RedeemButtonWrapper>
          </ExchangeButtonWrapper>
        );
      }
      case "COMMITTED": {
        const { redeemButtonConfig, cancelButtonConfig, bottomText } = props;
        return (
          <ExchangeButtonWrapper>
            <CommittedButtonWrapper>
              <RedeemButton {...redeemButtonConfig} />
              <CancelButton {...cancelButtonConfig} />
            </CommittedButtonWrapper>
            <CommittedBottomText>{bottomText}</CommittedBottomText>
          </ExchangeButtonWrapper>
        );
      }

      default:
        return null;
    }
  }, [props, status]);

  return (
    <ExchangeCardWrapper
      onClick={(e) => {
        e.preventDefault();
        onCardClick?.(id);
      }}
    >
      <ExchangeCardTop $status={status}>
        <ExchangeImageWrapper>
          <Image {...imageProps} />
        </ExchangeImageWrapper>
        <ExchangeStatus $status={status}>{status.toLowerCase()}</ExchangeStatus>
      </ExchangeCardTop>
      <ExchangeCardBottom>
        <ExchangeCarData>
          <ExchangeCreator>
            <ExchangeCreatorAvatar>
              <img src={avatar} alt="avatar" />
            </ExchangeCreatorAvatar>
            <ExchangeCreatorName>{avatarName}</ExchangeCreatorName>
          </ExchangeCreator>
          <ExchangeTitle>{title}</ExchangeTitle>
        </ExchangeCarData>
        <ExchangeCardPriceWrapper>
          <ExchangeCardPrice>Price</ExchangeCardPrice>
          <CurrencyDisplay value={price} currency={currency} />
        </ExchangeCardPriceWrapper>
      </ExchangeCardBottom>
      {exchangeCardBottom}
    </ExchangeCardWrapper>
  );
};
