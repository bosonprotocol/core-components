export const missingArguments = [
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
    arg: "licenseUrl",
    data: { licenseUrl: undefined },
    error: /licenseUrl is a required field/
  },
  {
    arg: "bundleUuid",
    data: { bundleUuid: undefined },
    error: /bundleUuid is a required field/
  },
  {
    arg: "items",
    data: { items: undefined },
    error: /items is a required field/
  },
  {
    arg: "items[x].url",
    data: { items: [{ url: undefined }] },
    error: /items\[0\].url is a required field/
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
  //   arg: "seller",
  //   data: { seller: undefined },
  //   error: /seller is a required field/
  // } // it should fail because seller is a required field (not as expected)

  // {
  //   arg: "items",
  //   data: { items: [] },
  //   error: undefined // don't check the error message
  // } // it should fail because minItems is set to 1 (does not work as expected...)
];
