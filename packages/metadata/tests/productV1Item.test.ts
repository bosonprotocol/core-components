import {
  createVariantProductItem,
  ProductBase,
  ProductV1Item,
  ProductV1Variant
} from "../src/productV1Item";
import productV1ItemValidMinimal from "./product-v1-item/valid/minimal.json";

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

describe("#productV1Item tests", () => {
  describe("createVariantProductItem()", () => {
    test("should fail if the productItem already have variations", async () => {
      const productItem: ProductV1Item = {
        ...productV1ItemValidMinimal,
        variations: [
          {
            type: types[0],
            option: options[types[0]][0]
          }
        ]
      } as unknown as ProductV1Item;
      expect(() => createVariantProductItem(productItem, variantsOK)).toThrow(
        /Unable to create variant product Item from an already existing variation/
      );
    });

    test("should fail if less than 2 variants are specified", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      let variants: Array<{ productVariant: ProductV1Variant }> = [];
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /Unable to create a variant product with less than 2 variants/
      );
      variants = [variantsOK[0]];
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /Unable to create a variant product with less than 2 variants/
      );
    });

    test("should fail if variants are not consistent to each other", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /variants are not consistent to each other/
      );
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /variants are not consistent to each other/
      );
    });

    test("should fail if variants are not consistent to each other - unordered variants table", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      variants[0].productVariant = disorderVariantTable(
        variants[0].productVariant
      );
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /variants are not consistent to each other/
      );
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /variants are not consistent to each other/
      );
    });

    test("should fail if variants are not consistent to each other - unordered variants structure", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant.push({
        type: "gender",
        option: "male"
      });
      variants[0].productVariant = disorderVariantStruct(
        variants[0].productVariant
      );
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /variants are not consistent to each other/
      );
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant.push({
        type: "gender",
        option: "male"
      });
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        /variants are not consistent to each other/
      );
    });

    test("should fail if variants does not have the same list of types", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      let variants = cloneVariants(variantsOK);
      variants[0].productVariant[0].type = "gender";
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        `missing type ${"gender"} in variant ${serializeVariant(
          variants[1].productVariant
        )}`
      );
      variants = cloneVariants(variantsOK);
      variants[variants.length - 1].productVariant[0].type = "gender";
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        `missing type ${
          variants[0].productVariant[0].type
        } in variant ${serializeVariant(
          variants[variants.length - 1].productVariant
        )}`
      );
    });

    test("should fail if some variants have the same option", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const variants = cloneVariants(variantsOK);
      // Set the last variant equal to the first variant
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        `Redundant variant ${serializeVariant(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option - unordered variants table", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const variants = cloneVariants(variantsOK);
      // Set the last variant equal to the first variant
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      variants[0].productVariant = disorderVariantTable(
        variants[0].productVariant
      );
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        `Redundant variant ${serializeVariant(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option - unordered variants structure", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const variants = cloneVariants(variantsOK);
      // Set the last variant equal to the first variant
      variants[variants.length - 1].productVariant = [
        ...variants[0].productVariant
      ];
      variants[0].productVariant = disorderVariantStruct(
        variants[0].productVariant
      );
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        `Redundant variant ${serializeVariant(variants[0].productVariant)}`
      );
    });

    test("should fail if some variants have the same option (bis)", async () => {
      // The previous test is setting the last variants equals to the first one, to create a redundancy.
      // This other test just does the same thing but between the second and the penultimate
      //  (last but one), just to verify the algorithm is not only working for the 1st one !
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const variants = cloneVariants(variantsOK);
      // Set the penultimate variant equal to the second variant (only works when variants.length >= 4)
      expect(variants.length).toBeGreaterThanOrEqual(4);
      variants[variants.length - 2].productVariant = [
        ...variants[1].productVariant
      ];
      expect(() => createVariantProductItem(productItem, variants)).toThrow(
        `Redundant variant ${serializeVariant(variants[1].productVariant)}`
      );
    });

    test("should NOT fail if the variants table is unordered ", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const variants = cloneVariants(variantsOK);
      variants[0].productVariant = disorderVariantTable(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductItem(productItem, variants)
      ).not.toThrow();
    });

    test("should NOT fail if the variants structure is unordered ", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const variants = cloneVariants(variantsOK);
      variants[0].productVariant = disorderVariantStruct(
        variants[0].productVariant
      );
      expect(() =>
        createVariantProductItem(productItem, variants)
      ).not.toThrow();
    });

    test("each metadata should have its own offer uuid", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const metadatas = createVariantProductItem(productItem, variantsOK);

      expect(metadatas.length).toEqual(variantsOK.length);

      // We want each metadata to have its own offer uuid
      expect(metadatas[0].uuid).not.toEqual(metadatas[1].uuid);
    });

    test("each metadata should be based on the product metadata", async () => {
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const metadatas = createVariantProductItem(productItem, variantsOK);

      expect(metadatas.length).toEqual(variantsOK.length);
      for (let i = 0; i < variantsOK.length; i++) {
        expect(metadatas[i]).toEqual({
          ...productItem,
          uuid: metadatas[i].uuid,
          variations: variantsOK[i].productVariant
        });
      }
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
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const metadatas = createVariantProductItem(
        productItem,
        variantsWithOverrides
      );

      expect(metadatas.length).toEqual(variantsOK.length);

      for (let index = 0; index < variantsOK.length; index++) {
        expect(metadatas[index]).toEqual({
          ...productItem,
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
      const productItem = productV1ItemValidMinimal as unknown as ProductV1Item;
      const metadatas = createVariantProductItem(
        productItem,
        variantsWithOverrides
      );

      expect(metadatas.length).toEqual(variantsOK.length);

      for (let i = 0; i < variantsOK.length; i++) {
        expect(metadatas[i]).toEqual({
          ...productItem,
          uuid: metadatas[i].uuid,
          variations: variantsOK[i].productVariant,
          productOverrides: productOverrides[i]
        });
      }
    });
  });
});
