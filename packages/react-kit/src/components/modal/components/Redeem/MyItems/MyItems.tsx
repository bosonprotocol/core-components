import { Formik } from "formik";
import React from "react";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { Checkbox } from "../../../../form";
import Grid from "../../../../ui/Grid";
import Loading from "../../../../ui/loading/Loading";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import Exchanges from "./Exchanges";
import { ExchangesStates, WithExchangesData } from "./WithExchangesData";
import { Exchange } from "../../../../../types/exchange";
import { BosonFooter } from "../BosonFooter";
import { theme } from "../../../../../theme";
import GridContainer from "../../../../ui/GridContainer";
import NonModal, { NonModalProps } from "../../../NonModal";
import { useAccount } from "hooks/connection/connection";

const colors = theme.colors.light;

export type MyItemsProps = {
  onExchangeCardClick: (exchange: Exchange) => void;
  onRedeemClick: (exchange: Exchange) => void;
  onCancelExchange: (exchange: Exchange) => void;
  onRaiseDisputeClick: (exchange: Exchange) => void;
  onAvatarClick: (exchange: Exchange) => void;
  isValid: boolean;
  nonModalProps: Partial<NonModalProps>;
};

const ExchangesWithData = WithExchangesData(Exchanges);

export function MyItems({
  onRedeemClick,
  onExchangeCardClick,
  onCancelExchange,
  onRaiseDisputeClick,
  onAvatarClick,
  nonModalProps
}: MyItemsProps) {
  const { address } = useAccount();
  const { data: buyers, isLoading } = useBuyers({
    wallet: address
  });
  const buyerId = buyers?.[0]?.id;
  return (
    <NonModal
      props={{
        ...nonModalProps,
        headerComponent: <Typography tag="h3">Redeem your item</Typography>,
        footerComponent: <BosonFooter />,
        contentStyle: {
          background: colors.lightGrey
        }
      }}
    >
      {isLoading ? (
        <Loading />
      ) : buyerId ? (
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
                  onAvatarClick={onAvatarClick}
                />
              </>
            );
          }}
        </Formik>
      ) : (
        <div>You do not have any exchanges yet</div>
      )}
    </NonModal>
  );
}
