import React from "react";
import { CSSProperties } from "styled-components";
import { colors } from "../../../../theme";
import { MarginContainer } from "../../../widgets/MarginContainer";
import NonModal from "../../nonModal/NonModal";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";

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
  return (
    <MarginContainer lookAndFeel={lookAndFeel} modalMargin={modalMargin}>
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
    </MarginContainer>
  );
};
