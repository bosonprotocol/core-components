import { CheckCircle, Fire, House } from "phosphor-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import Grid from "../../../../ui/Grid";
import IpfsImage from "../../../../ui/IpfsImage";
import Loading from "../../../../ui/loading/Loading";
import Typography from "../../../../ui/Typography";
import DetailOpenSea from "./detail/DetailOpenSea";
import { useFormikContext } from "formik";
import { FormType } from "../RedeemModalFormModel";
import { theme } from "../../../../../theme";
import Video from "../../../../ui/Video";
import { Button } from "../../../../buttons/Button";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import { BosonFooter } from "../BosonFooter";
import GridContainer from "../../../../ui/GridContainer";
import { useConfigContext } from "../../../../config/ConfigContext";

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
  onExchangePolicyClick: () => void;
  exchangeId: string;
};

export function RedeemSuccess({
  onClickDone,
  onHouseClick,
  exchangeId
}: Props) {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <House
            onClick={onHouseClick}
            size={32}
            style={{ cursor: "pointer", flexShrink: 0 }}
          />
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />,
      contentStyle: {
        background: colors.lightGrey
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { redeemCallbackUrl } = useConfigContext();
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

  if (isFetching) {
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
  const { offerImg, animationUrl } = getOfferDetails(offer);

  return (
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
        {animationUrl ? (
          <Video
            src={animationUrl}
            dataTestId="offerAnimationUrl"
            videoProps={{ muted: true, loop: true, autoPlay: true }}
            componentWhileLoading={() => (
              <IpfsImage src={offerImg} dataTestId="offerImage" />
            )}
          />
        ) : (
          <IpfsImage src={offerImg} dataTestId="offerImage" />
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
            <Typography fontWeight="600" $fontSize="1.25rem">
              Congratulations!
            </Typography>

            <p>
              {redeemCallbackUrl
                ? `Your item is on its way to the provided address. Please check your email for the shipping confirmation. Thank you for using our service.`
                : `Your item is on its way to the provided address. Please check the chat for the shipping confirmation. Thank you for using our service.`}
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
                {redeemCallbackUrl
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
  );
}