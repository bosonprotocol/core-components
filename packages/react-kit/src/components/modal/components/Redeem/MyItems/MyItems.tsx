import { Formik } from "formik";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { Checkbox } from "../../../../form";
import Grid from "../../../../ui/Grid";
import Loading from "../../../../ui/loading/Loading";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import Exchanges from "./Exchanges";
import { ExchangesStates, WithExchangesData } from "./WithExchangesData";
import { Exchange } from "../../../../../types/exchange";
import { BosonFooter } from "../BosonFooter";
import { theme } from "../../../../../theme";
import GridContainer from "../../../../ui/GridContainer";

const colors = theme.colors.light;

type Props = {
  onExchangeCardClick: (exchange: Exchange) => void;
  onRedeemClick: (exchange: Exchange) => void;
  onCancelExchange: (exchange: Exchange) => void;
  onRaiseDisputeClick: (exchange: Exchange) => void;
  isValid: boolean;
};

const ExchangesWithData = WithExchangesData(Exchanges);

export function MyItems({
  onRedeemClick,
  onExchangeCardClick,
  onCancelExchange,
  onRaiseDisputeClick
}: Props) {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />,
      contentStyle: {
        background: colors.lightGrey
      }
    });
  }, []);
  const { address } = useAccount();
  const { data: buyers, isLoading } = useBuyers({
    wallet: address
  });
  if (isLoading) {
    return <Loading />;
  }
  const buyerId = buyers?.[0]?.id;
  if (!buyerId) {
    return <div>You do not have any exchanges yet</div>;
  }
  return (
    <Formik<ExchangesStates>
      onSubmit={() => {
        // empty
      }}
      initialValues={{
        committed: true,
        redeemed: false,
        disputed: false,
        completed: false
      }}
    >
      {({ values }) => {
        return (
          <>
            <GridContainer
              itemsPerRow={{
                xs: 4,
                s: 4,
                m: 4,
                l: 4,
                xl: 4
              }}
              style={{ margin: "0 0 2rem 0" }}
            >
              <Checkbox name="committed" text="Committed" />
              <Checkbox name="redeemed" text="Redeemed" />
              <Checkbox name="disputed" text="Disputed" />
              <Checkbox name="completed" text="Completed" />
            </GridContainer>

            <ExchangesWithData
              buyerId={buyerId}
              {...values}
              onCardClick={onExchangeCardClick}
              onRedeemClick={onRedeemClick}
              onCancelExchangeClick={onCancelExchange}
              onRaiseDisputeClick={onRaiseDisputeClick}
            />
          </>
        );
      }}
    </Formik>
  );
}
