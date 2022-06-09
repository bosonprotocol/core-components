import { offers } from "@bosonprotocol/core-sdk";
import { formatEther } from "ethers/lib/utils";
import {
  Row,
  Entry,
  Label,
  Money,
  Value,
  Currency,
  Spacer
} from "./shared-styles";
import { formatDate } from "./shared-utils";

interface Props {
  createOfferArgs: offers.CreateOfferArgs;
  currency: string;
}

export function OfferDetails({ createOfferArgs, currency }: Props) {
  return (
    <>
      <Row>
        <Entry>
          <Label>Price</Label>
          <Money>
            <Value title={formatEther(createOfferArgs.price)}>
              {formatEther(createOfferArgs.price)}
            </Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
        <Entry>
          <Label>Seller Deposit</Label>
          <Money>
            <Value title={formatEther(createOfferArgs.sellerDeposit)}>
              {formatEther(createOfferArgs.sellerDeposit)}
            </Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Quantity</Label>
          <Value title={createOfferArgs.quantityAvailable.toString()}>
            {createOfferArgs.quantityAvailable}
          </Value>
        </Entry>
        <Entry>
          <Label>Cancellation Penalty</Label>
          <Money>
            <Value title={formatEther(createOfferArgs.buyerCancelPenalty)}>
              {formatEther(createOfferArgs.buyerCancelPenalty)}
            </Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Valid From</Label>
          <Value
            title={formatDate(createOfferArgs.validFromDateInMS.toString())}
          >
            {formatDate(createOfferArgs.validFromDateInMS.toString())}
          </Value>
        </Entry>
        <Entry>
          <Label>Valid Until</Label>
          <Value
            title={formatDate(createOfferArgs.validUntilDateInMS.toString())}
          >
            {formatDate(createOfferArgs.validUntilDateInMS.toString())}
          </Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Redeemable From</Label>
          <Value
            title={formatDate(
              createOfferArgs.redeemableFromDateInMS.toString()
            )}
          >
            {formatDate(createOfferArgs.redeemableFromDateInMS.toString())}
          </Value>
        </Entry>
        <Entry>
          <Label>Validity Duration</Label>
          <Value title={createOfferArgs.voucherValidDurationInMS.toString()}>
            {createOfferArgs.voucherValidDurationInMS}
          </Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Fulfilment Period</Label>
          <Value
            title={createOfferArgs.fulfillmentPeriodDurationInMS.toString()}
          >
            {createOfferArgs.fulfillmentPeriodDurationInMS}
          </Value>
        </Entry>
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Metadata URI</Label>
          <Value title={createOfferArgs.metadataUri}>
            {createOfferArgs.metadataUri}
          </Value>
        </Entry>
        <Entry>
          <Label>Offer Checksum</Label>
          <Value title={createOfferArgs.offerChecksum}>
            {createOfferArgs.offerChecksum}
          </Value>
        </Entry>
      </Row>
    </>
  );
}
