import { House } from "phosphor-react";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { useSellers } from "../../../../../hooks/useSellers";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { VariantV1 } from "../../../../../types/variants";
import Grid from "../../../../ui/Grid";
import Loading from "../../../../ui/loading/Loading";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import DetailOpenSea from "./detail/DetailOpenSea";
import DetailView from "./DetailView/DetailView";
import VariationSelects from "./VariationSelects";
import DetailSlider from "./detail/DetailSlider";
import { isTruthy } from "../../../../../types/helpers";
import GridContainer from "../../../../ui/GridContainer";
import { BosonFooter } from "../BosonFooter";
import { theme } from "../../../../../theme";
import { SellerAndDescription } from "./detail/SellerAndDescription";

const colors = theme.colors.light;

const ImageWrapper = styled.div`
  position: relative;
  max-width: 35rem !important;
  min-width: 50%;
  width: -webkit-fill-available;
`;

export type ExchangeViewProps = {
  onHouseClick: () => void;
  onNextClick: () => void;
  onCancelExchange: () => void;
  onExchangePolicyClick: () => void;
  onPurchaseOverview: () => void;
  onViewFullDescription: () => void;
  onExpireVoucherClick: () => void;
  onRaiseDisputeClick: () => void;
  exchangeId: string;
  isValid: boolean;
};

const SLIDER_OPTIONS = {
  type: "carousel" as const,
  startAt: 0,
  gap: 20,
  perView: 1
};

export function ExchangeView({
  onHouseClick,
  onNextClick,
  onCancelExchange,
  onExchangePolicyClick,
  onPurchaseOverview,
  onViewFullDescription,
  onExpireVoucherClick,
  onRaiseDisputeClick,
  exchangeId
}: ExchangeViewProps) {
  const {
    data: exchanges,
    isError,
    isLoading
  } = useExchanges(
    {
      id: exchangeId
    },
    {
      enabled: !!exchangeId
    }
  );
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;
  const metadata = offer?.metadata;
  const variations = metadata?.variations;
  const hasVariations = !!variations?.length;
  const { showModal } = useModal();
  useEffect(() => {
    if (!offer) {
      return;
    }
    showModal("REDEEM", {
      headerComponent: (
        <Grid gap="1rem">
          <House
            onClick={onHouseClick}
            size={32}
            style={{ cursor: "pointer", flexShrink: 0 }}
          />
          <Typography tag="h3" style={{ flex: "1 1" }}>
            {offer.metadata.name}
          </Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />,
      contentStyle: {
        background: colors.lightGrey
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer]);

  const variant = {
    offer,
    variations
  };
  const { data: sellers } = useSellers(
    {
      id: offer?.seller.id,
      includeFunds: true
    },
    {
      enabled: !!offer?.seller.id
    }
  );

  const sellerAvailableDeposit = sellers?.[0]?.funds?.find(
    (fund) => fund.token.address === offer?.exchangeToken.address
  )?.availableAmount;
  const offerRequiredDeposit = Number(offer?.sellerDeposit || 0);
  const hasSellerEnoughFunds =
    offerRequiredDeposit > 0
      ? Number(sellerAvailableDeposit) >= offerRequiredDeposit
      : true;
  const { offerImg, animationUrl, images } = offer
    ? getOfferDetails(offer)
    : ({} as ReturnType<typeof getOfferDetails>);
  const allImages = useMemo(() => {
    return Array.from(new Set([offerImg || "", ...(images || [])])).filter(
      isTruthy
    );
  }, [offerImg, images]);
  if (isLoading) {
    return <Loading />;
  }
  if (!offer) {
    return <div data-testid="notFound">This exchange does not exist</div>;
  }
  if (isError || !exchangeId) {
    return (
      <div data-testid="errorExchange">
        There has been an error, please try again later...
      </div>
    );
  }

  return (
    <GridContainer
      itemsPerRow={{
        xs: 1,
        s: 2,
        m: 2,
        l: 2,
        xl: 2
      }}
    >
      <Grid flexDirection="column" alignItems="center">
        <ImageWrapper>
          <DetailOpenSea exchange={exchange} />

          <>
            {(allImages.length > 0 || animationUrl) && (
              <DetailSlider
                animationUrl={animationUrl}
                images={allImages}
                sliderOptions={SLIDER_OPTIONS}
              />
            )}
          </>

          <SellerAndDescription
            exchange={exchange}
            onViewFullDescription={onViewFullDescription}
          />
        </ImageWrapper>
      </Grid>
      <Grid flexDirection="column" gap="1rem" justifyContent="flex-start">
        {hasVariations && (
          <div style={{ width: "100%" }}>
            <VariationSelects
              selectedVariant={variant as VariantV1}
              variants={[variant] as VariantV1[]}
              disabled
            />
          </div>
        )}
        <DetailView
          hasSellerEnoughFunds={hasSellerEnoughFunds}
          offer={offer}
          exchange={exchange}
          onCancelExchange={onCancelExchange}
          onExchangePolicyClick={onExchangePolicyClick}
          onRedeem={onNextClick}
          onPurchaseOverview={onPurchaseOverview}
          onExpireVoucherClick={onExpireVoucherClick}
          onRaiseDisputeClick={onRaiseDisputeClick}
          pageType="exchange"
          hasMultipleVariants={false}
          isPreview={false}
        />
      </Grid>
    </GridContainer>
  );
}