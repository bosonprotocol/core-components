import { MSEC_PER_DAY } from "../../src/utils/timestamp";
import { createOfferArgsSchema } from "../../src/utils/validation";
import { mockCreateOfferArgs } from "../mocks";

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
      /Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMShas must be non zero/
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
      /Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMShas must be non zero/
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
});
