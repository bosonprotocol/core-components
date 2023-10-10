import React from "react";
import { useExchanges } from "../../../hooks/useExchanges";
import RedeemNonModal, {
  RedeemNonModalProps
} from "../../modal/components/Redeem/RedeemNonModal";

function WithExchange(
  WrappedComponent: React.ComponentType<RedeemNonModalProps>
) {
  const ComponentWithExchange = (
    props: Omit<RedeemNonModalProps, "exchange"> & { exchangeId?: string }
  ) => {
    const { data: exchanges } = useExchanges(
      {
        id: props.exchangeId
      },
      {
        enabled: !!props.exchangeId
      }
    );
    const exchange = exchanges?.[0];
    return <WrappedComponent {...props} exchange={exchange} />;
  };
  return ComponentWithExchange;
}

export const RedeemModalWithExchange = WithExchange(RedeemNonModal);
