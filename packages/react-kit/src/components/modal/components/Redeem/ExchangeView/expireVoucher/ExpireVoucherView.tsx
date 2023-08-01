import React, { useEffect } from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { useModal } from "../../../../useModal";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { BosonFooter } from "../../BosonFooter";
import ExpireVoucher, { ExpireVoucherProps } from "./ExpireVoucher";

export interface ExpireVoucherViewProps {
  onBackClick: ExpireVoucherProps["onBackClick"];
  onSuccess: ExpireVoucherProps["onSuccess"];
  exchange: Exchange | null;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
}

export const ExpireVoucherView: React.FC<ExpireVoucherViewProps> = ({
  exchange,
  fairExchangePolicyRules,
  defaultDisputeResolverId,
  onBackClick,
  onSuccess
}) => {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <ArrowLeft
            onClick={() => onBackClick()}
            size={32}
            style={{ cursor: "pointer" }}
          />
          <Typography tag="h3">Expire voucher</Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />,
      fairExchangePolicyRules,
      defaultDisputeResolverId
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  return (
    <ExpireVoucher
      exchange={exchange}
      onBackClick={onBackClick}
      onSuccess={onSuccess}
    />
  );
};
