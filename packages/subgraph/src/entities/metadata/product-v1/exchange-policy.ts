import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import { ProductV1ExchangePolicy } from "../../../../generated/schema";

import { convertToInt, convertToString } from "../../../utils/json";

export function getExchangePolicyId(productV1MetadataEntityId: string): string {
  return `${productV1MetadataEntityId}-exchange-policy`;
}

export function saveProductV1ExchangePolicy(
  exchangePolicyObj: TypedMap<string, JSONValue> | null,
  productV1MetadataEntityId: string
): string | null {
  if (exchangePolicyObj === null) {
    return null;
  }

  const uuid = convertToString(exchangePolicyObj.get("uuid"));
  const version = convertToInt(exchangePolicyObj.get("version"));
  const label = convertToString(exchangePolicyObj.get("label"));
  const template = convertToString(exchangePolicyObj.get("template"));
  const sellerContactMethod = convertToString(exchangePolicyObj.get("sellerContactMethod"));
  const disputeResolverContactMethod = convertToString(exchangePolicyObj.get("disputeResolverContactMethod"));

  const exchangePolicyId = getExchangePolicyId(productV1MetadataEntityId);

  let exchangePolicy = ProductV1ExchangePolicy.load(exchangePolicyId);

  if (!exchangePolicy) {
    exchangePolicy = new ProductV1ExchangePolicy(exchangePolicyId);
  }

  exchangePolicy.uuid = uuid;
  exchangePolicy.version = version;
  exchangePolicy.label = label;
  exchangePolicy.template = template;
  exchangePolicy.sellerContactMethod = sellerContactMethod;
  exchangePolicy.disputeResolverContactMethod = disputeResolverContactMethod;
  exchangePolicy.save();

  return exchangePolicyId;
}
