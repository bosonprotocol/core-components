import {
  createOffer,
  encodeCreateOffer,
  bosonOfferHandlerIface
} from "../../src/offers/handler";
import { utils } from "@bosonprotocol/common";
import {
  MockMetadataStorage,
  MockWeb3LibAdapter,
  ADDRESS
} from "@bosonprotocol/common/tests/mocks";
import { mockCreateOfferArgs } from "../mocks";

describe("#createOffer()", () => {
  test("throw for invalid args", () => {
    expect(() =>
      createOffer({
        offerToCreate: mockCreateOfferArgs({
          price: "invalid"
        }),
        web3Lib: new MockWeb3LibAdapter(),
        contractAddress: ADDRESS
      })
    ).rejects.toThrow();
  });

  test("return tx response", async () => {
    const mockedTxHash = "0xTX_HASH";
    const txResponse = await createOffer({
      offerToCreate: mockCreateOfferArgs(),
      web3Lib: new MockWeb3LibAdapter({
        sendTransaction: {
          hash: mockedTxHash,
          wait: async () => mockedTxHash
        }
      }),
      contractAddress: ADDRESS,
      metadataStorage: new MockMetadataStorage(),
      theGraphStorage: new MockMetadataStorage()
    });

    expect(txResponse.hash).toEqual(mockedTxHash);
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
