import React, { ComponentType } from "react";
import { ButtonProps } from "../../buttons/Button";
import { CommitNonModalProps } from "../../modal/components/Commit/CommitNonModal";
import { CommitModalWithOffer } from "./CommitModalWithOffer";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "./CommitWidgetProviders";
type CommitProps = {
  buttonProps?: Omit<ButtonProps, "onClick">;
  trigger?: ComponentType<{ onClick: () => unknown }> | undefined;
} & Omit<CommitNonModalProps, "product" | "isLoading" | "hideModal"> & {
    closeWidgetClick?: () => void;
    offerId?: string;
    sellerId?: string;
    productUuid?: string;
    defaultSelectedOfferId?: string;
    disableVariationsSelects?: boolean;
  };
export type CommitWidgetProps = CommitProps & CommitWidgetProvidersProps;
export function CommitWidget(props: CommitWidgetProps) {
  return (
    <CommitWidgetProviders {...props}>
      <CommitModalWithOffer {...props} hideModal={props.closeWidgetClick} />
    </CommitWidgetProviders>
  );
}
