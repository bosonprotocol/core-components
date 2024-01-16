import { House } from "phosphor-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { theme } from "../../../../../theme";
import { isTruthy } from "../../../../../types/helpers";
import { VariantV1 } from "../../../../../types/variants";
import Grid from "../../../../ui/Grid";
import GridContainer from "../../../../ui/GridContainer";
import Typography from "../../../../ui/Typography";
import Loading from "../../../../ui/loading/Loading";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { ExchangeDetailViewWithProvider } from "../DetailView/ExchangeDetailViewWithProvider";
import { DetailContextProps } from "../../common/detail/DetailViewProvider";
import { OnClickBuyOrSwapHandler } from "../../common/detail/types";
import DetailOpenSea from "../../common/DetailOpenSea";
import { ResponsiveVariationSelects } from "../../common/VariationSelects";
import DetailSlider from "../../common/detail/DetailSlider";
import { SellerAndDescription } from "../../common/detail/SellerAndDescription";
import { SlickSlider } from "../../common/detail/SlickSlider";

const colors = theme.colors.light;

const ImageWrapper = styled.div`
  container-type: inline-size;
  position: relative;
  min-width: 50%;
  width: -webkit-fill-available;
  ${breakpoint.s} {
    max-width: 35rem !important;
  }
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

const PreviewSlickSlider = styled(SlickSlider)`
  margin-top: 1rem;
`;

export type ExchangeViewProps = OnClickBuyOrSwapHandler & {
  onHouseClick: () => void;
  onNextClick: () => void;
  onCancelExchange: () => void;
  onExchangePolicyClick: () => void;
  onPurchaseOverview: () => void;
  onViewFullDescription: () => void;
  onExpireVoucherClick: () => void;
  onRaiseDisputeClick: () => void;
  onContractualAgreementClick: () => void;
  onGetDetailViewProviderProps: (providerProps: DetailContextProps) => void;
  showBosonLogo?: boolean;
  exchangeId: string;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
  isValid: boolean;
  loadingViewFullDescription: boolean;
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
  exchangeId,
  fairExchangePolicyRules,
  defaultDisputeResolverId,
  isValid,
  onClickBuyOrSwap,
  loadingViewFullDescription,
  onContractualAgreementClick,
  onGetDetailViewProviderProps,
  showBosonLogo
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

  const variant = {
    offer,
    variations
  };
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
          <Grid gap="1rem" style={{ flex: "1" }}>
            <House
              onClick={onHouseClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
          </Grid>
        ),
        contentStyle: {
          background: colors.lightGrey
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, offer]);
  const innerOnGetProviderProps = useCallback(
    (providerProps: DetailContextProps) => {
      onGetDetailViewProviderProps(providerProps);
    },
    [onGetDetailViewProviderProps]
  );
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const sliderOptions = useMemo(() => {
    return { ...SLIDER_OPTIONS, startAt: sliderIndex };
  }, [sliderIndex]);

  const mediaFiles = useMemo(() => {
    const imgs = [...allImages.map((img) => ({ url: img, type: "image" }))];
    return (
      animationUrl
        ? [
            { url: animationUrl, type: "video" },
            ...allImages.map((img) => ({ url: img, type: "image" }))
          ]
        : imgs
    ) as { url: string; type: "image" | "video" }[];
  }, [allImages, animationUrl]);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : !offer ? (
        <div data-testid="notFound">This exchange does not exist</div>
      ) : isError || !exchangeId ? (
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
          style={{ paddingTop: "1rem" }}
          rowGap="3rem"
        >
          <ImageAndSellerIdContainer flexDirection="column" flex={1}>
            <ImageWrapper>
              <DetailOpenSea exchange={exchange} />

              {(allImages.length > 0 || animationUrl) && (
                <DetailSlider
                  animationUrl={animationUrl}
                  images={allImages}
                  sliderOptions={sliderOptions}
                  arrowsAbove={false}
                  data-slider
                  onChangeMedia={({ index }) => {
                    setSliderIndex(index);
                  }}
                />
              )}

              <SellerAndDescription
                offer={exchange.offer}
                onViewFullDescription={onViewFullDescription}
                loadingViewFullDescription={loadingViewFullDescription}
              />
              {mediaFiles.length > 1 && (
                <PreviewSlickSlider
                  mediaFiles={mediaFiles}
                  onMediaClick={({ index }) => {
                    setSliderIndex(index);
                  }}
                  activeIndex={sliderIndex}
                  imageOptimizationOpts={{ height: 75 }}
                  mediaHeight="75px"
                />
              )}
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
                selectedVariant={variant as VariantV1}
                variants={[variant] as VariantV1[]}
                setSelectedVariant={undefined}
                disabled
              />
            )}
            <ExchangeDetailViewWithProvider
              showBosonLogo={showBosonLogo ?? false}
              selectedVariant={variant as VariantV1}
              exchange={exchange}
              onExchangePolicyClick={onExchangePolicyClick}
              onRedeem={onNextClick}
              onExpireVoucherClick={onExpireVoucherClick}
              onRaiseDisputeClick={onRaiseDisputeClick}
              onPurchaseOverview={onPurchaseOverview}
              onCancelExchangeClick={onCancelExchange}
              onContractualAgreementClick={onContractualAgreementClick}
              showPriceAsterisk={false}
              onGetProviderProps={innerOnGetProviderProps}
              onClickBuyOrSwap={onClickBuyOrSwap}
            />
          </VariationsAndWhiteWidget>
        </GridContainer>
      )}
    </>
  );
}
