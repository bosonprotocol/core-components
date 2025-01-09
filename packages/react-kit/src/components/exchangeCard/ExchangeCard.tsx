import React, { ReactElement, useMemo, useState } from "react";
import { Button } from "../buttons/Button";
import {
  Currencies,
  CurrencyDisplay
} from "../currencyDisplay/CurrencyDisplay";
import { IBaseImage, Image } from "../image/Image";

import { ProductType } from "../productCard/const";
import { IButton } from "../ui/ThemedButton";
import {
  CommittedBottomText,
  CommittedButtonWrapper,
  ExchangeButtonWrapper,
  ExchangeCTAWrapper,
  ExchangeCarData,
  ExchangeCardBottom,
  ExchangeCardBottomContent,
  ExchangeCardLabelWrapper,
  ExchangeCardPrice,
  ExchangeCardPriceWrapper,
  ExchangeCardTop,
  ExchangeCardWrapper,
  ExchangeCreator,
  ExchangeCreatorAvatar,
  ExchangeCreatorName,
  ExchangeImageWrapper,
  ExchangeStatus,
  ExchangeTitle,
  RedeemButtonWrapper
} from "./ExchangeCard.styles";
import { ExchangeCardStatus } from "./types";
import { subgraph } from "@bosonprotocol/core-sdk";
export type { ExchangeCardStatus } from "./types";
interface Base {
  id: string;
  title: string;
  price: string;
  currency: Currencies;
  avatar: string;
  avatarName: JSX.Element | string;
  onCardClick?: (id: string | number) => void;
  onAvatarNameClick?: () => void;
  imageProps: IBaseImage;
  isCTAVisible?: boolean;
  dataTestId?: string;
  isHoverDisabled?: boolean;
  dataCard?: string;
  productType?: ProductType;
  isConnected: boolean | undefined;
  CTAIfDisconnected?: ReactElement;
  status: ExchangeCardStatus;
}

interface RedeemCard extends Base {
  status: subgraph.ExchangeState.REDEEMED;
  disputeButtonConfig: IButton;
}

interface CancelledCard extends Base {
  status: subgraph.ExchangeState.CANCELLED;
}

interface CommittedCard extends Base {
  status: subgraph.ExchangeState.COMMITTED;
  redeemButtonConfig: IButton;
  cancelButtonConfig: IButton;
  bottomText?: string;
}

interface CompletedCard extends Base {
  status: subgraph.ExchangeState.COMPLETED;
}

interface DisputedCard extends Base {
  status: subgraph.ExchangeState.DISPUTED;
}

interface RevokedCard extends Base {
  status: subgraph.ExchangeState.REVOKED;
}

export type ExchangeCardProps =
  | CommittedCard
  | RedeemCard
  | CancelledCard
  | CompletedCard
  | DisputedCard
  | RevokedCard;

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
    status,
    isCTAVisible = true,
    onAvatarNameClick,
    dataTestId = "offer",
    isHoverDisabled = false,
    dataCard = "exchange-card",
    productType,
    isConnected,
    CTAIfDisconnected
  } = props;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const exchangeCardBottom = useMemo(() => {
    if (isCTAVisible) {
      switch (status) {
        case subgraph.ExchangeState.REDEEMED: {
          const { disputeButtonConfig } = props;
          return (
            <ExchangeButtonWrapper>
              <RedeemButtonWrapper>
                <Button
                  variant="secondaryInverted"
                  {...disputeButtonConfig}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    e.stopPropagation();
                    disputeButtonConfig?.onClick?.(e);
                  }}
                >
                  Dispute
                </Button>
              </RedeemButtonWrapper>
            </ExchangeButtonWrapper>
          );
        }
        case subgraph.ExchangeState.COMMITTED: {
          const { redeemButtonConfig, cancelButtonConfig, bottomText } = props;
          return (
            <ExchangeButtonWrapper>
              <CommittedButtonWrapper>
                <Button
                  variant="primaryFill"
                  {...redeemButtonConfig}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    e.stopPropagation();
                    redeemButtonConfig?.onClick?.(e);
                  }}
                >
                  Redeem
                </Button>
                <Button
                  variant="secondaryInverted"
                  {...cancelButtonConfig}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    e.stopPropagation();
                    cancelButtonConfig?.onClick?.(e);
                  }}
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
    }
  }, [isCTAVisible, props, status]);

  const [height, setHeight] = useState<number | null>(null);
  const isNotImageLoaded = !isImageLoaded;
  const isPhygital = productType === ProductType.phygital;
  return (
    <ExchangeCardWrapper
      data-card={dataCard}
      $isHoverDisabled={isHoverDisabled}
      data-testid={dataTestId}
      onClick={(e) => {
        e.preventDefault();
        onCardClick?.(id);
      }}
    >
      <ExchangeCardTop $isNotImageLoaded={isNotImageLoaded}>
        <ExchangeImageWrapper>
          {isPhygital && (
            <ExchangeCardLabelWrapper>Phygital</ExchangeCardLabelWrapper>
          )}
          <Image {...imageProps} onLoaded={() => setIsImageLoaded(true)} />
        </ExchangeImageWrapper>
        <ExchangeStatus $status={status}>{status.toLowerCase()}</ExchangeStatus>
      </ExchangeCardTop>
      <div style={{ height: height + "px" }} />
      <ExchangeCardBottom>
        <ExchangeCardBottomContent
          ref={(div) => {
            !!div?.clientHeight && !height && setHeight(div.clientHeight);
          }}
        >
          <ExchangeCarData>
            <ExchangeCreator
              onClick={(e) => {
                e.stopPropagation();
                onAvatarNameClick?.();
              }}
            >
              <ExchangeCreatorAvatar>
                <img src={avatar} alt="avatar" />
              </ExchangeCreatorAvatar>
              <ExchangeCreatorName data-avatarname="exchange-card">
                {avatarName}
              </ExchangeCreatorName>
            </ExchangeCreator>
            <ExchangeTitle>{title}</ExchangeTitle>
          </ExchangeCarData>
          <ExchangeCardPriceWrapper>
            <ExchangeCardPrice>Price</ExchangeCardPrice>
            <CurrencyDisplay
              value={price}
              currency={currency}
              style={{
                wordBreak: "break-all",
                alignItems: "flex-start",
                justifyContent: "flex-end"
              }}
            />
          </ExchangeCardPriceWrapper>
        </ExchangeCardBottomContent>
        {isCTAVisible && isConnected ? (
          <ExchangeCTAWrapper data-cta-wrapper>
            {exchangeCardBottom}
          </ExchangeCTAWrapper>
        ) : isCTAVisible && !isConnected && CTAIfDisconnected ? (
          CTAIfDisconnected
        ) : null}
      </ExchangeCardBottom>
    </ExchangeCardWrapper>
  );
};
