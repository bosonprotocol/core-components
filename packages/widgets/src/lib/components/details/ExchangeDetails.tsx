import { utils, BigNumberish, BigNumber } from "ethers";
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
  quantityAvailable?: BigNumberish;
  quantityInitial?: BigNumberish;
  priceInWei: BigNumberish;
  buyerCancelPenaltyInWei: BigNumberish;
  sellerDepositInWei: BigNumberish;
  voucherRedeemableFromDateInMS: BigNumberish;
  voucherRedeemableUntilDateInMS: BigNumberish;
  voucherValidDurationInMS?: BigNumberish;
  metadataUri: string;
  offerChecksum?: string;
  protocolFeeInWei: BigNumberish;
  fulfillmentPeriodInMS: BigNumberish;
  resolutionPeriodInMS: BigNumberish;
}

export function ExchangeDetails({
  currencySymbol,
  currencyDecimals = 18,
  quantityInitial,
  quantityAvailable,
  priceInWei,
  buyerCancelPenaltyInWei,
  sellerDepositInWei,
  voucherRedeemableFromDateInMS,
  voucherRedeemableUntilDateInMS,
  voucherValidDurationInMS,
  metadataUri,
  offerChecksum,
  protocolFeeInWei,
  fulfillmentPeriodInMS,
  resolutionPeriodInMS
}: Props) {
  return (
    <>
      <Row>
        {quantityAvailable && (
          <Entry>
            <Label>Available (Qty.)</Label>
            <Value title={quantityAvailable.toString()}>
              {quantityAvailable}
            </Value>
          </Entry>
        )}
        {quantityInitial && (
          <Entry>
            <Label>Initial (Qty.)</Label>
            <Value title={quantityInitial.toString()}>{quantityInitial}</Value>
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
          <Label>Redeemable From</Label>
          <Value title={formatDate(voucherRedeemableFromDateInMS.toString())}>
            {formatDate(voucherRedeemableFromDateInMS.toString())}
          </Value>
        </Entry>
        <Entry>
          <Label>Redeemable Until</Label>
          <Value
            title={getRedeemableUntilDate({
              voucherRedeemableFromDateInMS,
              voucherRedeemableUntilDateInMS,
              voucherValidDurationInMS
            })}
          >
            {getRedeemableUntilDate({
              voucherRedeemableFromDateInMS,
              voucherRedeemableUntilDateInMS,
              voucherValidDurationInMS
            })}
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

function getRedeemableUntilDate(args: {
  voucherRedeemableFromDateInMS: BigNumberish;
  voucherRedeemableUntilDateInMS: BigNumberish;
  voucherValidDurationInMS?: BigNumberish;
}) {
  if (BigNumber.from(args.voucherRedeemableUntilDateInMS).gt(0)) {
    return formatDate(args.voucherRedeemableUntilDateInMS.toString());
  }

  return formatDate(
    BigNumber.from(args.voucherRedeemableFromDateInMS)
      .add(BigNumber.from(args.voucherValidDurationInMS))
      .toString()
  );
}
