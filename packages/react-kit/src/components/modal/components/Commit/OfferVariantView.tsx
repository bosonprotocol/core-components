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
import DetailSlider from "../common/detail/DetailSlider";
import GridContainer from "../../../ui/GridContainer";
import { SellerAndDescription } from "../common/detail/SellerAndDescription";
import DetailView from "./DetailView/DetailView";
import Loading from "../../../ui/loading/Loading";

const colors = theme.colors.light;

const ImageWrapper = styled.div`
  position: relative;
  max-width: 35rem !important;
  min-width: 50%;
  width: -webkit-fill-available;
`;

export type OfferVariantViewProps = {
  onCommit: (exchangeId: string) => void;
  onExchangePolicyClick: () => void;
  onPurchaseOverview: () => void;
  onViewFullDescription: () => void;
  onLicenseAgreementClick: () => void;
  selectedVariant: VariantV1;
  allVariants: VariantV1[];
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
  disableVariationsSelects?: boolean;
};

const SLIDER_OPTIONS = {
  type: "carousel" as const,
  startAt: 0,
  gap: 20,
  perView: 1
};

export function OfferVariantView({
  selectedVariant,
  allVariants,
  disableVariationsSelects,
  onCommit,
  onExchangePolicyClick,
  onLicenseAgreementClick,
  onPurchaseOverview,
  onViewFullDescription,
  fairExchangePolicyRules,
  defaultDisputeResolverId
}: OfferVariantViewProps) {
  const { offer } = selectedVariant;

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
        headerComponent: <></>,
        contentStyle: {
          background: colors.lightGrey
        }
      }
    });
  }, [dispatch]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : !offer ? (
        <div data-testid="notFound">This offer does not exist</div>
      ) : isError ? (
        <div data-testid="errorOffer">
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
          <DetailView
            disableVariationsSelects={disableVariationsSelects}
            hasSellerEnoughFunds={hasSellerEnoughFunds}
            selectedVariant={selectedVariant}
            allVariants={allVariants}
            onExchangePolicyClick={onExchangePolicyClick}
            onLicenseAgreementClick={onLicenseAgreementClick}
            onCommit={onCommit}
            onPurchaseOverview={onPurchaseOverview}
            hasMultipleVariants={false}
            isPreview={false}
            exchangePolicyCheckResult={exchangePolicyCheckResult}
          />
        </GridContainer>
      )}
    </>
  );
}
