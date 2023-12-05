import {
  ArrowSquareUpRight,
  CheckCircle,
  CurrencyCircleDollar,
  House,
  Package,
  Wallet
} from "phosphor-react";
import React, { useEffect } from "react";
import { getOfferDetails } from "../../../../../lib/offer/getOfferDetails";
import Grid from "../../../../ui/Grid";
import Loading from "../../../../ui/loading/Loading";
import Typography from "../../../../ui/Typography";
import { theme } from "../../../../../theme";
import { Button } from "../../../../buttons/Button";
import GridContainer from "../../../../ui/GridContainer";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { useExchanges } from "../../../../../hooks/useExchanges";
import { CardCTA } from "./CardCTA";
import { getOpenSeaUrl } from "../../../../../lib/opensea/getOpenSeaUrl";
import { useConfigContext } from "../../../../config/ConfigContext";

const colors = theme.colors.light;

type Props = {
  onHouseClick: () => void;
  onExchangePolicyClick: () => void;
  exchangeId: string;
  commitHash: string | undefined;
};

export function CommitSuccess({ onHouseClick, exchangeId, commitHash }: Props) {
  const { config } = useConfigContext();
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
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  const exploreTxUrl = config.getTxExplorerUrl?.(commitHash, false);
  return (
    <>
      {isFetching ? (
        <Loading />
      ) : !exchange ? (
        <div data-testid="notFound">This exchange does not exist</div>
      ) : isError || !exchangeId || !offerDetails ? (
        <div data-testid="errorExchange">
          There has been an error, please try again later...
        </div>
      ) : (
        <Grid flexDirection="column" padding="2rem">
          <Grid flexDirection="column" margin="2.5rem 4.625rem">
            <CheckCircle
              size={105}
              color={colors.green}
              style={{ marginBottom: "2rem" }}
            />
            <Typography fontWeight="600" $fontSize="1.5rem" textAlign="center">
              Commit success!
            </Typography>
          </Grid>
          <GridContainer
            columnGap="2rem"
            rowGap="2rem"
            itemsPerRow={{
              xs: 1,
              s: 1,
              m: 2,
              l: 2,
              xl: 3
            }}
          >
            <CardCTA
              icon={<Wallet color={colors.secondary} size={20} />}
              title="Hold"
              text="You can now hold on to your redeemable NFT and trade, transfer or redeem it in the future"
              cta={
                <Button variant="accentInverted">
                  <a
                    href={exploreTxUrl}
                    target="__blank"
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      color: colors.secondary, // @ts-ignore
                      textWrap: "balance"
                    }}
                  >
                    View on{" "}
                    {[80001, 137].includes(config.chainId)
                      ? "Polygonscan"
                      : "Etherscan"}{" "}
                    <ArrowSquareUpRight
                      style={{ verticalAlign: "text-bottom" }}
                      color={colors.secondary}
                      size={20}
                    />
                  </a>
                </Button>
              }
            />
            <CardCTA
              icon={<CurrencyCircleDollar color={colors.secondary} size={20} />}
              title="Trade or Transfer"
              text="You can transfer or easily trade your rNFT on the secondary market for example OpenSea"
              cta={
                <Button variant="accentInverted">
                  <a
                    href={getOpenSeaUrl({
                      configId: config.configId,
                      envName: config.envName,
                      exchange
                    })}
                    target="__blank"
                    style={{
                      color: colors.secondary,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      textWrap: "balance"
                    }}
                  >
                    Trade on OpenSea{" "}
                    <ArrowSquareUpRight
                      style={{ verticalAlign: "text-bottom" }}
                      color={colors.secondary}
                      size={20}
                    />
                  </a>
                </Button>
              }
            />
            <CardCTA
              icon={<Package color={colors.secondary} size={20} />}
              title="Redeem"
              text="Redeem your rNFT to receive underlying item. The rNFT will be destroyed in the process."
              cta={
                <Button variant="accentInverted">
                  <a
                    href={`https://bosonapp.io/#/exchange/${exchangeId}`}
                    target="__blank"
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      color: colors.secondary, // @ts-ignore
                      textWrap: "balance"
                    }}
                  >
                    Go to Redeem site{" "}
                    <ArrowSquareUpRight
                      style={{ verticalAlign: "text-bottom" }}
                      color={colors.secondary}
                      size={20}
                    />
                  </a>
                </Button>
              }
            />
          </GridContainer>
        </Grid>
      )}
    </>
  );
}
