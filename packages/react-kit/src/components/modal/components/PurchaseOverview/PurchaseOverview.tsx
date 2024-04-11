import React, { ReactNode, useCallback } from "react";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";
import NonModal from "../../nonModal/NonModal";
import { BosonFooter } from "../common/BosonFooter";
import { theme } from "../../../../theme";
import { CSSProperties } from "styled-components";
const colors = theme.colors.light;

export type PurchaseOverviewProps = {
  lookAndFeel: "regular" | "modal";
  hideModal: () => void;
  modalMargin?: CSSProperties["margin"];
};

export const PurchaseOverview: React.FC<PurchaseOverviewProps> = ({
  lookAndFeel,
  hideModal,
  modalMargin
}) => {
  const Wrapper = useCallback(
    ({ children }: { children: ReactNode }) => {
      return lookAndFeel === "regular" ? (
        <>{children}</>
      ) : (
        <div style={{ margin: modalMargin }}>{children}</div>
      );
    },
    [lookAndFeel, modalMargin]
  );
  return (
    <Wrapper>
      <NonModal
        hideModal={hideModal}
        footerComponent={null}
        contentStyle={{
          background: colors.white
        }}
        lookAndFeel={lookAndFeel}
        showConnectButton={false}
      >
        <PurchaseOverviewView />
      </NonModal>
    </Wrapper>
  );
};
