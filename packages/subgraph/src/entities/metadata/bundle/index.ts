import { JSONValue, TypedMap, BigInt, log } from "@graphprotocol/graph-ts";
import {
  BundleMetadataEntity,
  Offer,
  UnknownItemMetadataEntity
} from "../../../../generated/schema";
import {
  convertToString,
  convertToObject,
  convertToObjectArray
} from "../../../utils/json";
import { saveAnimationMetadata } from "../animationMetadata";
import { saveProductV1Seller } from "../product-v1/seller";
import {
  getMetadataEntityId,
  getItemMetadataEntityId,
  saveMetadataAttributes
} from "../utils";
import { getIpfsMetadataObject, parseIpfsHash } from "../../../utils/ipfs";
import { saveNftItemMetadata } from "../nft-item";
import { saveProductV1ItemMetadata } from "../product-v1";

export function saveBundleMetadata(
  offer: Offer,
  metadataObj: TypedMap<string, JSONValue>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  timestamp: BigInt
): string {
  const offerId = offer.id.toString();
  const metadataId = getMetadataEntityId(offerId);

  const name = convertToString(metadataObj.get("name"));
  const bundleUuid = convertToString(metadataObj.get("bundleUuid"));
  const description = convertToString(metadataObj.get("description"));
  const externalUrl = convertToString(metadataObj.get("externalUrl"));
  const animationUrl = convertToString(metadataObj.get("animationUrl"));
  const animationMetadata = convertToObject(
    metadataObj.get("animationMetadata")
  );
  const licenseUrl = convertToString(metadataObj.get("licenseUrl"));
  const condition = convertToString(metadataObj.get("condition"));
  const schemaUrl = convertToString(metadataObj.get("schemaUrl"));
  const image = convertToString(metadataObj.get("image"));
  const attributes = convertToObjectArray(metadataObj.get("attributes"));
  const items = convertToObjectArray(metadataObj.get("items"));

  const savedAnimationMetadataId = saveAnimationMetadata(animationMetadata);
  const savedMetadataAttributeIds = saveMetadataAttributes(attributes);
  const savedProductV1SellerId = saveProductV1Seller(
    convertToObject(metadataObj.get("seller")),
    offer.sellerId.toString()
  );

  if (savedProductV1SellerId === null) {
    return metadataId;
  }

  let bundleMetadataEntity = BundleMetadataEntity.load(metadataId);

  if (!bundleMetadataEntity) {
    bundleMetadataEntity = new BundleMetadataEntity(metadataId);
    bundleMetadataEntity.productUuids = [];
  }

  bundleMetadataEntity.bundleUuid = bundleUuid;
  bundleMetadataEntity.name = name;
  bundleMetadataEntity.description = description;
  bundleMetadataEntity.externalUrl = externalUrl;
  bundleMetadataEntity.animationUrl = animationUrl;
  bundleMetadataEntity.animationMetadata = savedAnimationMetadataId;
  bundleMetadataEntity.licenseUrl = licenseUrl;
  bundleMetadataEntity.schemaUrl = schemaUrl;
  bundleMetadataEntity.condition = condition;
  bundleMetadataEntity.type = "BUNDLE";
  bundleMetadataEntity.image = image;
  bundleMetadataEntity.attributes = savedMetadataAttributeIds;

  bundleMetadataEntity.offer = offerId;
  bundleMetadataEntity.seller = offer.sellerId.toString();
  bundleMetadataEntity.exchangeToken = offer.exchangeToken;

  bundleMetadataEntity.createdAt = timestamp;
  bundleMetadataEntity.voided = offer.voided;
  bundleMetadataEntity.validFromDate = offer.validFromDate;
  bundleMetadataEntity.validUntilDate = offer.validUntilDate;
  bundleMetadataEntity.quantityAvailable = offer.quantityAvailable;
  bundleMetadataEntity.numberOfCommits = offer.numberOfCommits;
  bundleMetadataEntity.numberOfRedemptions = offer.numberOfRedemptions;

  bundleMetadataEntity.productV1Seller = savedProductV1SellerId;

  bundleMetadataEntity.save();
  for (let i = 0; i < items.length; i++) {
    const itemObj = items[i];
    const itemMetadataUri = convertToString(itemObj.get("url"));
    saveItemMetadata(
      itemMetadataUri,
      offer,
      i.toString(),
      metadataId,
      savedProductV1SellerId
    );
  }
  return metadataId;
}

function saveItemMetadata(
  itemMetadataUri: string,
  offer: Offer,
  index: string,
  bundleId: string,
  productV1SellerId: string
): string | null {
  const ipfsHash = parseIpfsHash(itemMetadataUri);

  if (ipfsHash === null) {
    log.warning("Metadata URI does not contain supported CID: {}", [
      itemMetadataUri
    ]);
    return null;
  }

  const metadataObj = getIpfsMetadataObject(ipfsHash);

  if (metadataObj === null) {
    log.warning("Could not load metadata with ipfsHash: {}", [ipfsHash]);
    return null;
  }

  const metadataType = convertToString(metadataObj.get("type"));

  if (metadataType == "ITEM_PRODUCT_V1") {
    return saveProductV1ItemMetadata(
      offer,
      metadataObj,
      itemMetadataUri,
      index,
      bundleId,
      productV1SellerId
    );
  }

  if (metadataType == "ITEM_NFT") {
    return saveNftItemMetadata(
      offer,
      metadataObj,
      itemMetadataUri,
      index,
      bundleId
    );
  }

  saveUnknownItemMetadata(offer, metadataObj, itemMetadataUri, index, bundleId);
  return null;
}

export function saveUnknownItemMetadata(
  offer: Offer,
  metadataObj: TypedMap<string, JSONValue>,
  itemMetadataUri: string,
  index: string,
  bundleId: string
): string {
  const offerId = offer.id.toString();
  const metadataId = getItemMetadataEntityId(offerId, index);
  const schemaUrl = convertToString(metadataObj.get("schemaUrl"));

  let unknownItemMetadataEntity = UnknownItemMetadataEntity.load(metadataId);
  if (!unknownItemMetadataEntity) {
    unknownItemMetadataEntity = new UnknownItemMetadataEntity(metadataId);
  }

  unknownItemMetadataEntity.schemaUrl = schemaUrl;
  unknownItemMetadataEntity.type = "ITEM_UNKNOWN";
  unknownItemMetadataEntity.bundle = bundleId;
  unknownItemMetadataEntity.metadataUri = itemMetadataUri;

  unknownItemMetadataEntity.save();
  return metadataId;
}
