import { encodeCreateOffer, bosonOfferHandlerIface } from "../src/offers";
import { utils } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";

describe("#encodeCreateOffer()", () => {
  test("throw if validFromDate after validUntilDate", () => {
    expect(() => {
      encodeCreateOffer(
        mockCreateOfferArgs({
          validFromDateInMS: Date.now(),
          validUntilDateInMS: Date.now() - 1000
        })
      );
    }).toThrow();
  });

  test("throw if validUntilDate before now", () => {
    expect(() => {
      encodeCreateOffer(
        mockCreateOfferArgs({
          validUntilDateInMS: Date.now() - 1000
        })
      );
    }).toThrow();
  });

  test("encode correct calldata", () => {
    const mockedCreateOfferArgs = mockCreateOfferArgs();

    const encodedCalldata = encodeCreateOffer(mockedCreateOfferArgs);
    const [
      id,
      price,
      deposit,
      penalty,
      quantity,
      validFromDate,
      validUntilDate,
      redeemableDate,
      fulfillmentPeriodDuration,
      voucherValidDuration,
      seller,
      exchangeToken,
      metadataUri,
      metadataHash
    ] = bosonOfferHandlerIface
      .decodeFunctionData("createOffer", encodedCalldata)[0]
      .toString()
      .split(",");

    expect(id).toBe(mockedCreateOfferArgs.id.toString());
    expect(price).toBe(mockedCreateOfferArgs.price.toString());
    expect(deposit).toBe(mockedCreateOfferArgs.deposit.toString());
    expect(penalty).toBe(mockedCreateOfferArgs.penalty.toString());
    expect(quantity).toBe(mockedCreateOfferArgs.quantity.toString());
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
    expect(redeemableDate).toBe(
      utils.timestamp
        .msToSec(mockedCreateOfferArgs.redeemableDateInMS)
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
    expect(seller).toBe(mockedCreateOfferArgs.seller);
    expect(exchangeToken).toBe(mockedCreateOfferArgs.exchangeToken);
    expect(metadataUri).toBe(mockedCreateOfferArgs.metadataUri);
    expect(metadataHash).toBe(mockedCreateOfferArgs.metadataHash);
  });
});
