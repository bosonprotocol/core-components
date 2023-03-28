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
import { WithExchangesData } from "./WithExchangesData";
import { ReactComponent } from "../../../../../assets/logo.svg";
import { Exchange } from "../../../../../types/exchange";

type Props = {
  onBackClick: () => void;
  onExchangeCardClick: (exchange: Exchange) => void;
  isValid: boolean;
};

const ExchangesWithData = WithExchangesData(Exchanges);

export function MyItems({ onBackClick, onExchangeCardClick }: Props) {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton />
        </Grid>
      ),
      footerComponent: (
        <Grid justifyContent="center" padding="1.5rem 0">
          <ReactComponent height="24px" />
        </Grid>
      )
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
    <Formik<{ committed: boolean; redeemed: boolean; disputed: boolean }>
      onSubmit={() => {
        // empty
      }}
      initialValues={{
        committed: true,
        redeemed: false,
        disputed: false
      }}
    >
      {({ values }) => {
        return (
          <>
            <Grid justifyContent="flex-end" gap="2rem" margin="0 0 2rem 0">
              <Checkbox name="committed" text="Committed" />
              <Checkbox name="redeemed" text="Redeemed" />
              <Checkbox name="disputed" text="Disputed" />
            </Grid>

            <ExchangesWithData
              buyerId={buyerId}
              {...values}
              onCardClick={onExchangeCardClick}
            />
          </>
        );
      }}
    </Formik>
  );
}
