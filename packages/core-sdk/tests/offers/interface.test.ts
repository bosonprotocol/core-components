import {
  encodeCreateOffer,
  bosonOfferHandlerIface
} from "../../src/offers/interface";
import { utils } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";

describe("#encodeCreateOffer()", () => {
  test("encode correct calldata", () => {
    const mockedCreateOfferArgs = mockCreateOfferArgs({
      voucherValidDurationInMS: 1000,
      voucherRedeemableUntilDateInMS: 0
    });

    const encodedCalldata = encodeCreateOffer(mockedCreateOfferArgs);
    const decodedCalldata = bosonOfferHandlerIface.decodeFunctionData(
      "createOffer",
      encodedCalldata
    );
    const [
      id,
      sellerId,
      price,
      sellerDeposit,
      protocolFee,
      buyerCancelPenalty,
      quantityAvailable,
      exchangeToken,
      disputeResolverId,
      metadataUri,
      offerChecksum,
      voided
    ] = decodedCalldata[0].toString().split(","); // Offer struct
    const [
      validFrom,
      validUntil,
      voucherRedeemableFrom,
      voucherRedeemableUntil
    ] = decodedCalldata[1].toString().split(","); // OfferDates struct
    const [fulfillmentPeriod, voucherValid, resolutionPeriod] =
      decodedCalldata[2].toString().split(","); // OfferDurations struct

    expect(id).toBeTruthy();
    expect(sellerId).toBeTruthy();
    expect(voided).toBeTruthy();
    expect(price).toBe(mockedCreateOfferArgs.price.toString());
    expect(sellerDeposit).toBe(mockedCreateOfferArgs.sellerDeposit.toString());
    expect(protocolFee).toBe(mockedCreateOfferArgs.protocolFee.toString());
    expect(buyerCancelPenalty).toBe(
      mockedCreateOfferArgs.buyerCancelPenalty.toString()
    );
    expect(quantityAvailable).toBe(
      mockedCreateOfferArgs.quantityAvailable.toString()
    );
    expect(disputeResolverId).toBe(
      mockedCreateOfferArgs.disputeResolverId.toString()
    );
    expect(validFrom).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.validFromDateInMS)
        .toString()
    );
    expect(validUntil).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.validUntilDateInMS)
        .toString()
    );
    expect(voucherRedeemableFrom).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.voucherRedeemableFromDateInMS)
        .toString()
    );
    expect(voucherRedeemableUntil).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.voucherRedeemableUntilDateInMS)
        .toString()
    );
    expect(resolutionPeriod).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.resolutionPeriodDurationInMS)
        .toString()
    );
    expect(fulfillmentPeriod).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.fulfillmentPeriodDurationInMS)
        .toString()
    );
    expect(voucherValid).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.voucherValidDurationInMS || "0")
        .toString()
    );
    expect(exchangeToken).toBe(mockedCreateOfferArgs.exchangeToken);
    expect(metadataUri).toBe(mockedCreateOfferArgs.metadataUri);
    expect(offerChecksum).toBe(mockedCreateOfferArgs.offerChecksum);
  });
});
