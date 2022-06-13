import { utils, BigNumberish } from "ethers";
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
  currencySymbol: string;
  currencyDecimals?: number;
  name?: string;
  quantityAvailable?: BigNumberish;
  priceInWei: BigNumberish;
  buyerCancelPenaltyInWei: BigNumberish;
  sellerDepositInWei: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  voucherRedeemableFromDateInMS: BigNumberish;
  voucherRedeemableUntilDateInMS: BigNumberish;
  metadataUri: string;
  offerChecksum?: string;
  protocolFeeInWei: BigNumberish;
  fulfillmentPeriodInMS: BigNumberish;
  resolutionPeriodInMS: BigNumberish;
}

export function OfferDetails({
  currencySymbol,
  currencyDecimals = 18,
  name,
  quantityAvailable,
  priceInWei,
  buyerCancelPenaltyInWei,
  sellerDepositInWei,
  validFromDateInMS,
  validUntilDateInMS,
  voucherRedeemableFromDateInMS,
  voucherRedeemableUntilDateInMS,
  metadataUri,
  offerChecksum,
  protocolFeeInWei,
  fulfillmentPeriodInMS,
  resolutionPeriodInMS
}: Props) {
  return (
    <>
      <Row>
        {name && (
          <Entry>
            <Label>Name / Title</Label>
            <Value title={name}>{name}</Value>
          </Entry>
        )}
        {quantityAvailable && (
          <Entry>
            <Label>Quantity</Label>
            <Value title={quantityAvailable.toString()}>
              {quantityAvailable}
            </Value>
          </Entry>
        )}
      </Row>
      <Row>
        <Entry>
          <Label>Price</Label>
          <Money>
            <Value title={utils.formatUnits(priceInWei, currencyDecimals)}>
              {utils.formatUnits(priceInWei, currencyDecimals)}
            </Value>
            <Currency>{currencySymbol}</Currency>
          </Money>
        </Entry>
        <Entry>
          <Label>Cancellation Penalty</Label>
          <Money>
            <Value
              title={utils.formatUnits(
                buyerCancelPenaltyInWei,
                currencyDecimals
              )}
            >
              {utils.formatUnits(buyerCancelPenaltyInWei, currencyDecimals)}
            </Value>
            <Currency>{currencySymbol}</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Seller Deposit</Label>
          <Money>
            <Value
              title={utils.formatUnits(sellerDepositInWei, currencyDecimals)}
            >
              {utils.formatUnits(sellerDepositInWei, currencyDecimals)}
            </Value>
            <Currency>{currencySymbol}</Currency>
          </Money>
        </Entry>
        <Entry>
          <Label>Protocol Fee</Label>
          <Money>
            <Value
              title={utils.formatUnits(protocolFeeInWei, currencyDecimals)}
            >
              {utils.formatUnits(protocolFeeInWei, currencyDecimals)}
            </Value>
            <Currency>{currencySymbol}</Currency>
          </Money>
        </Entry>
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Valid From Date</Label>
          <Value title={formatDate(validFromDateInMS.toString())}>
            {formatDate(validFromDateInMS.toString())}
          </Value>
        </Entry>
        <Entry>
          <Label>Valid Until Date</Label>
          <Value title={formatDate(validUntilDateInMS.toString())}>
            {formatDate(validUntilDateInMS.toString())}
          </Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Redeemable From</Label>
          <Value title={formatDate(voucherRedeemableFromDateInMS.toString())}>
            {formatDate(voucherRedeemableFromDateInMS.toString())}
          </Value>
        </Entry>
        <Entry>
          <Label>Redeemable Until</Label>
          <Value title={formatDate(voucherRedeemableUntilDateInMS.toString())}>
            {formatDate(voucherRedeemableUntilDateInMS.toString())}
          </Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Fulfillment Period</Label>
          <Value title={fulfillmentPeriodInMS.toString()}>
            {fulfillmentPeriodInMS}
          </Value>
        </Entry>
        <Entry>
          <Label>Resolution Period</Label>
          <Value title={resolutionPeriodInMS.toString()}>
            {resolutionPeriodInMS.toString()}
          </Value>
        </Entry>
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Metadata URI</Label>
          <Value title={metadataUri}>{metadataUri}</Value>
        </Entry>
        {offerChecksum && (
          <Entry>
            <Label>Offer Checksum</Label>
            <Value title={offerChecksum}>{offerChecksum}</Value>
          </Entry>
        )}
      </Row>
    </>
  );
}
