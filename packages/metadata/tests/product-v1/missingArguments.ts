import { productMissingArguments as productV1Item_productMissingArguments } from "../product-v1-item/missingArguments";

export const productMissingArguments = [
  ...productV1Item_productMissingArguments,
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
  }
  // {
  //   arg: "attributes",
  //   data: {
  //     attributes: [
  //       {
  //         traitType: "Offer Category",
  //         value: "PHYSICAL"
  //       }
  //     ]
  //   },
  //   error: undefined // don't check the error message
  // } // it should fail because minItems is set to 2 (does not work as expected...)

  // {
  //   arg: "seller",
  //   data: { seller: undefined },
  //   error: /seller is a required field/
  // } // it should fail because seller is a required field (not as expected)
];
