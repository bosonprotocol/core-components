import { formatEther } from "ethers/lib/utils";
import { offers } from "@bosonprotocol/core-sdk";
import {
  Row,
  Entry,
  Label,
  Value,
  Spacer,
  Money,
  Currency
} from "./shared-styles";
import { formatDate } from "./shared-utils";

interface Props {
  createOfferArgs: offers.CreateOfferArgs;
  currency: string;
  name: string;
}

export function ExchangeDetails({ createOfferArgs, currency, name }: Props) {
  return (
    <>
      <Row>
        <Entry>
          <Label>Name / Title</Label>
          <Value title={name}>{name}</Value>
        </Entry>
      </Row>
      <Spacer />
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
          <Label>Buyer Cancellation Penalty</Label>
          <Money>
            <Value title={formatEther(createOfferArgs.buyerCancelPenalty)}>
              {formatEther(createOfferArgs.buyerCancelPenalty)}
            </Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
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
      <Spacer />
      <Row>
        <Entry>
          <Label>Committed Date</Label>
          <Value
            title={formatDate(createOfferArgs.validFromDateInMS.toString())}
          >
            {formatDate(createOfferArgs.validFromDateInMS.toString())}
          </Value>
        </Entry>
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
      </Row>
      <Row>
        <Entry>
          <Label>Validity Duration</Label>
          <Value title={createOfferArgs.voucherValidDurationInMS.toString()}>
            {createOfferArgs.voucherValidDurationInMS}
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
      </Row>
    </>
  );
}
