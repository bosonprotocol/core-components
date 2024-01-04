import React, { ElementRef, useEffect, useMemo, useRef, useState } from "react";
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
import { breakpoint } from "../../../../lib/ui/breakpoint";
import { WaveLoader } from "../../../ui/loading/WaveLoader/WaveLoader";
import Typography from "../../../ui/Typography";
import VariationSelects from "../common/VariationSelects";

const colors = theme.colors.light;
const ResponsiveVariationSelects = styled(VariationSelects)`
  container-type: inline-size;
  z-index: calc(var(--wcm-z-index) + 1);
  width: 100%;
  [data-grid] {
    flex-direction: column;
    @container (width > 300px) {
      flex-direction: row;
    }
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  max-width: 35rem !important;
  min-width: 50%;
  width: -webkit-fill-available;
`;

const ImageAndSellerIdContainer = styled(Grid)`
  align-items: center;
  ${breakpoint.s} {
    align-items: flex-end;
  }
`;

export type OfferVariantViewProps = {
  onCommit: (exchangeId: string, txHash: string) => void;
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
  const [isCommitting, setIsComitting] = useState(false);
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
        headerComponent: (
          <Grid gap="1rem" style={{ flex: "1 1" }} justifyContent="flex-start">
            <Typography tag="h3">{offer.metadata.name || ""}</Typography>
          </Grid>
        ),
        contentStyle: {
          background: isCommitting ? colors.white : colors.lightGrey
        }
      }
    });
  }, [dispatch, isCommitting, offer.metadata.name]);
  const hasVariations = !!selectedVariant.variations?.length;
  const portalRef = useRef<ElementRef<"div">>(null);
  return (
    <>
      {isCommitting ? (
        <Grid flexDirection="column">
          <Typography $fontSize="1.7rem">
            <strong>Your transaction is being processed...</strong>
          </Typography>
          <WaveLoader />
        </Grid>
      ) : isLoading ? (
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
          style={{ paddingTop: "1rem" }}
          rowGap="3rem"
        >
          <ImageAndSellerIdContainer flexDirection="column">
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
          </ImageAndSellerIdContainer>
          <Grid flexDirection="column" justifyContent="flex-start">
            {hasVariations && (
              <ResponsiveVariationSelects
                selectedVariant={selectedVariant}
                variants={allVariants}
                disabled={allVariants.length < 2 || disableVariationsSelects}
              />
            )}
            <Grid flexDirection="column">
              <div
                ref={portalRef}
                style={{ width: "100%", height: "3rem", position: "relative" }}
              />
              <DetailView
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ref={portalRef}
                disableVariationsSelects={disableVariationsSelects}
                hasSellerEnoughFunds={hasSellerEnoughFunds}
                selectedVariant={selectedVariant}
                allVariants={allVariants}
                onExchangePolicyClick={onExchangePolicyClick}
                onLicenseAgreementClick={onLicenseAgreementClick}
                onCommit={(...args) => {
                  onCommit(...args);
                  setIsComitting(false);
                }}
                onCommitting={() => setIsComitting(true)}
                onPurchaseOverview={onPurchaseOverview}
                hasMultipleVariants={false}
                isPreview={false}
                exchangePolicyCheckResult={exchangePolicyCheckResult}
              />
            </Grid>
          </Grid>
        </GridContainer>
      )}
    </>
  );
}
