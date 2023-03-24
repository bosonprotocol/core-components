import { Formik } from "formik";
import React from "react";
import { useAccount } from "wagmi";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { Checkbox } from "../../../../form";
import Grid from "../../../../ui/Grid";
import Loading from "../../../../ui/loading/Loading";
import Exchanges from "./Exchanges";
import { WithExchangesData } from "./WithExchangesData";
type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  isValid: boolean;
};

const ExchangesWithData = WithExchangesData(Exchanges);

export function MyItems({ onBackClick, onNextClick }: Props) {
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
        redeemed: true,
        disputed: true
      }}
    >
      <Grid flexDirection="column">
        <Grid justifyContent="flex-end" gap="2rem" margin="0 0 2rem 0">
          <Checkbox name="committed" text="Committed" />
          <Checkbox name="redeemed" text="Redemed" />
          <Checkbox name="disputed" text="Disputed" />
        </Grid>
        <div>
          <ExchangesWithData buyerId={buyerId} />
        </div>
      </Grid>
    </Formik>
  );
}
