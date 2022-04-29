import { createOfferArgsSchema } from "../../src/utils/validation";
import { mockCreateOfferArgs } from "../mocks";

describe("#createOfferArgsSchema()", () => {
  test("not throw for valid args", () => {
    expect(
      createOfferArgsSchema.validateSync(mockCreateOfferArgs())
    ).toBeTruthy();
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
    }).toThrow();
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
