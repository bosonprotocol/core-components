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
  CTAOnHoverContainerExchangeCard,
  CommittedButtonWrapper,
  ExchangeButtonWrapper,
  ExchangeCTAWrapper,
  ExchangeCarData,
  ExchangeCardBottom,
  ExchangeCardBottomContent,
  ExchangeCardPriceWrapper,
  ExchangeCardTitle,
  ExchangeCardTitleWrapper,
  ExchangeCardTop,
  ExchangeCardWrapper,
  ExchangeImageWrapper,
  ExchangeStatus,
  RedeemButtonWrapper
} from "./ExchangeCard.styles";
import { ExchangeCardStatus } from "./types";
import { subgraph } from "@bosonprotocol/core-sdk";

import { Grid } from "../ui/Grid";
import { PhygitalLabel } from "../productCard/ProductCard";
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
  const [isHovered, setIsHovered] = useState(false);
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
          const { redeemButtonConfig } = props;
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
              </CommittedButtonWrapper>
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        onCardClick?.(id);
      }}
    >
      <ExchangeCardTop $isNotImageLoaded={isNotImageLoaded}>
        <ExchangeImageWrapper>
          <Image {...imageProps} onLoaded={() => setIsImageLoaded(true)} />
          {isCTAVisible && isConnected && (
            <CTAOnHoverContainerExchangeCard $isHovered={isHovered}>
              {isCTAVisible && isConnected ? (
                <ExchangeCTAWrapper data-cta-wrapper>
                  {exchangeCardBottom}
                </ExchangeCTAWrapper>
              ) : isCTAVisible && !isConnected && CTAIfDisconnected ? (
                CTAIfDisconnected
              ) : null}
            </CTAOnHoverContainerExchangeCard>
          )}
        </ExchangeImageWrapper>
        <ExchangeStatus $status={status}>{status.toLowerCase()}</ExchangeStatus>
      </ExchangeCardTop>
      <div style={{ height: height + "px" }} />
      <ExchangeCardBottom>
        <ExchangeCardBottomContent
          ref={(div) => {
            !!div?.clientHeight &&
              div.clientHeight !== height &&
              setHeight(
                height ? Math.min(div.clientHeight, height) : div.clientHeight
              );
          }}
        >
          <ExchangeCarData>
            <Grid
              flexDirection="column"
              alignItems="flex-start"
              onClick={(e) => {
                e.stopPropagation();
                onAvatarNameClick?.();
              }}
            >
              <ExchangeCardTitleWrapper>
                <ExchangeCardTitle fontSize={"0.75rem"} fontWeight={"600"}>
                  {title}
                </ExchangeCardTitle>
                <ExchangeCardPriceWrapper
                  justifyContent="flex-end"
                  alignItems="center"
                  width="40%"
                >
                  <CurrencyDisplay
                    value={price}
                    currency={currency}
                    fontSize={"0.875rem"}
                    iconSize={16}
                    gap={"0.3125rem"}
                    style={{
                      wordBreak: "break-all",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600"
                    }}
                  />
                </ExchangeCardPriceWrapper>
              </ExchangeCardTitleWrapper>
              {isPhygital && <PhygitalLabel />}
            </Grid>
          </ExchangeCarData>
        </ExchangeCardBottomContent>
      </ExchangeCardBottom>
    </ExchangeCardWrapper>
  );
};
