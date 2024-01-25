/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  validateMetadata,
  AnyMetadata,
  productV1,
  productV1Item,
  nftItem,
  bundle,
  rNFT
} from "../src/index";
import productV1ValidFullOffer from "./product-v1/valid/fullOffer.json";
import productV1ValidMinimalOffer from "./product-v1/valid/minimalOffer.json";
import { productMissingArguments as productV1_productMissingArguments } from "./product-v1/missingArguments";
import productV1ItemValidMinimal from "./product-v1-item/valid/minimal.json";
import productV1ItemValidFull from "./product-v1-item/valid/full.json";
import { productMissingArguments as productV1Item_productMissingArguments } from "./product-v1-item/missingArguments";
import nftItemValidMinimal from "./nft-item/valid/minimal.json";
import nftItemValidFull from "./nft-item/valid/full.json";
import { missingArguments as nftItemMissingArguments } from "./nft-item/missingArguments";
import bundleValidMinimal from "./bundle/valid/minimal.json";
import bundleValidFull from "./bundle/valid/full.json";
import { missingArguments as bundleMissingArguments } from "./bundle/missingArguments";
import rNFTValidMinimal from "./rNFT/valid/minimal.json";
import rNFTValidFull from "./rNFT/valid/full.json";
import { missingArguments as rNFTMissingArguments } from "./rNFT/missingArguments";
import cloneDeep from "clone-deep";

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

    test("throw for too long value", () => {
      expect(() =>
        validateMetadata({
          schemaUrl: "example.com",
          type: "BASE",
          name: "name",
          description: "description",
          externalUrl: new Array(10000).join(","),
          animationUrl: "animationUrl.com",
          licenseUrl: "license.com"
        } as any as AnyMetadata)
      ).toThrow("Key externalUrl of metadata exceeds 2048 characters");
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

    test("throw for too long value", () => {
      const metadata = cloneDeep(
        productV1ValidFullOffer as unknown as productV1.ProductV1Metadata
      );

      const imageIndex = metadata.product.visuals_images.length;
      metadata.product.visuals_images.push({
        url: new Array(10000).join(",")
      });
      expect(() => validateMetadata(metadata)).toThrow(
        `Key product.visuals_images.${imageIndex}.url of metadata exceeds 2048 characters`
      );
    });

    test.each(productV1_productMissingArguments)(
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
        if (attr.traitType === "Redeemable Until") {
          return {
            ...attr,
            traitType: "XXXXXX"
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
        if (attr.traitType === "Offer Category") {
          return {
            ...attr,
            traitType: "XXXXXX"
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

  describe("PRODUCT_V1_ITEM", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "PRODUCT_V1_ITEM"
        } as unknown as AnyMetadata)
      ).toThrow();
    });
    test("not throw for full metadata schema", () => {
      expect(
        validateMetadata(productV1ItemValidFull as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("not throw for minimal metadata schema", () => {
      expect(
        validateMetadata(productV1ItemValidMinimal as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("throw for too long value", () => {
      const metadata = cloneDeep(
        productV1ItemValidFull as unknown as productV1Item.ProductV1Item
      );

      const imageIndex = metadata.product.visuals_images.length;
      metadata.product.visuals_images.push({
        url: new Array(10000).join(",")
      });
      expect(() => validateMetadata(metadata)).toThrow(
        `Key product.visuals_images.${imageIndex}.url of metadata exceeds 2048 characters`
      );
    });
    test.each(productV1Item_productMissingArguments)(
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
  });

  describe("NFT_ITEM", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "ITEM_NFT"
        } as unknown as AnyMetadata)
      ).toThrow();
    });
    test("not throw for full metadata schema", () => {
      expect(
        validateMetadata(nftItemValidFull as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("not throw for minimal metadata schema", () => {
      expect(
        validateMetadata(nftItemValidMinimal as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("throw for too long value", () => {
      const metadata = cloneDeep(
        nftItemValidFull as unknown as nftItem.NftItem
      ) as nftItem.NftItem;

      metadata.animationUrl = new Array(10000).join(",");
      expect(() => validateMetadata(metadata)).toThrow(
        `Key animationUrl of metadata exceeds 2048 characters`
      );
    });
    test.each(nftItemMissingArguments)(
      "throw for missing argument '$arg'",
      ({ data, error }) => {
        const metadata = {
          ...nftItemValidFull,
          ...data
        };
        const result = expect(() =>
          validateMetadata(metadata as any as AnyMetadata)
        );
        if (error) {
          result.toThrow(error);
        }
      }
    );
  });

  describe("BUNDLE", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "BUNDLE"
        } as unknown as AnyMetadata)
      ).toThrow();
    });
    test("not throw for full metadata schema", () => {
      expect(
        validateMetadata(bundleValidFull as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("not throw for minimal metadata schema", () => {
      expect(
        validateMetadata(bundleValidMinimal as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("throw for too long value", () => {
      const metadata = cloneDeep(
        bundleValidFull as unknown as bundle.BundleMetadata
      ) as bundle.BundleMetadata;

      metadata.animationUrl = new Array(10000).join(",");
      expect(() => validateMetadata(metadata)).toThrow(
        `Key animationUrl of metadata exceeds 2048 characters`
      );
    });
    test.each(bundleMissingArguments)(
      "throw for missing argument '$arg'",
      ({ data, error }) => {
        const metadata = {
          ...bundleValidFull,
          ...data
        };
        const result = expect(() =>
          validateMetadata(metadata as any as AnyMetadata)
        );
        if (error) {
          result.toThrow(error);
        }
      }
    );
  });

  describe("rNFT", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "rNFT"
        } as unknown as AnyMetadata)
      ).toThrow();
    });
    test("not throw for full metadata schema", () => {
      expect(
        validateMetadata(rNFTValidFull as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("not throw for minimal metadata schema", () => {
      expect(
        validateMetadata(rNFTValidMinimal as unknown as AnyMetadata)
      ).toBeTruthy();
    });
    test("throw for too long value", () => {
      const metadata = cloneDeep(
        rNFTValidFull as unknown as rNFT.RNftMetadata
      ) as rNFT.RNftMetadata;

      metadata.animationUrl = new Array(10000).join(",");
      expect(() => validateMetadata(metadata)).toThrow(
        `Key animationUrl of metadata exceeds 2048 characters`
      );
    });
    test.each(rNFTMissingArguments)(
      "throw for missing argument '$arg'",
      ({ data, error }) => {
        const metadata = {
          ...rNFTValidFull,
          ...data
        };
        const result = expect(() =>
          validateMetadata(metadata as any as AnyMetadata)
        );
        if (error) {
          result.toThrow(error);
        }
      }
    );
  });
});
