import {
  encodeCreateOffer,
  bosonOfferHandlerIface
} from "../../src/offers/interface";
import { PriceType, utils } from "@bosonprotocol/common";
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
      metadataUri,
      metadataHash,
      voided,
      collectionIndex,
      ...royaltyInfos
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
    expect(priceType).toBe(PriceType.Static.toString());
    expect(collectionIndex).toBe("0");
    expect(royaltyInfos.length).toBe(4);
    expect(royaltyInfos[0]).toBe(royaltyRecipients[0]);
    expect(royaltyInfos[1]).toBe(royaltyRecipients[1]);
    expect(royaltyInfos[2]).toBe(royaltyBps[0].toString());
    expect(royaltyInfos[3]).toBe(royaltyBps[1].toString());
  });
});
