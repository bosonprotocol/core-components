import { Formik } from "formik";
import React, { useEffect } from "react";
import { useBuyers } from "../../../../../hooks/useBuyers";
import { Checkbox } from "../../../../form";
import Loading from "../../../../ui/loading/LoadingWrapper";
import Exchanges from "./Exchanges";
import { ExchangesStates, WithExchangesData } from "./WithExchangesData";
import { Exchange } from "../../../../../types/exchange";
import { getCssVar } from "../../../../../theme";
import { GridContainer } from "../../../../ui/GridContainer";
import { subgraph } from "@bosonprotocol/core-sdk";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { useAccount } from "../../../../../hooks/connection/connection";
import { BosonLogo } from "../../common/BosonLogo";

export type MyItemsProps = {
  onExchangeCardClick: (exchange: Exchange) => void;
  onRedeemClick: (exchange: Exchange) => void;
  onRaiseDisputeClick: (exchange: Exchange) => void;
  onAvatarClick: (exchange: Exchange) => void;
  isValid: boolean;
  sellerIds?: string[];
  exchangeState?: subgraph.ExchangeState;
  showBosonLogoInFooter: boolean;
};

const ExchangesWithData = WithExchangesData(Exchanges);

export function MyItems({
  onRedeemClick,
  onExchangeCardClick,
  onRaiseDisputeClick,
  onAvatarClick,
  sellerIds,
  exchangeState,
  showBosonLogoInFooter
}: MyItemsProps) {
  const { address } = useAccount();
  const { data: buyers, isLoading } = useBuyers({
    wallet: address
  });
  const buyerId = buyers?.[0]?.id;
  const { dispatch } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: null,
        headerComponent: (
          <h3 style={{ width: "100%", flex: 1 }}>Manage your exchanges</h3>
        ),
        contentStyle: {
          background: getCssVar("--background-color")
        },
        footerComponent: showBosonLogoInFooter ? <BosonLogo /> : null
      }
    });
  }, [dispatch, showBosonLogoInFooter]);
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
            committed:
              !exchangeState ||
              exchangeState === subgraph.ExchangeState.COMMITTED,
            redeemed: exchangeState === subgraph.ExchangeState.REDEEMED,
            disputed: exchangeState === subgraph.ExchangeState.DISPUTED,
            completed: exchangeState === subgraph.ExchangeState.COMPLETED
          }}
        >
          {({ values }) => {
            return (
              <>
                <GridContainer
                  itemsPerRow={{
                    xs: 2,
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
                  sellerIds={sellerIds}
                  {...values}
                  onCardClick={onExchangeCardClick}
                  onRedeemClick={onRedeemClick}
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
