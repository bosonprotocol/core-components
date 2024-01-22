import React, { ComponentType } from "react";
import { ButtonProps } from "../../buttons/Button";
import { RedeemNonModalProps } from "../../modal/components/Redeem/RedeemNonModal";
import { getParentWindowOrigin } from "../common";
import { RedeemModalWithExchange } from "./RedeemModalWithExchange";
import {
  RedemptionWidgetProviders,
  RedemptionWidgetProvidersProps
} from "./RedemptionWidgetProviders";

type RedemptionProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
} & Omit<RedeemNonModalProps, "exchange" | "hideModal" | "parentOrigin"> & {
    exchangeId?: string;
    closeWidgetClick?: () => void;
    modalMargin?: string;
  };

export type RedemptionWidgetProps = RedemptionProps &
  RedemptionWidgetProvidersProps;

export function RedemptionWidget(props: RedemptionWidgetProps) {
  const parentOrigin = getParentWindowOrigin();
  const sellerIds = Array.isArray(props.sellerIds)
    ? props.sellerIds
    : undefined;
  const signatures = Array.isArray(props.signatures)
    ? props.signatures
    : undefined;
  return (
    <div style={{ margin: props.modalMargin || "0" }}>
      <RedemptionWidgetProviders {...props}>
        <RedeemModalWithExchange
          {...props}
          sellerIds={sellerIds}
          signatures={signatures}
          parentOrigin={parentOrigin}
          hideModal={props.closeWidgetClick}
        />
      </RedemptionWidgetProviders>
    </div>
  );
}
