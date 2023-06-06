import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts";
import {
  SaleChannel,
  SaleChannelDeployment,
  SellerMetadata
} from "../../../../generated/schema";

import {
  convertToInt,
  convertToObject,
  convertToObjectArray,
  convertToString
} from "../../../utils/json";
import {
  addSaleChannelFromProductV1,
  getProductId,
  removeSaleChannelFromProductV1
} from "../product-v1/product";
import { getSellerMetadataEntityId } from ".";

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

function removeSaleChannelDeployments(
  saleChannelId: string,
  deployments: string[]
): void {
  for (let i = 0; i < deployments.length; i++) {
    const deployment = SaleChannelDeployment.load(deployments[i]);
    if (!deployment || !deployment.product) {
      log.warning("No product found for SaleChannelDeployment '{}'", [
        deployments[i]
      ]);
      continue;
    }
    removeSaleChannelFromProductV1(deployment.product, saleChannelId);
  }
}

function saveSaleChannelDeployments(
  saleChannelId: string,
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
        "Unable to find product for saleChannel {} deployment at index {}",
        [saleChannelId, i.toString()]
      );
    } else {
      const productId = getProductId(uuid, version.toString());
      const status = convertToString(deployment.get("status"));
      const link = convertToString(deployment.get("link"));

      const id = getSaleChannelDeploymentId(saleChannelId, productId);
      let saleChannelDeployment = SaleChannelDeployment.load(id);

      if (!saleChannelDeployment) {
        saleChannelDeployment = new SaleChannelDeployment(id);
        saleChannelDeployment.product = productId;
      }
      addSaleChannelFromProductV1(productId, saleChannelId);
      saleChannelDeployment.status = status;
      saleChannelDeployment.link = link;
      saleChannelDeployment.save();

      savedDeployments.push(id);
    }
  }

  return savedDeployments;
}

export function saveSaleChannels(
  sellerId: string,
  saleChannels: Array<TypedMap<string, JSONValue>>
): string[] {
  const savedSaleChannels: string[] = [];

  const metadataId = getSellerMetadataEntityId(sellerId);
  const sellerMetadata = SellerMetadata.load(metadataId);
  if (sellerMetadata) {
    const existingSaleChannels = sellerMetadata.saleChannels
      ? (sellerMetadata.saleChannels as string[])
      : [];
    for (let i = 0; i < existingSaleChannels.length; i++) {
      const saleChannelId = existingSaleChannels[i];
      const saleChannel = SaleChannel.load(saleChannelId);
      if (saleChannel) {
        const sellerSalesChannel = SaleChannel.load(saleChannelId);
        if (sellerSalesChannel && sellerSalesChannel.deployments) {
          // Parse all product previously attached to this saleChannel and remove the saleChannel
          removeSaleChannelDeployments(
            saleChannelId,
            sellerSalesChannel.deployments as string[]
          );
        }
      } else {
        log.warning("SaleChannel '{}' not found", [saleChannelId]);
      }
    }
  }

  for (let i = 0; i < saleChannels.length; i++) {
    const saleChannel = saleChannels[i];
    const tag = convertToString(saleChannel.get("tag"));
    const saleChannelId = getSaleChannelId(sellerId, tag);
    let sellerSalesChannel = SaleChannel.load(saleChannelId);

    if (!sellerSalesChannel) {
      sellerSalesChannel = new SaleChannel(saleChannelId);
      sellerSalesChannel.tag = tag;
    }

    const settingsUri = convertToString(saleChannel.get("settingsUri"));
    const settingsEditor = convertToString(saleChannel.get("settingsEditor"));
    const deployments = convertToObjectArray(saleChannel.get("deployments"));
    const deploymentsId = saveSaleChannelDeployments(
      saleChannelId,
      deployments
    );

    sellerSalesChannel.settingsUri = settingsUri;
    sellerSalesChannel.settingsEditor = settingsEditor;
    sellerSalesChannel.deployments = deploymentsId;
    sellerSalesChannel.save();

    savedSaleChannels.push(saleChannelId);
  }

  return savedSaleChannels;
}
