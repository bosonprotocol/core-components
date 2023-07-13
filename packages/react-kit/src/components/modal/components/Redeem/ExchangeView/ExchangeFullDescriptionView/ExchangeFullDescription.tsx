import React from "react";
import { getOfferDetails } from "../../../../../../lib/offer/getOfferDetails";
import { theme } from "../../../../../../theme";
import { Exchange } from "../../../../../../types/exchange";
import Grid from "../../../../../ui/Grid";
import GridContainer from "../../../../../ui/GridContainer";
import Typography from "../../../../../ui/Typography";
import DetailTable from "../detail/DetailTable";
import DetailTransactions from "../detail/DetailTransactions";

const colors = theme.colors.light;

interface ExchangeFullDescriptionProps {
  exchange: Exchange;
}

export const ExchangeFullDescription: React.FC<
  ExchangeFullDescriptionProps
> = ({ exchange }) => {
  const { offer } = exchange;
  const { description, artistDescription, shippingInfo } =
    getOfferDetails(offer);
  const buyerAddress = exchange.buyer.wallet;

  return (
    <>
      <GridContainer
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 2,
          l: 2,
          xl: 2
        }}
      >
        <div>
          <Typography tag="h3">Product description</Typography>
          <Typography
            tag="p"
            data-testid="description"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {description}
          </Typography>
        </div>

        <div>
          <Typography tag="h3">About the creator</Typography>
          <Typography tag="p" style={{ whiteSpace: "pre-wrap" }}>
            {artistDescription}
          </Typography>
        </div>
      </GridContainer>
      <Grid flexDirection="column" alignItems="flex-start">
        <DetailTransactions
          title="Transaction History (this item)"
          exchange={exchange}
          offer={offer}
          buyerAddress={buyerAddress}
        />
        {(shippingInfo.returnPeriodInDays !== undefined ||
          !!shippingInfo.shippingTable.length) && (
          <div>
            <Typography tag="h3">Shipping information</Typography>
            <Typography tag="p" style={{ color: colors.darkGrey }}>
              Return period: {shippingInfo.returnPeriodInDays}{" "}
              {shippingInfo.returnPeriodInDays === 1 ? "day" : "days"}
            </Typography>
            <DetailTable data={shippingInfo.shippingTable} inheritColor />
          </div>
        )}
      </Grid>
    </>
  );
};
