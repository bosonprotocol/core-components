import {
  encodeCreateOffer,
  bosonOfferHandlerIface
} from "../../src/offers/interface";
import { OfferCreator, PriceType, utils } from "@bosonprotocol/common";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";

describe("#encodeCreateOffer()", () => {
  test("encode correct calldata", () => {
    const royaltyRecipients = [
      AddressZero,
      getAddress("0x0123456789abcdef0123456789abcdef01234567")
    ];
    const royaltyBps = [2, 1];
    const mockedCreateOfferArgs = mockCreateOfferArgs({
      voucherValidDurationInMS: 1000,
      royaltyInfo: [
        {
          recipients: royaltyRecipients,
          bps: royaltyBps
        }
      ]
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
      priceType,
      creator,
      metadataUri,
      metadataHash,
      voided,
      collectionIndex,
      [royaltyInfos],
      buyerId
    ] = decodedCalldata[0]; // Offer struct
    const [
      validFrom,
      validUntil,
      voucherRedeemableFrom,
      voucherRedeemableUntil
    ] = decodedCalldata[1].toString().split(","); // OfferDates struct
    const [disputePeriod, voucherValid, resolutionPeriod] = decodedCalldata[2]
      .toString()
      .split(","); // OfferDurations struct
    const [disputeResolverId, mutualizerAddress] = decodedCalldata[3]
      .toString()
      .split(",");
    const agentId = decodedCalldata[4].toString();

    expect(id).toBeTruthy();
    expect(sellerId).toBeTruthy();
    expect(voided).toEqual(false);
    expect(price.toString()).toBe(mockedCreateOfferArgs.price.toString());
    expect(sellerDeposit.toString()).toBe(
      mockedCreateOfferArgs.sellerDeposit.toString()
    );
    expect(buyerCancelPenalty.toString()).toBe(
      mockedCreateOfferArgs.buyerCancelPenalty.toString()
    );
    expect(quantityAvailable.toString()).toBe(
      mockedCreateOfferArgs.quantityAvailable.toString()
    );
    expect(disputeResolverId.toString()).toBe(
      mockedCreateOfferArgs.disputeResolverId.toString()
    );
    expect(mutualizerAddress).toBe(AddressZero);
    expect(agentId.toString()).toBe(mockedCreateOfferArgs.agentId.toString());
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
    expect(priceType).toBe(PriceType.Static);
    expect(creator).toBe(OfferCreator.Seller);
    expect(collectionIndex.toString()).toBe("0");
    expect(royaltyInfos.length).toBe(royaltyRecipients.length);
    expect(royaltyInfos[0]).toEqual(royaltyRecipients);
    expect(royaltyInfos[1].length).toEqual(royaltyBps.length);
    expect(royaltyInfos[1][0].toString()).toBe(royaltyBps[0].toString());
    expect(royaltyInfos[1][1].toString()).toBe(royaltyBps[1].toString());
    expect(buyerId.toString()).toBe("0");
  });
});
