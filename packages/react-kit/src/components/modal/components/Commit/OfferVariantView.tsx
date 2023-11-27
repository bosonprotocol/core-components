import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { VariantV1 } from "../../../../types/variants";
import { theme } from "../../../../theme";
import { useSellers } from "../../../../hooks/useSellers";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import { isTruthy } from "../../../../types/helpers";
import { useConvertionRate } from "../../../widgets/finance/convertion-rate/useConvertionRate";
import useCheckExchangePolicy from "../../../../hooks/useCheckExchangePolicy";
import { useNonModalContext } from "../../nonModal/NonModal";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { Loading } from "../../../Loading";
import DetailSlider from "../common/detail/DetailSlider";
import GridContainer from "../../../ui/GridContainer";
import { SellerAndDescription } from "../common/detail/SellerAndDescription";
import VariationSelects from "../Redeem/ExchangeView/VariationSelects";
import DetailView from "../Redeem/ExchangeView/DetailView/DetailView";

const colors = theme.colors.light;

const ImageWrapper = styled.div`
  position: relative;
  max-width: 35rem !important;
  min-width: 50%;
  width: -webkit-fill-available;
`;

export type OfferVariantViewProps = {
  onNextClick: () => void;
  onExchangePolicyClick: () => void;
  onPurchaseOverview: () => void;
  onViewFullDescription: () => void;
  variant: VariantV1;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
};

const SLIDER_OPTIONS = {
  type: "carousel" as const,
  startAt: 0,
  gap: 20,
  perView: 1
};

export function OfferVariantView({
  variant,
  onNextClick,
  onExchangePolicyClick,
  onPurchaseOverview,
  onViewFullDescription,
  fairExchangePolicyRules,
  defaultDisputeResolverId
}: OfferVariantViewProps) {
  const hasVariations = !!variant.variations?.length;
  const { offer } = variant;

  const {
    data: sellers,
    isLoading,
    isError
  } = useSellers(
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
  const {
    store: { tokens: defaultTokens }
  } = useConvertionRate();

  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: offer.id,
    fairExchangePolicyRules,
    defaultDisputeResolverId: defaultDisputeResolverId || "unknown",
    defaultTokens: defaultTokens || []
  });
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid gap="1rem">
            {offer && (
              <Typography tag="h3" style={{ flex: "1 1" }}>
                {offer.metadata.name}
              </Typography>
            )}
          </Grid>
        ),
        contentStyle: {
          background: colors.lightGrey
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, offer]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : !offer ? (
        <div data-testid="notFound">This exchange does not exist</div>
      ) : isError ? (
        <div data-testid="errorExchange">
          There has been an error, please try again later...
        </div>
      ) : (
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
                offer={offer}
                onViewFullDescription={onViewFullDescription}
              />
            </ImageWrapper>
          </Grid>
          <Grid flexDirection="column" gap="1rem" justifyContent="flex-start">
            {hasVariations && (
              <div style={{ width: "100%" }}>
                <VariationSelects
                  selectedVariant={variant}
                  variants={[variant]}
                  disabled
                />
              </div>
            )}
            <DetailView
              hasSellerEnoughFunds={hasSellerEnoughFunds}
              offer={offer}
              onExchangePolicyClick={onExchangePolicyClick}
              onCommit={onNextClick}
              onPurchaseOverview={onPurchaseOverview}
              pageType="offer"
              hasMultipleVariants={false}
              isPreview={false}
              exchangePolicyCheckResult={exchangePolicyCheckResult}
            />
          </Grid>
        </GridContainer>
      )}
    </>
  );
}
