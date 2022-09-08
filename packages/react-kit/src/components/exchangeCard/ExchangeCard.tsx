import React, { useMemo } from "react";
import { Button } from "../buttons/Button";
import {
  CurrencyDisplay,
  Currencies
} from "../currencyDisplay/CurrencyDisplay";

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
  ExchangeButtonWrapper
} from "./ExchangeCard.styles";

export type ExchangeCardStatus = "REDEEMED" | "CANCELLED" | "COMMITTED";

interface Base {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: Currencies;
  avatar: string;
  avatarName: string;
  onCardClick?: (id: string | number) => void;
}

interface RedeemCard extends Base {
  status: Extract<ExchangeCardStatus, "REDEEMED">;
  redeemConfig: {
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
  committedConfig: {
    onRedeemClick: () => unknown;
    isRedeemLoading?: boolean;
    isRedeemDisabled?: boolean;
    onCancelClick: () => unknown;
    isCancelLoading?: boolean;
    isCancelDisabled?: boolean;
    bottomText?: JSX.Element | string;
  };
}

type ExchangeCardProps = CommittedCard | RedeemCard | CancelledCard;

export const ExchangeCard = (props: ExchangeCardProps) => {
  const {
    id,
    title,
    image,
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
        const {
          committedConfig: {
            onRedeemClick,
            isRedeemLoading,
            isRedeemDisabled,
            onCancelClick,
            isCancelLoading,
            isCancelDisabled,
            bottomText
          } = {}
        } = props;
        return (
          <ExchangeButtonWrapper>
            <CommittedButtonWrapper>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRedeemClick?.();
                }}
                variant="primary"
                disabled={!!isRedeemLoading}
                loading={!!isRedeemDisabled}
              >
                Redeem
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelClick?.();
                }}
                variant="ghostOrange"
                disabled={!!isCancelLoading}
                loading={!!isCancelDisabled}
              >
                Cancel
              </Button>
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
        <img alt={title} src={image} decoding="async" />
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
