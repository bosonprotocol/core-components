import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts";
import {
  ProductV1Product,
  SalesChannel,
  SalesChannelDeployment,
  SellerMetadata
} from "../../../../generated/schema";

import {
  convertToBigInt,
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
  productIdOrLink: string
): string {
  return `${salesChannelId}-${productIdOrLink.toLowerCase()}-deployment`;
}

function removeSalesChannelDeployments(
  salesChannelId: string,
  deployments: string[]
): void {
  for (let i = 0; i < deployments.length; i++) {
    const deployment = SalesChannelDeployment.load(deployments[i]);
    if (!deployment) {
      log.warning("SalesChannelDeployment '{}' entity not found.", [
        deployments[i]
      ]);
      continue;
    }
    if (deployment.product !== null) {
      removeSalesChannelFromProductV1(
        deployment.product as string,
        salesChannelId
      );
    }
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
    const link = convertToString(deployment.get("link"));
    let salesChannelDeploymentId: string | null = null;
    let salesChannelDeployment: SalesChannelDeployment | null = null;
    if (product) {
      const uuid = convertToString(product.get("uuid"));
      const version = convertToInt(product.get("version"));
      const productId = getProductId(uuid, version.toString());
      // Check the product exist, otherwise do not add the deployment
      const existingProduct = ProductV1Product.load(productId);
      if (!existingProduct) {
        log.warning(
          "Product with id '{}' does not exist. SalesChannel '{}' will be incomplete.",
          [productId, salesChannelId]
        );
      } else {
        salesChannelDeploymentId = getSalesChannelDeploymentId(
          salesChannelId,
          productId
        ) as string;
        log.info("debug salesChannelDeploymentId '{}'", [
          salesChannelDeploymentId
        ]);
        salesChannelDeployment = SalesChannelDeployment.load(
          salesChannelDeploymentId
        );

        if (!salesChannelDeployment) {
          salesChannelDeployment = new SalesChannelDeployment(
            salesChannelDeploymentId
          );
          salesChannelDeployment.product = productId;
        }
        addSalesChannelFromProductV1(productId, salesChannelId);
      }
    } else {
      if (link === null) {
        log.warning(
          "Unable to identify salesChannelDeployment for '{}' without a 'product' or a 'link' value",
          [salesChannelId]
        );
      } else {
        salesChannelDeploymentId = getSalesChannelDeploymentId(
          salesChannelId,
          link
        ) as string;
        salesChannelDeployment = SalesChannelDeployment.load(
          salesChannelDeploymentId
        );

        if (!salesChannelDeployment) {
          salesChannelDeployment = new SalesChannelDeployment(
            salesChannelDeploymentId
          );
        }
      }
    }
    if (salesChannelDeployment) {
      salesChannelDeployment.link = link;
      const lastUpdated = convertToString(deployment.get("lastUpdated"));
      const status = convertToString(deployment.get("status"));
      salesChannelDeployment.status = status;
      salesChannelDeployment.lastUpdated = lastUpdated;
      salesChannelDeployment.save();
      savedDeployments.push(salesChannelDeploymentId as string);
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
    const name = convertToString(salesChannel.get("name"));
    const salesChannelId = getSalesChannelId(sellerId, tag);
    let sellerSalesChannel = SalesChannel.load(salesChannelId);

    if (!sellerSalesChannel) {
      sellerSalesChannel = new SalesChannel(salesChannelId);
      sellerSalesChannel.tag = tag;
      sellerSalesChannel.name = name;
    }

    const settingsUri = convertToString(salesChannel.get("settingsUri"));
    const settingsEditor = convertToString(salesChannel.get("settingsEditor"));
    const link = convertToString(salesChannel.get("link"));
    const deployments = convertToObjectArray(salesChannel.get("deployments"));
    const deploymentsId = saveSalesChannelDeployments(
      salesChannelId,
      deployments
    );

    sellerSalesChannel.settingsUri = settingsUri;
    sellerSalesChannel.settingsEditor = settingsEditor;
    sellerSalesChannel.link = link;
    sellerSalesChannel.deployments = deploymentsId;
    sellerSalesChannel.save();

    savedSalesChannels.push(salesChannelId);
  }

  return savedSalesChannels;
}
