import styled from "styled-components";
import { formatEther } from "ethers/lib/utils";
import { offers } from "@bosonprotocol/core-sdk";
import { colors } from "../colors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const columnGap = 24;

export const Value = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border: 2px solid ${colors.shadowGray};
  background-color: ${colors.cyberSpaceGray};
  color: ${colors.satinWhite};
  border-radius: 4px;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const Money = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 0;

  ${Value} {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: none;
  }
`;

const Currency = styled.div`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 2px solid ${colors.shadowGray};
  background-color: ${colors.concreteGray};
  color: ${colors.satinWhite};
  padding: 4px;
`;

export const Row = styled.div`
  display: flex;
  gap: ${columnGap}px;
  min-width: 0;
`;

export const Entry = styled.div`
  flex-grow: 1;
  max-width: calc(50% - ${columnGap / 2}px);
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-bottom: 10px;
`;

export const Label = styled.div`
  font-weight: 500;
  display: inline-block;
  min-width: 140px;
  padding-right: 8px;
  font-size: 14px;
  user-select: none;
`;

export const Spacer = styled.div`
  height: 20px;
`;

interface Props {
  createOfferArgs: offers.CreateOfferArgs;
  currency: string;
}

function formatDate(date: string) {
  return dayjs(parseInt(date)).utc().format("DD/MM/YYYY HH:mm:ss UTC");
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
