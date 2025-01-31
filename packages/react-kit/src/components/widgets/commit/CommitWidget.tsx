import React, { ComponentType } from "react";
import { CSSProperties } from "styled-components";
import { ButtonProps } from "../../buttons/Button";
import { CommitNonModalProps } from "../../modal/components/Commit/CommitNonModal";
import { MarginContainer } from "../MarginContainer";
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
    defaultSelectedOfferId?: string;
    disableVariationsSelects?: boolean;
  } & (
    | {
        offerId: string;
      }
    | {
        sellerId: string;
        productUuid: string;
      }
    | {
        sellerId: string;
        bundleUuid: string;
      }
  ) & {
    lookAndFeel: "regular" | "modal";
    modalMargin?: CSSProperties["margin"];
  };
export type CommitWidgetProps = CommitProps &
  Omit<
    CommitWidgetProvidersProps,
    "withReduxProvider" | "provider" | "children"
  >;

export function CommitWidget(props: CommitWidgetProps) {
  return (
    <MarginContainer {...props}>
      <CommitWidgetProviders {...props} withReduxProvider withGlobalStyle>
        <CommitModalWithOffer {...props} hideModal={props.closeWidgetClick} />
      </CommitWidgetProviders>
    </MarginContainer>
  );
}
