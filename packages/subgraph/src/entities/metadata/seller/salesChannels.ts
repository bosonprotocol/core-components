import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts";
import {
  SalesChannel,
  SalesChannelDeployment,
  SellerMetadata
} from "../../../../generated/schema";

import {
  convertToInt,
  convertToObject,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";
import {
  addSalesChannelFromProductV1,
  getProductId,
  removeSalesChannelFromProductV1
} from "../product-v1/product";
import { getSellerMetadataEntityId } from ".";

export function getSalesChannelId(
  sellerId: string,
  salesChannelTag: string
): string {
  return `${sellerId}-${salesChannelTag.toLowerCase()}-sale-channel`;
}

export function getSalesChannelDeploymentId(
  salesChannelId: string,
  productId: string
): string {
  return `${salesChannelId}-${productId.toLowerCase()}-deployment`;
}

function removeSalesChannelDeployments(
  salesChannelId: string,
  deployments: string[]
): void {
  for (let i = 0; i < deployments.length; i++) {
    const deployment = SalesChannelDeployment.load(deployments[i]);
    if (!deployment || !deployment.product) {
      log.warning("No product found for SalesChannelDeployment '{}'", [
        deployments[i]
      ]);
      continue;
    }
    removeSalesChannelFromProductV1(deployment.product, salesChannelId);
  }
}

function saveSalesChannelDeployments(
  salesChannelId: string,
  deployments: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedDeployments: string[] = [];

  for (let i = 0; i < deployments.length; i++) {
    const deployment = deployments[i];
    const product = convertToObject(deployment.get("product"));
    const uuid = product ? convertToString(product.get("uuid")) : null;
    const version = product ? convertToInt(product.get("version")) : -1;
    if (uuid === null || version === -1) {
      log.warning(
        "Unable to find product for salesChannel {} deployment at index {}",
        [salesChannelId, i.toString()]
      );
    } else {
      const productId = getProductId(uuid, version.toString());
      const status = convertToString(deployment.get("status"));
      const link = convertToString(deployment.get("link"));

      const id = getSalesChannelDeploymentId(salesChannelId, productId);
      let salesChannelDeployment = SalesChannelDeployment.load(id);

      if (!salesChannelDeployment) {
        salesChannelDeployment = new SalesChannelDeployment(id);
        salesChannelDeployment.product = productId;
      }
      addSalesChannelFromProductV1(productId, salesChannelId);
      salesChannelDeployment.status = status;
      salesChannelDeployment.link = link;
      salesChannelDeployment.save();

      savedDeployments.push(id);
    }
  }

  return savedDeployments;
}

export function saveSalesChannels(
  sellerId: string,
  salesChannels: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedSalesChannels: string[] = [];

  const metadataId = getSellerMetadataEntityId(sellerId);
  const sellerMetadata = SellerMetadata.load(metadataId);
  if (sellerMetadata) {
    const existingSalesChannels = sellerMetadata.salesChannels
      ? (sellerMetadata.salesChannels as string[])
      : [];
    for (let i = 0; i < existingSalesChannels.length; i++) {
      const salesChannelId = existingSalesChannels[i];
      const salesChannel = SalesChannel.load(salesChannelId);
      if (salesChannel) {
        const sellerSalesChannel = SalesChannel.load(salesChannelId);
        if (sellerSalesChannel && sellerSalesChannel.deployments) {
          // Parse all product previously attached to this salesChannel and remove the salesChannel
          removeSalesChannelDeployments(
            salesChannelId,
            sellerSalesChannel.deployments as string[]
          );
        }
      } else {
        log.warning("SalesChannel '{}' not found", [salesChannelId]);
      }
    }
  }

  for (let i = 0; i < salesChannels.length; i++) {
    const salesChannel = salesChannels[i];
    const tag = convertToString(salesChannel.get("tag"));
    const salesChannelId = getSalesChannelId(sellerId, tag);
    let sellerSalesChannel = SalesChannel.load(salesChannelId);

    if (!sellerSalesChannel) {
      sellerSalesChannel = new SalesChannel(salesChannelId);
      sellerSalesChannel.tag = tag;
    }

    const settingsUri = convertToString(salesChannel.get("settingsUri"));
    const settingsEditor = convertToString(salesChannel.get("settingsEditor"));
    const deployments = convertToObjectArray(salesChannel.get("deployments"));
    const deploymentsId = saveSalesChannelDeployments(
      salesChannelId,
      deployments
    );

    sellerSalesChannel.settingsUri = settingsUri;
    sellerSalesChannel.settingsEditor = settingsEditor;
    sellerSalesChannel.deployments = deploymentsId;
    sellerSalesChannel.save();

    savedSalesChannels.push(salesChannelId);
  }

  return savedSalesChannels;
}
