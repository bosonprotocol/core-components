import {
  createVariantProductMetadata,
  ProductV1Variant,
  ProductBase,
  ProductV1Metadata
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

function serializeVariant(variant: ProductV1Variant): string {
  // Be sure each variation structure has its keys ordered
  const orderedStruct = variant.map((variation) =>
    Object.keys(variation)
      .sort()
      .reduce((obj, key) => {
        obj[key] = variation[key];
        return obj;
      }, {})
  ) as ProductV1Variant;
  // Be sure each variation in the table is ordered per type
  const orderedTable = orderedStruct.sort((a, b) =>
    a.type.localeCompare(b.type)
  );
  return JSON.stringify(orderedTable);
}

function cloneVariants(
  variants: Array<{
    productVariant: ProductV1Variant;
    productOverrides?: unknown;
  }>
): Array<{
  productVariant: ProductV1Variant;
  productOverrides?: Partial<ProductBase>;
}> {
  return variants.map((t) => {
    return {
      productVariant: t.productVariant.map((x) => {
        return { ...x };
      })
    };
  }); // Be sure to CLONE variants with all its elements
}

function disorderVariantStruct(
  variant: ProductV1Variant,
  index = 0
): ProductV1Variant {
  const disorderedVariant = variant.map((variation, i) => {
    if (i === index) {
      return {
        option: variation.option,
        type: variation.type
      };
    }
    return {
      type: variation.type,
      option: variation.option
    };
  });
  return disorderedVariant;
}

function disorderVariantTable(
  variant: ProductV1Variant,
  index = 0
): ProductV1Variant {
  const disorderedVariant = variant.map((x) => {
    return { ...x };
  });
  const index2 = (index + 1) % variant.length;
  disorderedVariant[index] = variant[index2];
  disorderedVariant[index2] = variant[index];
  return disorderedVariant;
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
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
    });

    test("should fail if variants are not consistent to each other - disordered variants table", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      variants[0].productVariant = disorderVariantTable(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
    });

    test("should fail if variants are not consistent to each other - disordered variants structure", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      variants[0].productVariant = disorderVariantStruct(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(/variants are not consistent to each other/);
      variants = cloneVariants(variantsOK);
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
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant[0].type = "gender";
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `missing type ${"gender"} in variant ${serializeVariant(
          variants[1].productVariant
        )}`
      );
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant[0].type = "gender";
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `missing type ${
          variants[0].productVariant[0].type
        } in variant ${serializeVariant(
          variants[variants.length - 1].productVariant
        )}`
      );
    });

    test("should fail if some variants have the same option", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = cloneVariants(variantsOK);
      // Set the last variant equal to the first variant
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant variant ${serializeVariant(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option - disordered variants table", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = cloneVariants(variantsOK);
      // Set the last variant equal to the first variant
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      variants[0].productVariant = disorderVariantTable(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant variant ${serializeVariant(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option - disordered variants structure", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = cloneVariants(variantsOK);
      // Set the last variant equal to the first variant
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      variants[0].productVariant = disorderVariantStruct(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant variant ${serializeVariant(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option (bis)", async () => {
      // The previous test is setting the last variants equals to the first one, to create a redundancy.
      // This other test just does the same thing but between the second and the penultimate
      //  (last but one), just to verify the algorithm is not only working for the 1st one !
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = cloneVariants(variantsOK);
      // Set the penultimate variant equal to the second variant (only works when variants.length >= 4)
      expect(variants.length).toBeGreaterThanOrEqual(4);
      variants[variants.length - 2].productVariant = [
        ...variants[1].productVariant
      ];
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).toThrow(
        `Redundant variant ${serializeVariant(variants[1].productVariant)}`
      );
    });

    test("should NOT fail if the variants table is disordered ", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = cloneVariants(variantsOK);
      variants[0].productVariant = disorderVariantTable(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).not.toThrow();
    });

    test("should NOT fail if the variants structure is disordered ", async () => {
      const productMetadata =
        productV1ValidMinimalOffer as unknown as ProductV1Metadata;
      const variants = cloneVariants(variantsOK);
      variants[0].productVariant = disorderVariantStruct(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductMetadata(productMetadata, variants)
      ).not.toThrow();
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
        variations: variantsOK[0].productVariant,
        attributes: [
          ...productMetadata.attributes,
          ...variantsOK[0].productVariant.map((variant) => ({
            trait_type: variant.type,
            value: variant.option
          }))
        ]
      });

      expect(metadatas[1]).toEqual({
        ...productMetadata,
        uuid: metadatas[1].uuid,
        variations: variantsOK[1].productVariant,
        attributes: [
          ...productMetadata.attributes,
          ...variantsOK[1].productVariant.map((variant) => ({
            trait_type: variant.type,
            value: variant.option
          }))
        ]
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
          productOverrides: productOverrides[index],
          attributes: [
            ...productMetadata.attributes,
            ...variantsOK[index].productVariant.map((variant) => ({
              trait_type: variant.type,
              value: variant.option
            }))
          ]
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
        variations: variantsOK[0].productVariant,
        attributes: [
          ...productMetadata.attributes,
          ...variantsOK[0].productVariant.map((variant) => ({
            trait_type: variant.type,
            value: variant.option
          }))
        ]
      });

      expect(metadatas[1]).toEqual({
        ...productMetadata,
        uuid: metadatas[1].uuid,
        variations: variantsOK[1].productVariant,
        productOverrides: productOverrides[1],
        attributes: [
          ...productMetadata.attributes,
          ...variantsOK[1].productVariant.map((variant) => ({
            trait_type: variant.type,
            value: variant.option
          }))
        ]
      });
    });
  });
});
