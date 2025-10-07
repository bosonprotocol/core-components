import { AddressZero } from "@ethersproject/constants";
import {
  ConditionStruct,
  EvaluationMethod,
  GatingType,
  OfferCreator,
  TokenType
} from "../../src";
import { MSEC_PER_DAY } from "../../src/utils/timestamp";
import {
  createOfferAndCommitArgsSchema,
  createOfferArgsSchema
} from "../../src/utils/validation";
import { IPFS_URI, mockCreateOfferArgs } from "../mocks";
import { parseEther } from "@ethersproject/units";

describe("#createOfferArgsSchema()", () => {
  test("not throw for valid args", () => {
    expect(
      createOfferArgsSchema.validateSync(mockCreateOfferArgs())
    ).toBeTruthy();
  });

  test("not throw when voucherRedeemableUntilDateInMS > 0 and voucherValidDurationInMS == 0", () => {
    expect(
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          voucherRedeemableUntilDateInMS: Date.now() + 30 * MSEC_PER_DAY,
          voucherValidDurationInMS: 0
        })
      )
    ).toBeTruthy();
  });

  test("not throw when voucherRedeemableUntilDateInMS == 0 and voucherValidDurationInMS > 0", () => {
    expect(
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          voucherRedeemableUntilDateInMS: 0,
          voucherValidDurationInMS: 30 * MSEC_PER_DAY
        })
      )
    ).toBeTruthy();
  });

  test("throw when voucherRedeemableUntilDateInMS == 0 and voucherValidDurationInMS == 0", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          voucherRedeemableUntilDateInMS: 0,
          voucherValidDurationInMS: 0
        })
      );
    }).toThrow(
      /Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMS must be non zero/
    );
  });

  test("throw when voucherRedeemableUntilDateInMS > 0 and voucherValidDurationInMS > 0", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          voucherRedeemableUntilDateInMS: Date.now() + 30 * MSEC_PER_DAY,
          voucherValidDurationInMS: 30 * MSEC_PER_DAY
        })
      );
    }).toThrow(
      /Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMS must be non zero/
    );
  });

  test("throw for invalid string value", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          price: "invalid"
        })
      );
    }).toThrow();
  });

  test("throw for invalid validation date values", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          validFromDateInMS: Date.now(),
          validUntilDateInMS: Date.now() - 60 * 1000
        })
      );
    }).toThrow(/validUntilDateInMS has to be a date in the future/);
  });

  test("throw for invalid price values", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          price: "1",
          buyerCancelPenalty: "2"
        })
      );
    }).toThrow();
  });

  test("throw for invalid address values", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          exchangeToken: "0xinvalid"
        })
      );
    }).toThrow();
  });

  test("throw for invalid url values", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          metadataUri: "invalid"
        })
      );
    }).toThrow();
  });

  test("throw for invalid integer values", () => {
    expect(() => {
      createOfferArgsSchema.validateSync(
        mockCreateOfferArgs({
          buyerCancelPenalty: "-1"
        })
      );
    }).toThrow(/buyerCancelPenalty has to be a positive integer/);
  });
});

describe("#createOfferAndCommitArgsSchema()", () => {
  const createOfferAndCommitArgs = {
    ...mockCreateOfferArgs(),
    committer: AddressZero,
    offerCreator: AddressZero,
    sellerId: "1",
    buyerId: "2",
    sellerOfferParams: {
      collectionIndex: 0,
      mutualizerAddress: AddressZero,
      royaltyInfo: { recipients: [], bps: [] }
    },
    useDepositedFunds: true,
    creator: OfferCreator.Seller,
    feeLimit: parseEther("0.1"),
    condition: {
      method: EvaluationMethod.None,
      tokenType: TokenType.MultiToken,
      tokenAddress: AddressZero,
      gatingType: GatingType.PerAddress,
      minTokenId: 0,
      maxTokenId: 0,
      threshold: 0,
      maxCommits: 0
    } satisfies ConditionStruct
  };
  test("not throw for valid args", () => {
    expect(
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        metadataUri: IPFS_URI.replace("ipfs://", "") // keep only the hash to test that validation works with or without the prefix
      })
    ).toBeTruthy();
  });
  test("throw for invalid offerCreator args", () => {
    expect(() => {
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        offerCreator: "0xinvalid"
      });
    }).toThrow(/offerCreator has to be a valid address/);
  });
  test("throw for invalid condition.minTokenId args", () => {
    expect(() => {
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        condition: {
          ...createOfferAndCommitArgs.condition,
          minTokenId: "0xinvalid"
        }
      });
    }).toThrow(/condition.minTokenId has to be a valid big number/);
  });
  test("throw for invalid mutualizerAddress args", () => {
    expect(() => {
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        sellerOfferParams: {
          ...createOfferAndCommitArgs.sellerOfferParams,
          mutualizerAddress: "0xinvalid"
        }
      });
    }).toThrow(/sellerOfferParams.mutualizerAddress has to be a valid address/);
  });
  test("throw for buyer initiated offer with quantity > 1", () => {
    expect(() => {
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        creator: OfferCreator.Buyer,
        quantityAvailable: 2
      });
    }).toThrow(/Quantity must be 1 for buyer initiated offers/);
  });
  test("throw for invalid conditionalTokenId args", () => {
    expect(() => {
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        conditionalTokenId: "0xinvalid"
      });
    }).toThrow(/conditionalTokenId has to be a valid big number/);
  });
  test("throw for invalid quantityAvailable args", () => {
    expect(() => {
      createOfferAndCommitArgsSchema.validateSync({
        ...createOfferAndCommitArgs,
        quantityAvailable: "0xinvalid"
      });
    }).toThrow(/quantityAvailable has to be a positive integer/);
  });
});
