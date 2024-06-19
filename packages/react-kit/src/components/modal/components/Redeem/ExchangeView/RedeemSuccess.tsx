import { CheckCircle, Fire, House } from "phosphor-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import { Grid } from "../../../../ui/Grid";
import { IpfsImage } from "../../../../ui/IpfsImage";
import Loading from "../../../../ui/loading/LoadingWrapper";
import { Typography } from "../../../../ui/Typography";
import DetailOpenSea from "../../common/DetailOpenSea";
import { useFormikContext } from "formik";
import { FormType } from "../RedeemFormModel";
import { theme } from "../../../../../theme";
import Video from "../../../../ui/Video";
import { Button } from "../../../../buttons/Button";
import { GridContainer } from "../../../../ui/GridContainer";
import { useRedemptionContext } from "../../../../widgets/redemption/provider/RedemptionContext";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { RedeemHeader } from "../RedeemHeader";
import { BosonLogo } from "../../common/BosonLogo";

const colors = theme.colors.light;

const ImageWrapper = styled.div`
  position: relative;
  max-width: 35rem !important;
  min-width: 50%;
  width: -webkit-fill-available;
`;

type Props = {
  onClickDone: () => void;
  onHouseClick: () => void;
  exchangeId: string;
};

export function RedeemSuccess({
  onClickDone,
  onHouseClick,
  exchangeId
}: Props) {
  const { postDeliveryInfoUrl } = useRedemptionContext();
  const {
    data: exchanges,
    isError,
    isFetching
  } = useExchanges(
    {
      id: exchangeId
    },
    {
      enabled: !!exchangeId
    }
  );
  const { values } = useFormikContext<FormType>();
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;

  const offerDetails = offer ? getOfferDetails(offer) : undefined;
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid style={{ flex: "1" }}>
            <House
              onClick={onHouseClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
            {RedeemHeader}
          </Grid>
        ),
        contentStyle: {
          background: colors.lightGrey
        },
        footerComponent: <BosonLogo />
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return (
    <>
      {isFetching ? (
        <Loading />
      ) : !offer ? (
        <div data-testid="notFound">This exchange does not exist</div>
      ) : isError || !exchangeId || !offerDetails ? (
        <div data-testid="errorExchange">
          There has been an error, please try again later...
        </div>
      ) : (
        <GridContainer
          itemsPerRow={{
            xs: 2,
            s: 2,
            m: 2,
            l: 2,
            xl: 2
          }}
        >
          <ImageWrapper>
            {offerDetails.animationUrl ? (
              <Video
                src={offerDetails.animationUrl}
                dataTestId="offerAnimationUrl"
                videoProps={{ muted: true, loop: true, autoPlay: true }}
                componentWhileLoading={() => (
                  <IpfsImage
                    src={offerDetails.mainImage ?? ""}
                    dataTestId="offerImage"
                  />
                )}
              />
            ) : (
              <IpfsImage
                src={offerDetails.mainImage ?? ""}
                dataTestId="offerImage"
              />
            )}
            <DetailOpenSea exchange={exchange} />
          </ImageWrapper>
          <Grid flexDirection="column" gap="1rem">
            <Grid
              as="section"
              style={{ background: colors.white, padding: "2rem" }}
              gap="1rem"
            >
              <CheckCircle size="60" color={colors.green} />
              <Grid flexDirection="column" alignItems="flex-start">
                <Typography fontWeight="600" fontSize="1.25rem">
                  Congratulations!
                </Typography>

                <p>
                  {`Your item is on its way to the provided address. Please check ${
                    postDeliveryInfoUrl ? "your email" : "the chat"
                  } for the shipping confirmation. Thank you for using our service.`}
                </p>
              </Grid>
            </Grid>
            <Grid
              as="section"
              gap="1.5rem"
              style={{ background: colors.white, padding: "2rem" }}
              flexDirection="column"
            >
              <Grid flex="1 1" alignItems="flex-start" gap="1rem">
                <div>
                  <Typography fontWeight="600">
                    Your item is on it's way to:
                  </Typography>
                  <Grid
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="0.25rem"
                  >
                    <div>{values.name}</div>
                    <div>{values.streetNameAndNumber}</div>
                    <div>{values.city}</div>
                    <div>{values.state}</div>
                    <div>{values.zip}</div>
                    <div>{values.country}</div>
                    <div>{values.email}</div>
                    <div>{values.phone}</div>
                  </Grid>
                </div>
                <div>
                  <Typography fontWeight="600">What's next?</Typography>
                  <Typography tag="p">
                    {postDeliveryInfoUrl
                      ? `Lean back and enjoy the wait! The seller will provide updates on the shipment of your purchase via email.`
                      : `Lean back and enjoy the wait! The seller will provide updates on the shipment of your purchase via chat.`}
                  </Typography>
                </div>
              </Grid>
              <Grid
                style={{ background: colors.lightGrey, padding: "1.5rem" }}
                justifyContent="flex-start"
                gap="1rem"
              >
                <Fire size={25} color={colors.orange} />
                <Typography>Your rNFT was burned</Typography>
              </Grid>
            </Grid>

            <Grid
              as="section"
              justifyContent="flex-end"
              style={{ background: colors.white, padding: "2rem" }}
            >
              <Button onClick={onClickDone}>Done</Button>
            </Grid>
          </Grid>
        </GridContainer>
      )}
    </>
  );
}
