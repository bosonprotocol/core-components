import { ArrowLeft } from "phosphor-react";
import React, { useEffect } from "react";
import { Exchange } from "../../../../../../types/exchange";
import { Grid } from "../../../../../ui/Grid";
import { Typography } from "../../../../../ui/Typography";
import { CancelExchange, CancelExchangeProps } from "./CancelExchange";
import { useNonModalContext } from "../../../../nonModal/NonModal";
import { colors } from "../../../../../../theme";
import { useAccount } from "../../../../../../hooks/connection/connection";
import { BosonLogo } from "../../../common/BosonLogo";
import {
  RedemptionWidgetAction,
  useRedemptionWidgetContext
} from "../../../../../widgets/redemption/provider/RedemptionWidgetContext";

export interface CancellationViewProps {
  exchange: Exchange | null;
  onBackClick: CancelExchangeProps["onBackClick"];
  onSuccess: CancelExchangeProps["onSuccess"];
  showBosonLogoInFooter: boolean;
}

export const CancellationView: React.FC<CancellationViewProps> = ({
  exchange,
  onBackClick,
  showBosonLogoInFooter
}) => {
  const { address } = useAccount();
  const { dispatch } = useNonModalContext();
  const { widgetAction } = useRedemptionWidgetContext();
  const isCancelModeOnly = widgetAction === RedemptionWidgetAction.CANCEL_FORM;
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: null,
        headerComponent: isCancelModeOnly ? (
          <Grid gap="1rem" style={{ flex: "1" }}>
            <Typography tag="h3" style={{ flex: "1 1" }}>
              Cancel exchange
            </Typography>
          </Grid>
        ) : (
          <Grid gap="1rem" style={{ flex: "1" }}>
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
            <Typography tag="h3" style={{ flex: "1 1" }}>
              Cancel exchange
            </Typography>
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        },
        footerComponent: showBosonLogoInFooter ? <BosonLogo /> : null
      }
    });
  }, [dispatch, isCancelModeOnly, onBackClick, showBosonLogoInFooter]);
  return (
    <>
      {!exchange ? (
        <p>Exchange could not be retrieved.</p>
      ) : exchange.buyer?.wallet?.toLowerCase() !== address?.toLowerCase() ? (
        <p>You do not own this exchange.</p>
      ) : exchange.state !== "COMMITTED" ? (
        <p>Invalid exchange state.</p>
      ) : (
        <CancelExchange
          exchange={exchange}
          onBackClick={onBackClick}
          onSuccess={onBackClick}
          showBackButton={!isCancelModeOnly}
        />
      )}
    </>
  );
};
