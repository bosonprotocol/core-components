import {
  encodeCreateOffer,
  bosonOfferHandlerIface
} from "../../src/offers/interface";
import { utils } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";

describe("#encodeCreateOffer()", () => {
  test("encode correct calldata", () => {
    const mockedCreateOfferArgs = mockCreateOfferArgs();

    const encodedCalldata = encodeCreateOffer(mockedCreateOfferArgs);
    const [
      id,
      ,
      price,
      sellerDeposit,
      buyerCancelPenalty,
      quantityAvailable,
      validFromDate,
      validUntilDate,
      redeemableFromDate,
      fulfillmentPeriodDuration,
      voucherValidDuration,
      exchangeToken,
      metadataUri,
      offerChecksum
    ] = bosonOfferHandlerIface
      .decodeFunctionData("createOffer", encodedCalldata)[0]
      .toString()
      .split(",");

    expect(id).toBeTruthy();
    expect(price).toBe(mockedCreateOfferArgs.price.toString());
    expect(sellerDeposit).toBe(mockedCreateOfferArgs.sellerDeposit.toString());
    expect(buyerCancelPenalty).toBe(
      mockedCreateOfferArgs.buyerCancelPenalty.toString()
    );
    expect(quantityAvailable).toBe(
      mockedCreateOfferArgs.quantityAvailable.toString()
    );
    expect(validFromDate).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.validFromDateInMS)
        .toString()
    );
    expect(validUntilDate).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.validUntilDateInMS)
        .toString()
    );
    expect(redeemableFromDate).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.redeemableFromDateInMS)
        .toString()
    );
    expect(fulfillmentPeriodDuration).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.fulfillmentPeriodDurationInMS)
        .toString()
    );
    expect(voucherValidDuration).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.voucherValidDurationInMS)
        .toString()
    );
    expect(exchangeToken).toBe(mockedCreateOfferArgs.exchangeToken);
    expect(metadataUri).toBe(mockedCreateOfferArgs.metadataUri);
    expect(offerChecksum).toBe(mockedCreateOfferArgs.offerChecksum);
  });
});
