export const productMissingArguments = [
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
  //   arg: "product.visuals.images",
  //   data: { product: { visuals: { images: [] } } },
  //   error: undefined // don't check the error message
  // } // it should fail because minItems is set to 1 (does not work as expected...)
];
