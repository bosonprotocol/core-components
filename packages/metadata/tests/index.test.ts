import { validateMetadata, AnyMetadata } from "../src/index";
import productV1ValidFullOffer from "./product-v1/valid/fullOffer.json";
import productV1ValidMinimalOffer from "./product-v1/valid/minimalOffer.json";

describe("#validateMetadata()", () => {
  test("throw for invalid type", () => {
    expect(() =>
      validateMetadata({
        schema: {
          type: "invalid"
        }
      } as any as AnyMetadata)
    ).toThrow();
  });

  describe("BASE", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          schema: {
            type: "BASE"
          }
        } as any as AnyMetadata)
      ).toThrow();
    });

    test("not throw for valid object", () => {
      expect(
        validateMetadata({
          name: "name",
          description: "description",
          externalUrl: "example.com",
          schema: {
            url: "example.com",
            type: "BASE"
          }
        })
      ).toBeTruthy();
    });
  });

  describe("PRODUCT_V1", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          schema: {
            type: "PRODUCT_V1"
          }
        } as any as AnyMetadata)
      ).toThrow();
    });

    test("not throw for full offer", () => {
      expect(
        validateMetadata(productV1ValidFullOffer as any as AnyMetadata)
      ).toBeTruthy();
    });

    test("not throw for minimal offer", () => {
      expect(
        validateMetadata(productV1ValidMinimalOffer as any as AnyMetadata)
      ).toBeTruthy();
    });
  });
});
