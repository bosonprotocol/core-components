import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
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
import { ResponsiveVariationSelects } from "../common/VariationSelects";
import DetailSlider from "../common/detail/DetailSlider";
import { SellerAndDescription } from "../common/detail/SellerAndDescription";
import { SlickSlider } from "../common/detail/SlickSlider";
import { CommitDetailViewWithProvider } from "./DetailView/CommitDetailViewWithProvider";
import { DetailContextProps } from "./DetailView/common/DetailViewProvider";
import { OnClickBuyOrSwapHandler } from "./DetailView/common/types";

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

export type OfferVariantViewProps = OnClickBuyOrSwapHandler & {
  onCommit: (exchangeId: string, txHash: string) => void;
  onExchangePolicyClick: () => void;
  onPurchaseOverview: () => void;
  onViewFullDescription: () => void;
  onLicenseAgreementClick: () => void;
  onGetDetailViewProviderProps: (providerProps: DetailContextProps) => void;
  onAlreadyOwnOfferClick: () => void;
  selectedVariant: VariantV1;
  setSelectedVariant: Dispatch<SetStateAction<VariantV1 | undefined>>;
  allVariants: VariantV1[];
  showBosonLogo?: boolean;
  disableVariationsSelects?: boolean;
  loadingViewFullDescription: boolean;
};

const SLIDER_OPTIONS = {
  type: "carousel",
  startAt: 0,
  gap: 20,
  perView: 1,
  focusAt: "center"
} as const;

export function OfferVariantView({
  selectedVariant,
  allVariants,
  showBosonLogo,
  disableVariationsSelects,
  loadingViewFullDescription,
  onCommit,
  onExchangePolicyClick,
  onLicenseAgreementClick,
  onPurchaseOverview,
  onViewFullDescription,
  onGetDetailViewProviderProps,
  onClickBuyOrSwap,
  onAlreadyOwnOfferClick,
  setSelectedVariant
}: OfferVariantViewProps) {
  const [isCommitting, setIsComitting] = useState(false);
  const { offer } = selectedVariant;

  const { offerImg, animationUrl, images } = offer
    ? getOfferDetails(offer)
    : { offerImg: undefined, animationUrl: undefined, images: undefined };
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
          <ImageAndSellerIdContainer flexDirection="column" flex={1}>
            <ImageWrapper>
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
                offer={offer}
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
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                variants={allVariants}
                disabled={allVariants.length < 2 || disableVariationsSelects}
              />
            )}

            <CommitDetailViewWithProvider
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
              onAlreadyOwnOfferClick={onAlreadyOwnOfferClick}
            />
          </VariationsAndWhiteWidget>
        </GridContainer>
      )}
    </>
  );
}
