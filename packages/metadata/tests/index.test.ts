import { validateMetadata, AnyMetadata } from "../src/index";
import productV1ValidFullOffer from "./product-v1/valid/fullOffer.json";
import productV1ValidMinimalOffer from "./product-v1/valid/minimalOffer.json";

const productMissingArguments = [
  {
    arg: "schemaUrl",
    data: { schemaUrl: undefined },
    error: /schemaUrl is a required field/
  },
  {
    arg: "type",
    data: { type: undefined },
    error: /Metadata validation failed for unknown type/
  },
  {
    arg: "uuid",
    data: { uuid: undefined },
    error: /uuid is a required field/
  },
  {
    arg: "name",
    data: { name: undefined },
    error: /name is a required field/
  },
  {
    arg: "description",
    data: { description: undefined },
    error: /description is a required field/
  },
  {
    arg: "externalUrl",
    data: { externalUrl: undefined },
    error: /externalUrl is a required field/
  },
  {
    arg: "animationUrl",
    data: { animationUrl: undefined },
    error: undefined // don't check the error message
  },
  {
    arg: "licenseUrl",
    data: { licenseUrl: undefined },
    error: /licenseUrl is a required field/
  },
  {
    arg: "image",
    data: { image: undefined },
    error: /image is a required field/
  },
  {
    arg: "attributes",
    data: { attributes: undefined },
    error: /attributes is a required field/
  },
  {
    arg: "product",
    data: { product: undefined },
    error: undefined // don't check the error message
  },
  {
    arg: "shipping",
    data: { shipping: undefined },
    error: undefined // don't check the error message
  },
  {
    arg: "shipping.returnPeriod",
    data: { shipping: { returnPeriod: undefined } },
    error: /shipping.returnPeriod is a required field/
  },
  {
    arg: "exchangePolicy",
    data: { exchangePolicy: undefined },
    error: undefined // don't check the error message
  },
  {
    arg: "exchangePolicy.uuid",
    data: { exchangePolicy: { uuid: undefined } },
    error: /exchangePolicy.uuid is a required field/
  },
  {
    arg: "exchangePolicy.version",
    data: { exchangePolicy: { version: undefined } },
    error: /exchangePolicy.version is a required field/
  },
  {
    arg: "exchangePolicy.version not a number",
    data: { exchangePolicy: { version: "not_a_number" } },
    // eslint-disable-next-line no-useless-escape
    error: /exchangePolicy.version must be a \`number\` type/
  },
  {
    arg: "exchangePolicy.template",
    data: { exchangePolicy: { template: undefined } },
    error: /exchangePolicy.template is a required field/
  },
  {
    arg: "exchangePolicy.sellerContactMethod",
    data: { exchangePolicy: { sellerContactMethod: undefined } },
    error: /exchangePolicy.sellerContactMethod is a required field/
  },
  {
    arg: "exchangePolicy.disputeResolverContactMethod",
    data: { exchangePolicy: { disputeResolverContactMethod: undefined } },
    error: /exchangePolicy.disputeResolverContactMethod is a required field/
  },
  {
    arg: "product.uuid",
    data: { product: { uuid: undefined } },
    error: /product.uuid is a required field/
  },
  {
    arg: "product.version",
    data: { product: { version: undefined } },
    error: /product.version is a required field/
  },
  {
    arg: "product.version not a number",
    data: { product: { version: "not_a_number" } },
    // eslint-disable-next-line no-useless-escape
    error: /product.version must be a \`number\` type/
  },
  {
    arg: "product.title",
    data: { product: { title: undefined } },
    error: /product.title is a required field/
  },
  {
    arg: "product.description",
    data: { product: { description: undefined } },
    error: /product.description is a required field/
  },
  {
    arg: "product.productionInformation_brandName",
    data: { product: { productionInformation_brandName: undefined } },
    error: /product.productionInformation_brandName is a required field/
  },
  {
    arg: "product.details_offerCategory",
    data: { product: { details_offerCategory: undefined } },
    error: /product.details_offerCategory is a required field/
  },
  {
    arg: "product.visuals_images",
    data: { product: { visuals_images: undefined } },
    error: /product.visuals_images is a required field/
  },
  {
    arg: "variations[x].type",
    data: { variations: [{ option: "anOption" }] },
    error: /variations\[0\].type is a required field/
  },
  {
    arg: "variations[x].option",
    data: { variations: [{ type: "aType" }] },
    error: /variations\[0\].option is a required field/
  },
  {
    arg: "seller.images[x].url",
    data: { seller: { images: [{ tag: "aTag" }] } },
    error: /seller.images\[0\].url is a required field/
  },
  {
    arg: "seller",
    data: { seller: undefined },
    error: undefined // don't check the error message
  },
  {
    arg: "seller.defaultVersion",
    data: { seller: { defaultVersion: undefined } },
    error: /seller.defaultVersion is a required field/
  },
  {
    arg: "seller.contactLinks",
    data: { seller: { contactLinks: undefined } },
    error: /seller.contactLinks is a required field/
  },
  {
    arg: "seller.name",
    data: { seller: { name: undefined } },
    error: /seller.name is a required field/
  },
  // {
  //   arg: "seller.contactLinks empty array",
  //   data: { seller: { defaultVersion: 1, contactLinks: [] } },
  //   error: undefined // don't check the error message
  // }, // it should fail because minItems is set to 1 (does not work as expected...)
  {
    arg: "seller.contactLinks[x].url",
    data: { seller: { contactLinks: [{ tag: "aTag" }] } },
    error: /seller.contactLinks\[0\].url is a required field/
  },
  {
    arg: "seller.contactLinks[x].tag",
    data: { seller: { contactLinks: [{ url: "example.com" }] } },
    error: /seller.contactLinks\[0\].tag is a required field/
  },
  {
    arg: "shipping.supportedJurisdictions[x].label",
    data: {
      shipping: { supportedJurisdictions: [{ deliveryTime: "very soon" }] }
    },
    error: /shipping.supportedJurisdictions\[0\].label is a required field/
  },
  {
    arg: "shipping.supportedJurisdictions[x].deliveryTime",
    data: {
      shipping: { supportedJurisdictions: [{ label: "aLabel" }] }
    },
    error:
      /shipping.supportedJurisdictions\[0\].deliveryTime is a required field/
  }
  // {
  //   arg: "attributes",
  //   data: {
  //     attributes: [
  //       {
  //         trait_type: "Offer Category",
  //         value: "PHYSICAL"
  //       }
  //     ]
  //   },
  //   error: undefined // don't check the error message
  // } // it should fail because minItems is set to 2 (does not work as expected...)

  // {
  //   arg: "product.visuals.images",
  //   data: { product: { visuals: { images: [] } } },
  //   error: undefined // don't check the error message
  // } // it should fail because minItems is set to 1 (does not work as expected...)

  // {
  //   arg: "seller",
  //   data: { seller: undefined },
  //   error: /seller is a required field/
  // } // it should fail because seller is a required field (not as expected)
];

describe("#validateMetadata()", () => {
  test("throw for invalid type", () => {
    expect(() =>
      validateMetadata({
        type: "invalid"
      } as any as AnyMetadata)
    ).toThrow();
  });

  describe("BASE", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "BASE"
        } as unknown as AnyMetadata)
      ).toThrow();
    });

    test("not throw for valid object", () => {
      expect(
        validateMetadata({
          schemaUrl: "example.com",
          type: "BASE",
          name: "name",
          description: "description",
          externalUrl: "example.com",
          animationUrl: "animationUrl.com",
          licenseUrl: "license.com"
        })
      ).toBeTruthy();
    });
  });

  describe("PRODUCT_V1", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "PRODUCT_V1"
        } as unknown as AnyMetadata)
      ).toThrow();
    });

    test("not throw for full offer", () => {
      expect(
        validateMetadata(productV1ValidFullOffer as unknown as AnyMetadata)
      ).toBeTruthy();
    });

    test("not throw for minimal offer", () => {
      expect(
        validateMetadata(productV1ValidMinimalOffer as unknown as AnyMetadata)
      ).toBeTruthy();
    });

    test.each(productMissingArguments)(
      "throw for missing argument '$arg'",
      ({ data, error }) => {
        const product = (data as any).product
          ? {
              ...productV1ValidFullOffer,
              ...data,
              product: {
                ...productV1ValidFullOffer.product,
                ...(data as any).product
              }
            }
          : (data as any).exchangePolicy
          ? {
              ...productV1ValidFullOffer,
              ...data,
              exchangePolicy: {
                ...productV1ValidFullOffer.exchangePolicy,
                ...(data as any).exchangePolicy
              }
            }
          : {
              ...productV1ValidFullOffer,
              ...data
            };
        const result = expect(() =>
          validateMetadata(product as any as AnyMetadata)
        );
        if (error) {
          result.toThrow(error);
        }
      }
    );

    xtest("throw if missing 'Redeemable Until' attribute", () => {
      const attributes = productV1ValidFullOffer.attributes.map((attr) => {
        if (attr.trait_type === "Redeemable Until") {
          return {
            ...attr,
            trait_type: "XXXXXX"
          };
        }
        return attr;
      });
      expect(() =>
        validateMetadata({
          ...productV1ValidFullOffer,
          attributes
        } as any as AnyMetadata)
      ).toThrow();
    });

    xtest("throw if missing 'Offer Category' attribute", () => {
      const attributes = productV1ValidFullOffer.attributes.map((attr) => {
        if (attr.trait_type === "Offer Category") {
          return {
            ...attr,
            trait_type: "XXXXXX"
          };
        }
        return attr;
      });
      expect(() =>
        validateMetadata({
          ...productV1ValidFullOffer,
          attributes
        } as any as AnyMetadata)
      ).toThrow();
    });
  });
});
