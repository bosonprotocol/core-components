import React from "react";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";
import NonModal from "../../nonModal/NonModal";
import { BosonFooter } from "../common/BosonFooter";
import { theme } from "../../../../theme";
const colors = theme.colors.light;

export type PurchaseOverviewProps = {
  lookAndFeel: "regular" | "modal";
  hideModal: () => void;
};

export const PurchaseOverview: React.FC<PurchaseOverviewProps> = ({
  lookAndFeel,
  hideModal
}) => {
  return (
    <NonModal
      hideModal={hideModal}
      footerComponent={<BosonFooter />}
      contentStyle={{
        background: colors.white
      }}
      lookAndFeel={lookAndFeel}
      showConnectButton={false}
    >
      <PurchaseOverviewView />
    </NonModal>
  );
};
