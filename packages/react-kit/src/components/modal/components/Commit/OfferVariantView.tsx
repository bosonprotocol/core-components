import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import { breakpoint } from "../../../../lib/ui/breakpoint";
import { theme } from "../../../../theme";
import { isTruthy } from "../../../../types/helpers";
import { VariantV1 } from "../../../../types/variants";
import Grid from "../../../ui/Grid";
import GridContainer from "../../../ui/GridContainer";
import Typography from "../../../ui/Typography";
import { WaveLoader } from "../../../ui/loading/WaveLoader/WaveLoader";
import { useNonModalContext } from "../../nonModal/NonModal";
import VariationSelects from "../common/VariationSelects";
import DetailSlider from "../common/detail/DetailSlider";
import { SellerAndDescription } from "../common/detail/SellerAndDescription";
import { DetailViewWithProvider } from "./DetailView/DetailViewWithProvider";
import { DetailContextProps } from "./DetailView/common/DetailViewProvider";
import { DetailViewProps } from "./DetailView/common/DetailViewCore";

const colors = theme.colors.light;
const selectWidth = "10rem";
const ResponsiveVariationSelects = styled(VariationSelects)`
  container-type: inline-size;
  z-index: calc(var(--wcm-z-index) + 1);
  width: 100%;
  && {
    [data-grid] {
      [class*="container"] {
        width: 100%;
      }
      [class*="control"] {
        width: 100%;
      }
      flex-direction: column;
      @container (width > 300px) {
        justify-content: flex-start;
        flex-direction: row;
      }
      @container (350px < width) {
        [class*="container"] {
          width: auto;
        }
        [class*="control"] {
          width: auto;
        }
      }
    }
  }

  [class*="control"] {
    background-color: ${colors.white};
    border-color: ${colors.white};
    max-width: 100%;
    width: ${selectWidth};
  }
  [class*="menu"] {
    max-width: 100%;
    width: ${selectWidth};
  }
`;
const ImageWrapper = styled.div`
  container-type: inline-size;
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

const VariationsAndWhiteWidget = styled(Grid)`
  ${breakpoint.s} {
    max-width: 550px;
  }
`;

export type OfferVariantViewProps = Pick<
  DetailViewProps,
  "onClickBuyOrSwap"
> & {
  onCommit: (exchangeId: string, txHash: string) => void;
  onExchangePolicyClick: () => void;
  onPurchaseOverview: () => void;
  onViewFullDescription: () => void;
  onLicenseAgreementClick: () => void;
  onGetDetailViewProviderProps: (providerProps: DetailContextProps) => void;
  selectedVariant: VariantV1;
  allVariants: VariantV1[];
  showBosonLogo?: boolean;
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
  showBosonLogo,
  disableVariationsSelects,
  onCommit,
  onExchangePolicyClick,
  onLicenseAgreementClick,
  onPurchaseOverview,
  onViewFullDescription,
  onGetDetailViewProviderProps,
  onClickBuyOrSwap
}: OfferVariantViewProps) {
  const [isCommitting, setIsComitting] = useState(false);
  const { offer } = selectedVariant;

  const { offerImg, animationUrl, images } = offer
    ? getOfferDetails(offer)
    : ({} as ReturnType<typeof getOfferDetails>);
  const allImages = useMemo(() => {
    return Array.from(new Set([offerImg || "", ...(images || [])])).filter(
      isTruthy
    );
  }, [offerImg, images]);

  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid
            gap="1rem"
            style={{ flex: "1 1" }}
            justifyContent="flex-start"
          />
        ),
        contentStyle: {
          background: isCommitting ? colors.white : colors.lightGrey
        }
      }
    });
  }, [dispatch, isCommitting]);
  const hasVariations = !!selectedVariant.variations?.length;
  const innerOnGetProviderProps = useCallback(
    (providerProps: DetailContextProps) => {
      onGetDetailViewProviderProps(providerProps);
    },
    [onGetDetailViewProviderProps]
  );
  return (
    <>
      {isCommitting ? (
        <Grid flexDirection="column">
          <Typography $fontSize="1.7rem">
            <strong>Your transaction is being processed...</strong>
          </Typography>
          <WaveLoader />
        </Grid>
      ) : !offer ? (
        <div data-testid="notFound">This offer does not exist</div>
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
          <VariationsAndWhiteWidget
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Typography tag="h3" marginTop="0" marginBottom="1rem">
              {offer.metadata.name || ""}
            </Typography>
            {hasVariations && (
              <ResponsiveVariationSelects
                selectedVariant={selectedVariant}
                variants={allVariants}
                disabled={allVariants.length < 2 || disableVariationsSelects}
              />
            )}

            <DetailViewWithProvider
              showBosonLogo={showBosonLogo ?? false}
              selectedVariant={selectedVariant}
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
              onGetProviderProps={innerOnGetProviderProps}
              onClickBuyOrSwap={onClickBuyOrSwap}
            />
          </VariationsAndWhiteWidget>
        </GridContainer>
      )}
    </>
  );
}
