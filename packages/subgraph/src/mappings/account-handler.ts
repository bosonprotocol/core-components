/* eslint-disable @typescript-eslint/ban-types */
import { Address, BigInt, Bytes, crypto, log } from "@graphprotocol/graph-ts";
import {
  SellerCreated,
  SellerUpdatePending,
  SellerUpdateApplied,
  BuyerCreated,
  DisputeResolverCreated,
  AllowedSellersAdded,
  AllowedSellersRemoved,
  DisputeResolverFeesAdded,
  DisputeResolverFeesRemoved,
  DisputeResolverUpdateApplied,
  DisputeResolverUpdatePending,
  CollectionCreated,
  IBosonAccountHandler
} from "../../generated/BosonAccountHandler/IBosonAccountHandler";
import {
  SellerCreated as SellerCreatedLegacy,
  SellerUpdated,
  SellerUpdatePending as SellerUpdatePendingLegacy,
  DisputeResolverActivated,
  DisputeResolverUpdated,
  SellerUpdateApplied as SellerUpdateAppliedLegacy
} from "../../generated/BosonAccountHandlerLegacy/IBosonAccountHandlerLegacy";
import { IBosonVoucher } from "../../generated/BosonAccountHandler/IBosonVoucher";
import {
  Seller,
  Buyer,
  PendingSeller,
  DisputeResolver,
  PendingDisputeResolver,
  OfferCollection
} from "../../generated/schema";
import { BosonVoucher } from "../../generated/templates";
import {
  getAndSaveDisputeResolver,
  getAndSaveDisputeResolverFees
} from "../entities/dispute-resolution";
import { saveAccountEventLog } from "../entities/event-log";
import {
  saveCollectionMetadata,
  saveSellerMetadata
} from "../entities/metadata/handler";
import { getSellerMetadataEntityId } from "../entities/metadata/seller";

export function checkSellerExist(sellerId: BigInt): boolean {
  const seller = Seller.load(sellerId.toString());
  return !!seller;
}

export function handleSellerCreatedEventWithoutMetadataUri(
  event: SellerCreatedLegacy
): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  const bosonVoucherContract = IBosonVoucher.bind(
    event.params.voucherCloneAddress
  );
  const collectionMetadataUri = bosonVoucherContract.contractURI();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.sellerId = event.params.sellerId;
  seller.assistant = sellerFromEvent.assistant;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.voucherCloneAddress = event.params.voucherCloneAddress;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = true;
  seller.contractURI = collectionMetadataUri;
  // TODO: replace royaltyPercentage with royaltyRecipients
  seller.save();

  const externalId = "initial";
  const externalIdHash = crypto.keccak256(Bytes.fromUTF8(externalId));
  // save original collection
  const collectionId = getOfferCollectionId(sellerId, "0");
  saveCollectionMetadata(
    collectionId,
    collectionMetadataUri,
    event.block.timestamp
  );
  saveOfferCollection(
    collectionId,
    event.params.sellerId,
    new BigInt(0),
    event.params.voucherCloneAddress,
    Bytes.fromHexString(externalIdHash.toHexString()),
    externalId
  );
  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
  BosonVoucher.create(event.params.voucherCloneAddress);
}

export function handleSellerCreatedEvent(event: SellerCreated): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  const bosonVoucherContract = IBosonVoucher.bind(
    event.params.voucherCloneAddress
  );
  const collectionMetadataUri = bosonVoucherContract.contractURI();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.sellerId = event.params.sellerId;
  seller.assistant = sellerFromEvent.assistant;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.voucherCloneAddress = event.params.voucherCloneAddress;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = true;
  seller.contractURI = collectionMetadataUri;
  // TODO: replace royaltyPercentage with royaltyRecipients
  seller.metadataUri = sellerFromEvent.metadataUri || "";
  seller.metadata = getSellerMetadataEntityId(seller.id.toString());
  seller.save();

  saveSellerMetadata(seller, event.block.timestamp);
  const externalId = "initial";
  const externalIdHash = crypto.keccak256(Bytes.fromUTF8(externalId));
  // save original collection
  const collectionId = getOfferCollectionId(sellerId, "0");
  saveCollectionMetadata(
    collectionId,
    collectionMetadataUri,
    event.block.timestamp
  );
  saveOfferCollection(
    collectionId,
    event.params.sellerId,
    new BigInt(0),
    event.params.voucherCloneAddress,
    Bytes.fromHexString(externalIdHash.toHexString()),
    externalId
  );
  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
  BosonVoucher.create(event.params.voucherCloneAddress);
}

// Keep handleSellerUpdatedEvent for compatibility with v2.0.0
export function handleSellerUpdatedEvent(event: SellerUpdated): void {
  const sellerFromEvent = event.params.seller;
  const authTokenFromEvent = event.params.authToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.assistant = sellerFromEvent.assistant;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = sellerFromEvent.active;
  seller.metadataUri = "";
  seller.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
}

export function handleSellerUpdatePendingEvent(
  event: SellerUpdatePending
): void {
  const pendingSellerFromEvent = event.params.pendingSeller;
  const pendingAuthTokenFromEvent = event.params.pendingAuthToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  let pendingSeller = PendingSeller.load(seller.id);
  if (!pendingSeller) {
    pendingSeller = new PendingSeller(seller.id);
    pendingSeller.seller = seller.id;
  }

  // TODO: delete the property when set to 0
  pendingSeller.assistant = pendingSellerFromEvent.assistant;
  pendingSeller.clerk = pendingSellerFromEvent.clerk;
  pendingSeller.admin = pendingSellerFromEvent.admin;
  pendingSeller.authTokenType = pendingAuthTokenFromEvent.tokenType;
  pendingSeller.authTokenId = pendingAuthTokenFromEvent.tokenId;
  pendingSeller.metadataUri = pendingSellerFromEvent.metadataUri || "";
  pendingSeller.save();
}

export function handleSellerUpdatePendingEventLegacy(
  event: SellerUpdatePendingLegacy
): void {
  const pendingSellerFromEvent = event.params.pendingSeller;
  const pendingAuthTokenFromEvent = event.params.pendingAuthToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  let pendingSeller = PendingSeller.load(seller.id);
  if (!pendingSeller) {
    pendingSeller = new PendingSeller(seller.id);
    pendingSeller.seller = seller.id;
  }

  // TODO: delete the property when set to 0
  pendingSeller.assistant = pendingSellerFromEvent.assistant;
  pendingSeller.clerk = pendingSellerFromEvent.clerk;
  pendingSeller.admin = pendingSellerFromEvent.admin;
  pendingSeller.authTokenType = pendingAuthTokenFromEvent.tokenType;
  pendingSeller.authTokenId = pendingAuthTokenFromEvent.tokenId;
  pendingSeller.save();
}

export function handleSellerUpdateAppliedEvent(
  event: SellerUpdateApplied
): void {
  const sellerFromEvent = event.params.seller;
  const pendingSellerFromEvent = event.params.pendingSeller;
  const authTokenFromEvent = event.params.authToken;
  const pendingAuthTokenFromEvent = event.params.pendingAuthToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.assistant = sellerFromEvent.assistant;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = sellerFromEvent.active;
  seller.metadataUri = sellerFromEvent.metadataUri || "";
  seller.metadata = getSellerMetadataEntityId(seller.id.toString());
  seller.save();
  saveSellerMetadata(seller, event.block.timestamp);

  let pendingSeller = PendingSeller.load(seller.id);
  if (!pendingSeller) {
    pendingSeller = new PendingSeller(seller.id);
    pendingSeller.seller = seller.id;
  }

  // TODO: delete the property when set to 0
  pendingSeller.assistant = pendingSellerFromEvent.assistant;
  pendingSeller.clerk = pendingSellerFromEvent.clerk;
  pendingSeller.admin = pendingSellerFromEvent.admin;
  pendingSeller.authTokenType = pendingAuthTokenFromEvent.tokenType;
  pendingSeller.authTokenId = pendingAuthTokenFromEvent.tokenId;
  pendingSeller.metadataUri = pendingSellerFromEvent.metadataUri || "";
  pendingSeller.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
}

export function handleSellerUpdateAppliedEventLegacy(
  event: SellerUpdateAppliedLegacy
): void {
  const sellerFromEvent = event.params.seller;
  const pendingSellerFromEvent = event.params.pendingSeller;
  const authTokenFromEvent = event.params.authToken;
  const pendingAuthTokenFromEvent = event.params.pendingAuthToken;
  const sellerId = event.params.sellerId.toString();

  let seller = Seller.load(sellerId);

  if (!seller) {
    seller = new Seller(sellerId);
  }

  seller.assistant = sellerFromEvent.assistant;
  seller.admin = sellerFromEvent.admin;
  seller.clerk = sellerFromEvent.clerk;
  seller.treasury = sellerFromEvent.treasury;
  seller.authTokenId = authTokenFromEvent.tokenId;
  seller.authTokenType = authTokenFromEvent.tokenType;
  seller.active = sellerFromEvent.active;
  seller.save();

  let pendingSeller = PendingSeller.load(seller.id);
  if (!pendingSeller) {
    pendingSeller = new PendingSeller(seller.id);
    pendingSeller.seller = seller.id;
  }

  // TODO: delete the property when set to 0
  pendingSeller.assistant = pendingSellerFromEvent.assistant;
  pendingSeller.clerk = pendingSellerFromEvent.clerk;
  pendingSeller.admin = pendingSellerFromEvent.admin;
  pendingSeller.authTokenType = pendingAuthTokenFromEvent.tokenType;
  pendingSeller.authTokenId = pendingAuthTokenFromEvent.tokenId;
  pendingSeller.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "SELLER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    sellerId
  );
}

export function handleBuyerCreatedEvent(event: BuyerCreated): void {
  const buyerFromEvent = event.params.buyer;
  const buyerId = buyerFromEvent.id.toString();

  let buyer = Buyer.load(buyerId);

  if (!buyer) {
    buyer = new Buyer(buyerId);
  }

  buyer.wallet = buyerFromEvent.wallet;
  buyer.active = true;
  buyer.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "BUYER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    buyerId
  );
}

export function handleDisputeResolverCreatedEvent(
  event: DisputeResolverCreated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);
  getAndSaveDisputeResolverFees(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_CREATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

// Keep handleSellerUpdatedEvent for compatibility with v2.0.0
export function handleDisputeResolverUpdatedEvent(
  event: DisputeResolverUpdated
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverUpdatePendingEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: DisputeResolverUpdatePending
): void {
  const disputeResolverId = event.params.disputeResolverId;
  const pendingDisputeResolverFromEvent = event.params.pendingDisputeResolver;

  let pendingDisputeResolver = PendingDisputeResolver.load(
    disputeResolverId.toString()
  );

  if (!pendingDisputeResolver) {
    pendingDisputeResolver = new PendingDisputeResolver(
      disputeResolverId.toString()
    );
    pendingDisputeResolver.disputeResolver = disputeResolverId.toString();
  }

  // TODO: delete the property when set to 0
  pendingDisputeResolver.assistant = pendingDisputeResolverFromEvent.assistant;
  pendingDisputeResolver.clerk = pendingDisputeResolverFromEvent.clerk;
  pendingDisputeResolver.admin = pendingDisputeResolverFromEvent.admin;
  pendingDisputeResolver.save();
}

export function handleDisputeResolverUpdateAppliedEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: DisputeResolverUpdateApplied
): void {
  const disputeResolverId = event.params.disputeResolverId;
  const disputeResolverFromEvent = event.params.disputeResolver;
  const pendingDisputeResolverFromEvent = event.params.pendingDisputeResolver;

  let disputeResolver = DisputeResolver.load(disputeResolverId.toString());

  if (!disputeResolver) {
    disputeResolver = new DisputeResolver(disputeResolverId.toString());
  }

  disputeResolver.escalationResponsePeriod =
    disputeResolverFromEvent.escalationResponsePeriod;
  disputeResolver.assistant = disputeResolverFromEvent.assistant;
  disputeResolver.admin = disputeResolverFromEvent.admin;
  disputeResolver.clerk = disputeResolverFromEvent.clerk;
  disputeResolver.treasury = disputeResolverFromEvent.treasury;
  disputeResolver.metadataUri = disputeResolverFromEvent.metadataUri;
  disputeResolver.active = disputeResolverFromEvent.active;
  disputeResolver.save();

  let pendingDisputeResolver = PendingDisputeResolver.load(
    disputeResolverId.toString()
  );

  if (!pendingDisputeResolver) {
    pendingDisputeResolver = new PendingDisputeResolver(
      disputeResolverId.toString()
    );
    pendingDisputeResolver.disputeResolver = disputeResolverId.toString();
  }

  // TODO: delete the property when set to 0
  pendingDisputeResolver.assistant = pendingDisputeResolverFromEvent.assistant;
  pendingDisputeResolver.clerk = pendingDisputeResolverFromEvent.clerk;
  pendingDisputeResolver.admin = pendingDisputeResolverFromEvent.admin;
  pendingDisputeResolver.save();

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_UPDATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverActivatedEvent(
  event: DisputeResolverActivated
): void {
  const disputeResolverId = event.params.disputeResolver.id;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_ACTIVATED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverFeesAddedEvent(
  event: DisputeResolverFeesAdded
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolverFees(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_FEES_ADDED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleDisputeResolverFeesRemovedEvent(
  event: DisputeResolverFeesRemoved
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolverFees(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "DISPUTE_RESOLVER_FEES_REMOVED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleAllowedSellersAddedEvent(
  event: AllowedSellersAdded
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "ALLOWED_SELLERS_ADDED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function handleAllowedSellersRemovedEvent(
  event: AllowedSellersRemoved
): void {
  const disputeResolverId = event.params.disputeResolverId;

  getAndSaveDisputeResolver(disputeResolverId, event.address);

  saveAccountEventLog(
    event.transaction.hash.toHexString(),
    event.logIndex,
    "ALLOWED_SELLERS_REMOVED",
    event.block.timestamp,
    event.params.executedBy,
    disputeResolverId.toString()
  );
}

export function getOfferCollectionId(
  sellerId: string,
  collectionIndex: string
): string {
  const offerCollectionId = sellerId + "-collection-" + collectionIndex;
  return offerCollectionId;
}

function saveOfferCollection(
  offerCollectionId: string,
  sellerId: BigInt,
  collectionIndex: BigInt,
  collectionAddress: Address,
  externalIdHash: Bytes,
  externalId: string
): void {
  let offerCollection = OfferCollection.load(offerCollectionId);

  if (offerCollection) {
     log.warning("Offer collection with ID '{}' already exists!", [
        offerCollectionId
      ]);
  } else {
    offerCollection = new OfferCollection(offerCollectionId);
    offerCollection.sellerId = sellerId;
    offerCollection.seller = sellerId.toString();
    offerCollection.collectionIndex = collectionIndex;
    offerCollection.collectionAddress = collectionAddress;
    offerCollection.externalIdHash = externalIdHash;
    offerCollection.externalId = externalId;
    offerCollection.metadata = offerCollectionId;
    offerCollection.save();
  }
}

export function handleCollectionCreatedEvent(event: CollectionCreated): void {
  const sellerId = event.params.sellerId;
  const collectionIndex = event.params.collectionIndex;
  const offerCollectionId = getOfferCollectionId(
    sellerId.toString(),
    collectionIndex.toString()
  );
  const accountHandler = IBosonAccountHandler.bind(event.address);
  const sellerCollectionsResult =
    accountHandler.getSellersCollections(sellerId);
  const collections = sellerCollectionsResult.value1;
  let externalId = "";
  if (collectionIndex.lt(BigInt.fromI32(1))) {
    log.warning("Invalid collection index {} for seller {}", [
      collectionIndex.toString(),
      sellerId.toString()
    ]);
  } else if (collectionIndex.gt(BigInt.fromI32(collections.length))) {
    log.warning("Unable to find collection for seller {} with index {}", [
      sellerId.toString(),
      collectionIndex.toString()
    ]);
  } else {
    externalId = collections[collectionIndex.toU32() - 1].externalId;
  }

  const bosonVoucherContract = IBosonVoucher.bind(
    event.params.collectionAddress
  );
  const collectionMetadataUri = bosonVoucherContract.contractURI();
  saveCollectionMetadata(
    offerCollectionId,
    collectionMetadataUri,
    event.block.timestamp
  );
  saveOfferCollection(
    offerCollectionId,
    sellerId,
    collectionIndex,
    event.params.collectionAddress,
    event.params.externalId,
    externalId
  );
}
