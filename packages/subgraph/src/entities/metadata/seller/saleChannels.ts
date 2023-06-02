import { JSONValue, TypedMap } from "@graphprotocol/graph-ts";
import {
  SaleChannel,
  SaleChannelDeployment
} from "../../../../generated/schema";

import { convertToObjectArray, convertToString } from "../../../utils/json";

export function getSaleChannelId(
  sellerId: string,
  saleChannelTag: string
): string {
  return `${sellerId}-${saleChannelTag.toLowerCase()}-sale-channel`;
}

export function getSaleChannelDeploymentId(
  saleChannelId: string,
  productId: string
): string {
  return `${saleChannelId}-${productId.toLowerCase()}-deployment`;
}

function saveSaleChannelDeployments(
  saleChannelId: string,
  deployments: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedDeployments: string[] = [];

  for (let i = 0; i < deployments.length; i++) {
    const deployment = deployments[i];
    const product = convertToString(deployment.get("product"));
    const status = convertToString(deployment.get("status"));

    const id = getSaleChannelDeploymentId(saleChannelId, product);
    let saleChannelDeployment = SaleChannelDeployment.load(id);

    if (!saleChannelDeployment) {
      saleChannelDeployment = new SaleChannelDeployment(id);
      saleChannelDeployment.product = product;
      saleChannelDeployment.status = status;
    }
    saleChannelDeployment.save();

    savedDeployments.push(id);
  }

  return savedDeployments;
}

export function saveSaleChannels(
  sellerId: string,
  saleChannels: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedSaleChannels: string[] = [];

  for (let i = 0; i < saleChannels.length; i++) {
    const saleChannel = saleChannels[i];
    const tag = convertToString(saleChannel.get("tag"));
    const saleChannelId = getSaleChannelId(sellerId, tag);
    const settingsUri = convertToString(saleChannel.get("settingsUri"));
    const settingsEditor = convertToString(saleChannel.get("settingsEditor"));
    const deployments = convertToObjectArray(saleChannel.get("deployments"));
    const deploymentsId = saveSaleChannelDeployments(
      saleChannelId,
      deployments
    );

    let sellerSalesChannel = SaleChannel.load(saleChannelId);

    if (!sellerSalesChannel) {
      sellerSalesChannel = new SaleChannel(saleChannelId);
      sellerSalesChannel.tag = tag;
      sellerSalesChannel.settingsUri = settingsUri;
      sellerSalesChannel.settingsEditor = settingsEditor;
      sellerSalesChannel.deployments = deploymentsId;
    }
    sellerSalesChannel.save();

    savedSaleChannels.push(saleChannelId);
  }

  return savedSaleChannels;
}
