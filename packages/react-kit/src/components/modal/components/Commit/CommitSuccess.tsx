import { CheckCircle, Fire, House } from "phosphor-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import Grid from "../../../ui/Grid";
import IpfsImage from "../../../ui/IpfsImage";
import Loading from "../../../ui/loading/Loading";
import Typography from "../../../ui/Typography";
import { theme } from "../../../../theme";
import Video from "../../../ui/Video";
import { Button } from "../../../buttons/Button";
import GridContainer from "../../../ui/GridContainer";
import { useNonModalContext } from "../../nonModal/NonModal";
import { useExchanges } from "../../../../hooks/useExchanges";
import DetailOpenSea from "../common/DetailOpenSea";

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

export function CommitSuccess({
  onClickDone,
  onHouseClick,
  exchangeId
}: Props) {
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
  const exchange = exchanges?.[0];
  const offer = exchange?.offer;

  const offerDetails = offer ? getOfferDetails(offer) : undefined;
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Grid>
            <House
              onClick={onHouseClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
            <Typography tag="h3" $width="100%">
              Sucess!
            </Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.lightGrey
        }
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
                    src={offerDetails.offerImg}
                    dataTestId="offerImage"
                  />
                )}
              />
            ) : (
              <IpfsImage src={offerDetails.offerImg} dataTestId="offerImage" />
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
                  <Typography fontWeight="600">What's next?</Typography>
                  <Typography tag="p">Redeem it!</Typography>
                </div>
              </Grid>
              <Grid
                style={{ background: colors.lightGrey, padding: "1.5rem" }}
                justifyContent="flex-start"
                gap="1rem"
              >
                <Fire size={25} color={colors.orange} />
                <Typography>You got an rNFT</Typography>
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
