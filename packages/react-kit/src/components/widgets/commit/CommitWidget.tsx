import React, { ComponentType, ReactNode, useCallback } from "react";
import { ButtonProps } from "../../buttons/Button";
import { CommitNonModalProps } from "../../modal/components/Commit/CommitNonModal";
import { CommitModalWithOffer } from "./CommitModalWithOffer";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "./CommitWidgetProviders";
import GlobalStyle from "../../styles/GlobalStyle";
import { CSSProperties } from "styled-components";
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
export type CommitWidgetProps = CommitProps & CommitWidgetProvidersProps;
export function CommitWidget(props: CommitWidgetProps) {
  const Container = useCallback(
    ({ children }: { children: ReactNode }) => {
      return props.lookAndFeel === "regular" ? (
        <>{children}</>
      ) : (
        <div style={{ margin: props.modalMargin }}>{children}</div>
      );
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [props.lookAndFeel, props.modalMargin]
  );
  return (
    <Container>
      <CommitWidgetProviders {...props}>
        <GlobalStyle />
        <CommitModalWithOffer {...props} hideModal={props.closeWidgetClick} />
      </CommitWidgetProviders>
    </Container>
  );
}
