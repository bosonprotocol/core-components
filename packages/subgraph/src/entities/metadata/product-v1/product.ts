import { JSONValue, TypedMap, BigInt } from "@graphprotocol/graph-ts";
import {
  ProductV1Product,
  ProductV1Brand,
  ProductV1Category,
  ProductV1Tag,
  ProductV1Section,
  ProductV1Personalisation,
  ProductV1ProductOverrides,
  Offer,
  ProductV1Variant
} from "../../../../generated/schema";

import {
  convertToInt,
  convertToObjectArray,
  convertToString,
  convertToStringArray
} from "../../../utils/json";
import { saveProductV1Medias } from "./media";

export function getProductId(uuid: string, version: string): string {
  return `${uuid}-${version}`;
}

export function getProductOverridesId(
  productId: string,
  overridesVersion: string
): string {
  return `${productId}-overrides-${overridesVersion}`;
}

export function getCategoryId(categoryName: string): string {
  return categoryName.toLowerCase();
}

export function getBrandId(brandName: string): string {
  return brandName.toLowerCase();
}

export function getTagId(tagName: string): string {
  return tagName.toLowerCase();
}

export function getPersonalisationId(personalisationName: string): string {
  return personalisationName.toLowerCase();
}

export function getSectionId(section: string): string {
  return section.toLowerCase();
}

export function saveProductV1ProductOrOverrides(
  productOrOverrideObj: TypedMap<string, JSONValue> | null,
  productV1SellerId: string | null,
  isOverride: boolean,
  variant: string | null,
  offer: Offer
): string | null {
  if (productOrOverrideObj === null) {
    return null;
  }

  const uuid = convertToString(productOrOverrideObj.get("uuid"));
  const version = convertToInt(productOrOverrideObj.get("version"));
  const title = convertToString(productOrOverrideObj.get("title"));
  const description = convertToString(productOrOverrideObj.get("description"));

  const identification_sKU = convertToString(
    productOrOverrideObj.get("identification_sKU")
  );
  const identification_productId = convertToString(
    productOrOverrideObj.get("identification_productId")
  );
  const identification_productIdType = convertToString(
    productOrOverrideObj.get("identification_productIdType")
  );

  const productionInformation_brandName = convertToString(
    productOrOverrideObj.get("productionInformation_brandName")
  );
  const savedBrandId = saveProductV1Brand(productionInformation_brandName);
  const productionInformation_manufacturer = convertToString(
    productOrOverrideObj.get("productionInformation_manufacturer")
  );
  const productionInformation_manufacturerPartNumber = convertToString(
    productOrOverrideObj.get("productionInformation_manufacturerPartNumber")
  );
  const productionInformation_modelNumber = convertToString(
    productOrOverrideObj.get("productionInformation_modelNumber")
  );
  const productionInformation_materials = convertToStringArray(
    productOrOverrideObj.get("productionInformation_materials")
  );

  const details_category = convertToString(
    productOrOverrideObj.get("details_category")
  );
  const savedCategoryId = saveProductV1Category(details_category);
  const details_subCategory = convertToString(
    productOrOverrideObj.get("details_subCategory")
  );
  const savedSubCategoryId = saveProductV1Category(details_subCategory);
  const details_subCategory2 = convertToString(
    productOrOverrideObj.get("details_subCategory2")
  );
  const savedSubCategory2Id = saveProductV1Category(details_subCategory2);
  const details_offerCategory = convertToString(
    productOrOverrideObj.get("details_offerCategory")
  );
  const details_tags = convertToStringArray(
    productOrOverrideObj.get("details_tags")
  );
  const savedTagIds = saveProductV1Tags(details_tags);
  const details_sections = convertToStringArray(
    productOrOverrideObj.get("details_sections")
  );
  const savedSectionIds = saveProductV1Sections(details_sections);
  const details_personalisation = convertToStringArray(
    productOrOverrideObj.get("details_personalisation")
  );
  const savedPersonalisationIds = saveProductV1Personalisation(
    details_personalisation
  );

  const visuals_images = convertToObjectArray(
    productOrOverrideObj.get("visuals_images")
  );
  const savedImageIds = saveProductV1Medias(visuals_images, "IMAGE");
  const visuals_videos = convertToObjectArray(
    productOrOverrideObj.get("visuals_videos")
  );
  const savedVideoIds = saveProductV1Medias(visuals_videos, "VIDEO");

  const packaging_packageQuantity = convertToString(
    productOrOverrideObj.get("packaging_packageQuantity")
  );
  const packaging_dimensions_length = convertToString(
    productOrOverrideObj.get("packaging_dimensions_length")
  );
  const packaging_dimensions_width = convertToString(
    productOrOverrideObj.get("packaging_dimensions_width")
  );
  const packaging_dimensions_height = convertToString(
    productOrOverrideObj.get("packaging_dimensions_height")
  );
  const packaging_dimensions_unit = convertToString(
    productOrOverrideObj.get("packaging_dimensions_unit")
  );
  const packaging_weight_value = convertToString(
    productOrOverrideObj.get("packaging_weight_value")
  );
  const packaging_weight_unit = convertToString(
    productOrOverrideObj.get("packaging_weight_unit")
  );

  if (!isOverride) {
    return saveProductV1Product(
      uuid,
      version,
      title,
      description,
      identification_sKU,
      identification_productId,
      identification_productIdType,
      productionInformation_brandName,
      savedBrandId,
      productionInformation_manufacturer,
      productionInformation_manufacturerPartNumber,
      productionInformation_modelNumber,
      productionInformation_materials,
      details_category,
      savedCategoryId,
      details_subCategory,
      savedSubCategoryId,
      details_subCategory2,
      savedSubCategory2Id,
      details_offerCategory,
      details_tags,
      savedTagIds,
      details_sections,
      savedSectionIds,
      details_personalisation,
      savedPersonalisationIds,
      savedImageIds,
      savedVideoIds,
      packaging_packageQuantity,
      packaging_dimensions_length,
      packaging_dimensions_width,
      packaging_dimensions_height,
      packaging_dimensions_unit,
      packaging_weight_value,
      packaging_weight_unit,
      productV1SellerId,
      variant,
      offer
    );
  }

  return saveProductV1ProductOverrides(
    getProductId(uuid, version.toString()),
    version,
    title,
    description,
    identification_sKU,
    identification_productId,
    identification_productIdType,
    productionInformation_brandName,
    savedBrandId,
    productionInformation_manufacturer,
    productionInformation_manufacturerPartNumber,
    productionInformation_modelNumber,
    productionInformation_materials,
    savedImageIds,
    savedVideoIds,
    packaging_packageQuantity,
    packaging_dimensions_length,
    packaging_dimensions_width,
    packaging_dimensions_height,
    packaging_dimensions_unit,
    packaging_weight_value,
    packaging_weight_unit
  );
}

function saveProductV1Product(
  uuid: string,
  version: i32,
  title: string,
  description: string,
  identification_sKU: string,
  identification_productId: string,
  identification_productIdType: string,
  productionInformation_brandName: string,
  savedBrandId: string,
  productionInformation_manufacturer: string,
  productionInformation_manufacturerPartNumber: string,
  productionInformation_modelNumber: string,
  productionInformation_materials: string[],
  details_category: string,
  savedCategoryId: string,
  details_subCategory: string,
  savedSubCategoryId: string,
  details_subCategory2: string,
  savedSubCategory2Id: string,
  details_offerCategory: string,
  details_tags: string[],
  savedTagIds: string[],
  details_sections: string[],
  savedSectionIds: string[],
  details_personalisation: string[],
  savedPersonalisationIds: string[],
  savedImageIds: string[],
  savedVideoIds: string[],
  packaging_packageQuantity: string,
  packaging_dimensions_length: string,
  packaging_dimensions_width: string,
  packaging_dimensions_height: string,
  packaging_dimensions_unit: string,
  packaging_weight_value: string,
  packaging_weight_unit: string,
  productV1SellerId: string | null,
  variant: string | null,
  offer: Offer
): string {
  const productId = getProductId(uuid, version.toString());
  let product = ProductV1Product.load(productId);

  if (!product) {
    product = new ProductV1Product(productId);
    product.variants = [];
    product.notVoidedVariants = [];
    product.minValidFromDate = BigInt.zero();
    product.maxValidFromDate = BigInt.zero();
    product.minValidUntilDate = BigInt.zero();
    product.maxValidUntilDate = BigInt.zero();
    product.allVariantsVoided = false;
  }

  product.uuid = uuid;
  product.version = version;
  product.title = title;
  product.description = description;

  product.identification_sKU = identification_sKU;
  product.identification_productId = identification_productId;
  product.identification_productIdType = identification_productIdType;

  product.productionInformation_brandName = productionInformation_brandName;
  product.brand = savedBrandId;
  product.productionInformation_manufacturer =
    productionInformation_manufacturer;
  product.productionInformation_manufacturerPartNumber =
    productionInformation_manufacturerPartNumber;
  product.productionInformation_modelNumber = productionInformation_modelNumber;
  product.productionInformation_materials = productionInformation_materials;

  product.details_category = details_category;
  product.category = savedCategoryId;
  product.details_subCategory = details_subCategory;
  product.subCategory = savedSubCategoryId;
  product.details_subCategory2 = details_subCategory2;
  product.subCategory2 = savedSubCategory2Id;
  product.details_offerCategory = details_offerCategory;
  product.offerCategory = details_offerCategory;
  product.details_tags = details_tags;
  product.tags = savedTagIds;
  product.details_sections = details_sections;
  product.sections = savedSectionIds;
  product.details_personalisation = details_personalisation;
  product.personalisation = savedPersonalisationIds;

  product.visuals_images = savedImageIds;
  product.visuals_videos = savedVideoIds;

  product.packaging_packageQuantity = packaging_packageQuantity;
  product.packaging_dimensions_length = packaging_dimensions_length;
  product.packaging_dimensions_width = packaging_dimensions_width;
  product.packaging_dimensions_height = packaging_dimensions_height;
  product.packaging_dimensions_unit = packaging_dimensions_unit;
  product.packaging_weight_value = packaging_weight_value;
  product.packaging_weight_unit = packaging_weight_unit;

  product.productV1Seller = productV1SellerId;
  product.sellerId = offer.sellerId;
  product.disputeResolverId = offer.disputeResolverId;

  if (variant !== null && product.variants !== null) {
    const oldVariants = product.variants as string[];
    const newVariants: string[] = [];
    // Remove the current Variant from the existing list (if present)
    for (let i = 0; i < oldVariants.length; i++) {
      const variantId = oldVariants[i];
      const oldVariant = ProductV1Variant.load(variantId) as ProductV1Variant;
      if (oldVariant.offer != offer.id) {
        newVariants.push(oldVariant.id);
      }
    }
    // Add the current variant
    newVariants.push(variant);
    product.variants = newVariants;
  }
  const newNotVoidedVariants: string[] = [];
  if (variant !== null && product.notVoidedVariants !== null) {
    const oldNotVoidedVariants = product.notVoidedVariants as string[];
    // Remove the current Variant from the existing list (if present)
    for (let i = 0; i < oldNotVoidedVariants.length; i++) {
      const variantId = oldNotVoidedVariants[i];
      const oldVariant = ProductV1Variant.load(variantId) as ProductV1Variant;
      if (oldVariant.offer != offer.id) {
        newNotVoidedVariants.push(oldVariant.id);
      }
    }
    if (!offer.voided) {
      // Add the current variant only if the offer is not voided
      newNotVoidedVariants.push(variant);
    }
    product.notVoidedVariants = newNotVoidedVariants;
  }
  if (product.minValidFromDate.equals(BigInt.zero())) {
    product.minValidFromDate = offer.validFromDate;
  } else {
    // TODO: compute the minDate for all not voided variant (instead of all variants)
    product.minValidFromDate = getMin(
      product.minValidFromDate,
      offer.validFromDate
    );
  }
  // TODO: compute the maxDate for all not voided variant (instead of all variants)
  product.maxValidFromDate = getMax(
    product.maxValidFromDate,
    offer.validFromDate
  );
  if (product.minValidUntilDate.equals(BigInt.zero())) {
    product.minValidUntilDate = offer.validUntilDate;
  } else {
    // TODO: compute the minDate for all not voided variant (instead of all variants)
    product.minValidUntilDate = getMin(
      product.minValidUntilDate,
      offer.validUntilDate
    );
  }
  // TODO: compute the maxDate for all not voided variant (instead of all variants)
  product.maxValidUntilDate = getMax(
    product.maxValidUntilDate,
    offer.validUntilDate
  );
  product.allVariantsVoided = newNotVoidedVariants.length == 0;

  product.save();

  return productId;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getMin(num1: BigInt, num2: BigInt): BigInt {
  if (num1.lt(num2)) {
    return num1;
  }
  return num2;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getMax(num1: BigInt, num2: BigInt): BigInt {
  if (num1.gt(num2)) {
    return num1;
  }
  return num2;
}

function saveProductV1ProductOverrides(
  productId: string,
  version: i32,
  title: string,
  description: string,
  identification_sKU: string,
  identification_productId: string,
  identification_productIdType: string,
  productionInformation_brandName: string,
  savedBrandId: string,
  productionInformation_manufacturer: string,
  productionInformation_manufacturerPartNumber: string,
  productionInformation_modelNumber: string,
  productionInformation_materials: string[],
  savedImageIds: string[],
  savedVideoIds: string[],
  packaging_packageQuantity: string,
  packaging_dimensions_length: string,
  packaging_dimensions_width: string,
  packaging_dimensions_height: string,
  packaging_dimensions_unit: string,
  packaging_weight_value: string,
  packaging_weight_unit: string
): string {
  const productOverridesId = getProductOverridesId(
    productId,
    version.toString()
  );
  let productOverrides = ProductV1ProductOverrides.load(productId);

  if (!productOverrides) {
    productOverrides = new ProductV1ProductOverrides(productId);
  }

  productOverrides.version = version;
  productOverrides.title = title;
  productOverrides.description = description;

  productOverrides.identification_sKU = identification_sKU;
  productOverrides.identification_productId = identification_productId;
  productOverrides.identification_productIdType = identification_productIdType;

  productOverrides.productionInformation_brandName =
    productionInformation_brandName;
  productOverrides.brand = savedBrandId;
  productOverrides.productionInformation_manufacturer =
    productionInformation_manufacturer;
  productOverrides.productionInformation_manufacturerPartNumber =
    productionInformation_manufacturerPartNumber;
  productOverrides.productionInformation_modelNumber =
    productionInformation_modelNumber;
  productOverrides.productionInformation_materials =
    productionInformation_materials;

  productOverrides.visuals_images = savedImageIds;
  productOverrides.visuals_videos = savedVideoIds;

  productOverrides.packaging_packageQuantity = packaging_packageQuantity;
  productOverrides.packaging_dimensions_length = packaging_dimensions_length;
  productOverrides.packaging_dimensions_width = packaging_dimensions_width;
  productOverrides.packaging_dimensions_height = packaging_dimensions_height;
  productOverrides.packaging_dimensions_unit = packaging_dimensions_unit;
  productOverrides.packaging_weight_value = packaging_weight_value;
  productOverrides.packaging_weight_unit = packaging_weight_unit;

  productOverrides.save();

  return productOverridesId;
}

function saveProductV1Category(categoryName: string): string {
  const categoryId = getCategoryId(categoryName);
  let category = ProductV1Category.load(categoryId);

  if (!category) {
    category = new ProductV1Category(categoryId);
    category.name = categoryName;
    category.save();
  }
  return categoryId;
}

function saveProductV1Brand(brandName: string): string {
  const brandId = getBrandId(brandName);
  let brand = ProductV1Brand.load(brandId);

  if (!brand) {
    brand = new ProductV1Brand(brandId);
    brand.name = brandName;
    brand.save();
  }
  return brandId;
}

function saveProductV1Tags(tags: string[]): string[] {
  const savedTags: string[] = [];

  for (let i = 0; i < tags.length; i++) {
    const tagName = tags[i];

    const tagId = getTagId(tagName);
    let tag = ProductV1Tag.load(tagId);

    if (!tag) {
      tag = new ProductV1Tag(tagId);
      tag.name = tagName;
      tag.save();
    }
    savedTags.push(tagId);
  }

  return savedTags;
}

function saveProductV1Personalisation(personalisation: string[]): string[] {
  const savedPersonlisation: string[] = [];

  for (let i = 0; i < personalisation.length; i++) {
    const personalisationName = personalisation[i];

    const personalisationId = getPersonalisationId(personalisationName);
    let personalisationEntity =
      ProductV1Personalisation.load(personalisationId);

    if (!personalisationEntity) {
      personalisationEntity = new ProductV1Personalisation(personalisationId);
      personalisationEntity.name = personalisationName;
      personalisationEntity.save();
    }
    savedPersonlisation.push(personalisationId);
  }

  return savedPersonlisation;
}

function saveProductV1Sections(sections: string[]): string[] {
  const savedSections: string[] = [];

  for (let i = 0; i < sections.length; i++) {
    const sectionName = sections[i];

    const sectionId = getSectionId(sectionName);
    let section = ProductV1Section.load(sectionId);

    if (!section) {
      section = new ProductV1Section(sectionId);
      section.name = sectionName;
      section.save();
    }
    savedSections.push(sectionId);
  }

  return savedSections;
}
