import { ProductV1Metadata } from "@bosonprotocol/metadata/dist/cjs/product-v1";
import {
  createVariantProductMetadata,
  ProductV1Variant
} from "../src/product-v1";
import productV1ValidMinimalOffer from "./product-v1/valid/minimalOffer.json";

const types = ["size", "color"];
const options = {
  size: ["S", "M", "L"],
  color: ["red", "blue"]
};
const variantsOK: Array<{
  productVariant: ProductV1Variant;
  productOverrides?: Partial<unknown>;
}> = [];
for (const size of options.size) {
  for (const color of options.color) {
    variantsOK.push({
      productVariant: [
        {
          type: "size",
          option: size
        },
        {
          type: "color",
          option: color
        }
      ]
    });
  }
}

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
      let variants: Array<{ productVariant: ProductV1Variant }> = [];
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
      let variants = variantsOK.map((t) => {
        return {
          productVariant: t.productVariant.map((x) => {
            return { ...x };
          })
        };
      }); // Be sure to CLONE variantsOK with all its elements
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
      variants = variantsOK.map((t) => {
        return {
          productVariant: t.productVariant.map((x) => {
            return { ...x };
          })
        };
      }); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 1].productVariant.push({
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
      let variants = variantsOK.map((t) => {
        return {
          productVariant: t.productVariant.map((x) => {
            return { ...x };
          })
        };
      }); // Be sure to CLONE variantsOK with all its elements
      variants[0].productVariant[0].type = "gender";
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `missing type ${"gender"} in variant ${JSON.stringify(
          variants[1].productVariant
        )}`
      );
      variants = variantsOK.map((t) => {
        return {
          productVariant: t.productVariant.map((x) => {
            return { ...x };
          })
        };
      }); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 1].productVariant[0].type = "gender";
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `missing type ${
          variants[0].productVariant[0].type
        } in variant ${JSON.stringify(
          variants[variants.length - 1].productVariant
        )}`
      );
    });

    test("should fail if some variants have the same option", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = variantsOK.map((t) => {
        return {
          productVariant: t.productVariant.map((x) => {
            return { ...x };
          })
        };
      }); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant variant ${JSON.stringify(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option (bis)", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = variantsOK.map((t) => {
        return {
          productVariant: t.productVariant.map((x) => {
            return { ...x };
          })
        };
      }); // Be sure to CLONE variantsOK with all its elements
      variants[variants.length - 2].productVariant = [
        ...variants[1].productVariant
      ];
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant variant ${JSON.stringify(variants[1].productVariant)}`
      );
    });

    test("each metadata should have its own offer uuid", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const metadatas = createVariantProductMetadata(
        productMetadata,
        variantsOK
      );

      expect(metadatas.length).toEqual(variantsOK.length);

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

      expect(metadatas.length).toEqual(variantsOK.length);

      expect(metadatas[0]).toEqual({
        ...productMetadata,
        uuid: metadatas[0].uuid,
        variations: variantsOK[0].productVariant
      });

      expect(metadatas[1]).toEqual({
        ...productMetadata,
        uuid: metadatas[1].uuid,
        variations: variantsOK[1].productVariant
      });
    });
    test("add productOverrides to the metadata", async () => {
      const productOverrides = [
        {
          visuals_images: [
            {
              url: "another image"
            }
          ]
        },
        {
          title: "another title"
        }
      ];
      const variantsWithOverrides = variantsOK.map((v, index) => {
        return { ...v, productOverrides: productOverrides[index] };
      });
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const metadatas = createVariantProductMetadata(
        productMetadata,
        variantsWithOverrides
      );

      expect(metadatas.length).toEqual(variantsOK.length);

      for (let index = 0; index < variantsOK.length; index++) {
        expect(metadatas[index]).toEqual({
          ...productMetadata,
          uuid: metadatas[index].uuid,
          variations: variantsOK[index].productVariant,
          productOverrides: productOverrides[index]
        });
      }
    });
    test("add optional productOverrides to the metadata", async () => {
      const productOverrides = [
        undefined, // no overrides for the 1st variant
        {
          title: "another title"
        }
      ];
      const variantsWithOverrides = variantsOK.map((v, index) => {
        return { ...v, productOverrides: productOverrides[index] };
      });
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const metadatas = createVariantProductMetadata(
        productMetadata,
        variantsWithOverrides
      );

      expect(metadatas.length).toEqual(variantsOK.length);

      expect(metadatas[0]).toEqual({
        ...productMetadata,
        uuid: metadatas[0].uuid,
        variations: variantsOK[0].productVariant
      });

      expect(metadatas[1]).toEqual({
        ...productMetadata,
        uuid: metadatas[1].uuid,
        variations: variantsOK[1].productVariant,
        productOverrides: productOverrides[1]
      });
    });
  });
});
