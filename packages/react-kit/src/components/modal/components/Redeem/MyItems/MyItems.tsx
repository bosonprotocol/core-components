import { Formik } from "formik";
import React, { useEffect } from "react";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { Checkbox } from "../../../../form";
import Loading from "../../../../ui/loading/Loading";
import Typography from "../../../../ui/Typography";
import Exchanges from "./Exchanges";
import { ExchangesStates, WithExchangesData } from "./WithExchangesData";
import { Exchange } from "../../../../../types/exchange";
import { theme } from "../../../../../theme";
import GridContainer from "../../../../ui/GridContainer";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { useAccount } from "hooks/connection/connection";

const colors = theme.colors.light;

export type MyItemsProps = {
  onExchangeCardClick: (exchange: Exchange) => void;
  onRedeemClick: (exchange: Exchange) => void;
  onCancelExchange: (exchange: Exchange) => void;
  onRaiseDisputeClick: (exchange: Exchange) => void;
  onAvatarClick: (exchange: Exchange) => void;
  isValid: boolean;
};

const ExchangesWithData = WithExchangesData(Exchanges);

export function MyItems({
  onRedeemClick,
  onExchangeCardClick,
  onCancelExchange,
  onRaiseDisputeClick,
  onAvatarClick
}: MyItemsProps) {
  const { address } = useAccount();
  const { data: buyers, isLoading } = useBuyers({
    wallet: address
  });
  const buyerId = buyers?.[0]?.id;
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Typography tag="h3" $width="100%">
            Redeem your item
          </Typography>
        ),
        contentStyle: {
          background: colors.lightGrey
        }
      }
    });
  }, [dispatch]);
  return (
    <>
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
    </>
  );
}
