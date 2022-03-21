import {
  encodeCreateOffer,
  getCreatedOfferIdFromLogs,
  bosonOfferHandlerIface
} from "../../src/offers/interface";
import { utils } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";

describe("#getCreatedOfferIdFromLogs()", () => {
  test("return offer id", () => {
    const data =
      "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000029a2241af62c0000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000622ca71c00000000000000000000000000000000000000000000000000000000622df89c00000000000000000000000000000000000000000000000000000000622df89c0000000000000000000000000000000000000000000000000000000000015180000000000000000000000000000000000000000000000000000000000001518000000000000000000000000057fafe1fb7c682216fce44e50946c5249192b9d5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004368747470733a2f2f697066732e696f2f697066732f516d63314265727845477850724c393569577a385979376b39586773786f64504770444873626e366576593775790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e516d63314265727845477850724c393569577a385979376b39586773786f64504770444873626e36657659377579000000000000000000000000000000000000";
    const topics = [
      "0xe8124cd6a5f6faf203dd31be656a579399e881882de9726c2dcba2830d1ee035",
      "0x0000000000000000000000000000000000000000000000000000000000000013",
      "0x00000000000000000000000057fafe1fb7c682216fce44e50946c5249192b9d5"
    ];

    const offerId = getCreatedOfferIdFromLogs([
      {
        data,
        topics
      }
    ]);
    expect(offerId).toBeTruthy();
  });
});

describe("#encodeCreateOffer()", () => {
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

    expect(id).toBeTruthy();
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
