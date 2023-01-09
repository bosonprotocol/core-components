import {
  encodeCreateOffer,
  bosonOfferHandlerIface
} from "../../src/offers/interface";
import { utils } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";

describe("#encodeCreateOffer()", () => {
  test("encode correct calldata", () => {
    const mockedCreateOfferArgs = mockCreateOfferArgs({
      voucherValidDurationInMS: 1000
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
      buyerCancelPenalty,
      quantityAvailable,
      exchangeToken,
      metadataUri,
      metadataHash,
      voided
    ] = decodedCalldata[0].toString().split(","); // Offer struct
    const [
      validFrom,
      validUntil,
      voucherRedeemableFrom,
      voucherRedeemableUntil
    ] = decodedCalldata[1].toString().split(","); // OfferDates struct
    const [disputePeriod, voucherValid, resolutionPeriod] = decodedCalldata[2]
      .toString()
      .split(","); // OfferDurations struct
    const disputeResolverId = decodedCalldata[3].toString();
    const agentId = decodedCalldata[4].toString();

    expect(id).toBeTruthy();
    expect(sellerId).toBeTruthy();
    expect(voided).toBeTruthy();
    expect(price).toBe(mockedCreateOfferArgs.price.toString());
    expect(sellerDeposit).toBe(mockedCreateOfferArgs.sellerDeposit.toString());
    expect(buyerCancelPenalty).toBe(
      mockedCreateOfferArgs.buyerCancelPenalty.toString()
    );
    expect(quantityAvailable).toBe(
      mockedCreateOfferArgs.quantityAvailable.toString()
    );
    expect(disputeResolverId).toBe(
      mockedCreateOfferArgs.disputeResolverId.toString()
    );
    expect(agentId).toBe(mockedCreateOfferArgs.agentId.toString());
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
    expect(disputePeriod).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.disputePeriodDurationInMS)
        .toString()
    );
    expect(voucherValid).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.voucherValidDurationInMS || "0")
        .toString()
    );
    expect(exchangeToken).toBe(mockedCreateOfferArgs.exchangeToken);
    expect(metadataUri).toBe(mockedCreateOfferArgs.metadataUri);
    expect(metadataHash).toBe(mockedCreateOfferArgs.metadataHash);
  });
});
