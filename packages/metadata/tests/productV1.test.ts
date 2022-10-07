import { metadata } from './../../../e2e/tests/utils';
import { ProductV1Metadata } from "@bosonprotocol/metadata/dist/cjs/product-v1";
import {
  createVariantProductMetadata,
  ProductV1Variant
} from "../src/product-v1";
import productV1ValidMinimalOffer from "./product-v1/valid/minimalOffer.json";

const types = ["size", "color"];
const options = {
  size: ["XS", "XL"],
  color: ["red", "blue"]
};
const variantsOK = [0, 1].map((index) =>
  types.map((type) => {
    return { type, option: options[type][index] };
  })
);

describe("#productV1 tests", () => {
  describe("createVariantProductMetadata()", () => {
    test("should fail if the productMetadata already have variations", async () => {
      const productMetadata: ProductV1Metadata = {
        ...productV1ValidMinimalOffer,
        variations: [
          {
            type: types[0],
            option: options[types[0]][0]
          }
        ]
      } as unknown as ProductV1Metadata;
      expect(() =>
        createVariantProductMetadata(productMetadata, variantsOK)
      ).toThrow(
        /Unable to create variant product Metadata from an already existing variation/
      );
    });

    test("should fail if less than 2 variants are specified", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      let variants: Array<ProductV1Variant> = [];
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/Unable to create a variant product with less than 2 variants/);
      variants = [variantsOK[0]];
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/Unable to create a variant product with less than 2 variants/);
    });

    test("should fail if variants are not consistent to each other", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      let variants = variantsOK.map((t) =>
        t.map((x) => {
          return { ...x };
        })
      ); // Be sure to CLONE variantsOK with all its elements
      variants[0].push({
        type: "gender",
        option: "male"
      });
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
      variants = variantsOK.map((t) =>
        t.map((x) => {
          return { ...x };
        })
      ); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 1].push({
        type: "gender",
        option: "male"
      });
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
    });

    test("should fail if variants does not have the same list of types", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      let variants = variantsOK.map((t) =>
        t.map((x) => {
          return { ...x };
        })
      ); // Be sure to CLONE variantsOK with all its elements
      variants[0][0].type = "gender";
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `missing type ${"gender"} in variant ${JSON.stringify(variants[1])}`
      );
      variants = variantsOK.map((t) =>
        t.map((x) => {
          return { ...x };
        })
      ); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 1][0].type = "gender";
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `missing type ${variants[0][0].type} in variant ${JSON.stringify(
          variants[variants.length - 1]
        )}`
      );
    });

    test("should fail if some variants have the same option", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = variantsOK.map((t) =>
        t.map((x) => {
          return { ...x };
        })
      ); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 1][0].option = variants[0][0].option;
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant option value ${variants[0][0].option} for type ${variants[0][0].type}`
      );
    });

    test("each metadata should have its own offer uuid", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const metadatas = createVariantProductMetadata(
        productMetadata,
        variantsOK
      );

      expect(metadatas.length).toEqual(2);

      // We want each metadata to have its own offer uuid
      expect(metadatas[0].uuid).not.toEqual(metadatas[1].uuid);
    });

    test("each metadata should be based on the product metadata", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const metadatas = createVariantProductMetadata(
        productMetadata,
        variantsOK
      );

      expect(metadatas.length).toEqual(2);

      expect(metadatas[0]).toEqual({
        ...productMetadata,
        uuid: metadatas[0].uuid,
        variations: variantsOK[0]
      });

      expect(metadatas[1]).toEqual({
        ...productMetadata,
        uuid: metadatas[1].uuid,
        variations: variantsOK[1]
      });
    });
  });
});
