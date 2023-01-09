import React, { useMemo, useState } from "react";
import { Button, ButtonProps } from "../buttons/Button";
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
  ExchangeCardBottomContent,
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
  ExchangeImageWrapper,
  ExchangeCTAWrapper
} from "./ExchangeCard.styles";

export type ExchangeCardStatus = "REDEEMED" | "CANCELLED" | "COMMITTED";

interface Base {
  id: string;
  title: string;
  price: number;
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
}

interface RedeemCard extends Base {
  status: Extract<ExchangeCardStatus, "REDEEMED">;
  disputeButtonConfig: ButtonProps;
}

interface CancelledCard extends Base {
  status: Extract<ExchangeCardStatus, "CANCELLED">;
}

interface CommittedCard extends Base {
  status: Extract<ExchangeCardStatus, "COMMITTED">;
  redeemButtonConfig: ButtonProps;
  cancelButtonConfig: ButtonProps;
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
    status,
    isCTAVisible = true,
    onAvatarNameClick,
    dataTestId = "offer",
    isHoverDisabled = false,
    dataCard = "exchange-card"
  } = props;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const exchangeCardBottom = useMemo(() => {
    if (isCTAVisible) {
      switch (status) {
        case "REDEEMED": {
          const { disputeButtonConfig } = props;
          return (
            <ExchangeButtonWrapper>
              <RedeemButtonWrapper>
                <Button
                  variant="secondaryInverted"
                  showBorder={false}
                  {...disputeButtonConfig}
                  onClick={(e) => {
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
        case "COMMITTED": {
          const { redeemButtonConfig, cancelButtonConfig, bottomText } = props;
          return (
            <ExchangeButtonWrapper>
              <CommittedButtonWrapper>
                <Button
                  variant="primaryFill"
                  {...redeemButtonConfig}
                  onClick={(e) => {
                    e.stopPropagation();
                    redeemButtonConfig?.onClick?.(e);
                  }}
                >
                  Redeem
                </Button>
                <Button
                  variant="secondaryInverted"
                  showBorder={false}
                  {...cancelButtonConfig}
                  onClick={(e) => {
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
        {isCTAVisible && (
          <ExchangeCTAWrapper data-cta-wrapper>
            {exchangeCardBottom}
          </ExchangeCTAWrapper>
        )}
      </ExchangeCardBottom>
    </ExchangeCardWrapper>
  );
};
