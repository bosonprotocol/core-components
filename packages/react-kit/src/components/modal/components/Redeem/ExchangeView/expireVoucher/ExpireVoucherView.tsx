import React from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { BosonFooter } from "../../BosonFooter";
import ExpireVoucher, { ExpireVoucherProps } from "./ExpireVoucher";
import NonModal from "../../../../NonModal";

export interface ExpireVoucherViewProps {
  onBackClick: ExpireVoucherProps["onBackClick"];
  onSuccess: ExpireVoucherProps["onSuccess"];
  exchange: Exchange | null;
}

export const ExpireVoucherView: React.FC<ExpireVoucherViewProps> = ({
  exchange,
  onBackClick,
  onSuccess
}) => {
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  return (
    <NonModal
      props={{
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
        footerComponent: <BosonFooter />
      }}
    >
      <ExpireVoucher
        exchange={exchange}
        onBackClick={onBackClick}
        onSuccess={onSuccess}
      />
    </NonModal>
  );
};
