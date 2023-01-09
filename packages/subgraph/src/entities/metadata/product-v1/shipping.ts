import { JSONValue, TypedMap, BigInt } from "@graphprotocol/graph-ts";
import {
  ProductV1ShippingJurisdiction,
  ProductV1ShippingOption
} from "../../../../generated/schema";

import {
  convertToInt,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";

export function getShippingOptionId(productV1MetadataEntityId: string): string {
  return `${productV1MetadataEntityId}-shipping`;
}

export function getSupportedJurisdictionId(
  productV1MetadataEntityId: string,
  jurisdictionLabel: string
): string {
  return `${productV1MetadataEntityId}-jurisdiction-${jurisdictionLabel.toLowerCase()}`;
}

export function saveProductV1Shipping(
  shippingObj: TypedMap<string, JSONValue> | null,
  productV1MetadataEntityId: string
): string | null {
  if (shippingObj === null) {
    return null;
  }

  const defaultVersion = convertToInt(shippingObj.get("defaultVersion"));
  const countryOfOrigin = convertToString(shippingObj.get("countryOfOrigin"));
  const redemptionPoint = convertToString(shippingObj.get("redemptionPoint"));
  // Can't use convertToInt() here because the type of "returnPeriod" in the JSON is string
  const returnPeriod = convertToString(shippingObj.get("returnPeriod"));
  const returnPeriodBigInt = BigInt.fromString(returnPeriod);
  const returnPeriodInDays = returnPeriodBigInt.isI32()
    ? returnPeriodBigInt.toI32()
    : i32.MAX_VALUE;
  const supportedJurisdictions = convertToObjectArray(
    shippingObj.get("supportedJurisdictions")
  );
  const savedJurisdictionIds = saveProductV1SupportedJurisdictions(
    supportedJurisdictions,
    productV1MetadataEntityId
  );

  const shippingOptionId = getShippingOptionId(productV1MetadataEntityId);

  let shippingOption = ProductV1ShippingOption.load(shippingOptionId);

  if (!shippingOption) {
    shippingOption = new ProductV1ShippingOption(shippingOptionId);
  }

  shippingOption.defaultVersion = defaultVersion;
  shippingOption.countryOfOrigin = countryOfOrigin;
  shippingOption.redemptionPoint = redemptionPoint;
  shippingOption.supportedJurisdictions = savedJurisdictionIds;
  shippingOption.returnPeriodInDays = returnPeriodInDays as i32;
  shippingOption.save();

  return shippingOptionId;
}

function saveProductV1SupportedJurisdictions(
  jurisdictions: Array<TypedMap<string, JSONValue>>,
  productV1MetadataEntityId: string
): string[] {
  const savedJurisdictions: string[] = [];

  for (let i = 0; i < jurisdictions.length; i++) {
    const jurisdictionObject = jurisdictions[i];
    const jurisdictionLabel = convertToString(jurisdictionObject.get("label"));
    const jurisdictionDeliveryTime = convertToString(
      jurisdictionObject.get("deliveryTime")
    );
    const jurisdictionId = getSupportedJurisdictionId(
      productV1MetadataEntityId,
      jurisdictionLabel
    );

    let jurisdiction = ProductV1ShippingJurisdiction.load(jurisdictionId);

    if (!jurisdiction) {
      jurisdiction = new ProductV1ShippingJurisdiction(jurisdictionId);
      jurisdiction.label = jurisdictionLabel;
      jurisdiction.deliveryTime = jurisdictionDeliveryTime;
      jurisdiction.save();
    }

    savedJurisdictions.push(jurisdictionId);
  }

  return savedJurisdictions;
}
