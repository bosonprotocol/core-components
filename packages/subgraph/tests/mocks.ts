import {
  ConditionalCommitAuthorized,
  ExchangeCompleted,
  VoucherCanceled,
  VoucherExpired,
  VoucherExtended,
  VoucherRedeemed,
  VoucherRevoked,
  VoucherTransferred
} from "./../generated/BosonExchangeHandler/IBosonExchangeHandler";
import {
  RoyaltyRecipientsChanged,
  RoyaltyRecipientsChangedRoyaltyRecipientsStruct,
  SellerCreatedAuthTokenStruct
} from "./../generated/BosonAccountHandler/IBosonAccountHandler";
import {
  OfferCreatedOfferFeesStruct,
  OfferCreatedOfferRoyaltyInfoStruct,
  OfferExtended,
  OfferRoyaltyInfoUpdated,
  OfferRoyaltyInfoUpdatedRoyaltyInfoStruct,
  RangeReserved
} from "./../generated/BosonOfferHandler/IBosonOfferHandler";
import {
  OfferCreated,
  OfferCreatedOfferDatesStruct,
  OfferCreatedOfferDurationsStruct,
  OfferCreatedDisputeResolutionTermsStruct,
  OfferCreatedOfferStruct,
  OfferVoided
} from "../generated/BosonOfferHandler/IBosonOfferHandler";
import {
  BuyerCommitted,
  BuyerCommittedExchangeStruct,
  BuyerCommittedVoucherStruct
} from "../generated/BosonExchangeHandler/IBosonExchangeHandler";
import {
  SellerCreated,
  SellerCreatedSellerStruct,
  BuyerCreated,
  BuyerCreatedBuyerStruct
} from "../generated/BosonAccountHandler/IBosonAccountHandler";
import {
  FundsDeposited,
  FundsEncumbered,
  FundsReleased,
  FundsWithdrawn
} from "../generated/BosonFundsHandler/IBosonFundsHandler";
import {
  newMockEvent,
  createMockedFunction,
  mockIpfsFile
} from "matchstick-as/assembly/index";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  SellerUpdated,
  SellerCreated as SellerCreatedLegacy,
  SellerCreatedSellerStruct as SellerCreatedLegacySellerStruct
} from "../generated/BosonAccountHandlerLegacy/IBosonAccountHandlerLegacy";
import {
  OfferCreated as OfferCreatedLegacy,
  OfferCreatedOfferStruct as OfferCreatedOfferStructLegacy
} from "../generated/BosonOfferHandlerLegacy/IBosonOfferHandlerLegacy";
import { SellerUpdateApplied } from "../generated/BosonAccountHandler/IBosonAccountHandler";
import { getProductId } from "../src/entities/metadata/product-v1/product";
import {
  Exchange,
  Offer,
  ProductV1Media,
  ProductV1Product,
  Seller
} from "../generated/schema";
import {
  getOfferCollectionId,
  handleSellerCreatedEvent
} from "../src/mappings/account-handler";
import {
  GroupCreated,
  GroupCreatedConditionStruct,
  GroupCreatedGroupStruct,
  GroupUpdated
} from "../generated/BosonGroupHandler/IBosonGroupHandler";
import { getDisputeResolutionTermsId } from "../src/entities/dispute-resolution";
import { ContractURIChanged, VouchersPreMinted } from "../generated/BosonAccountHandler/IBosonVoucher";

export class RoyaltyInfo {
  recipients: string[];
  bps: i32[];
  constructor(recipients: string[], bps: i32[]) {
    this.recipients = recipients;
    this.bps = bps;
  }
}

export function createOfferCreatedEvent(
  offerId: i32,
  sellerId: i32,
  price: i32,
  sellerDeposit: i32,
  protocolFee: i32,
  agentFee: i32,
  buyerCancelPenalty: i32,
  quantityAvailable: i32,
  validFromDate: i32,
  validUntilDate: i32,
  voucherRedeemableFromDate: i32,
  voucherRedeemableUntilDate: i32,
  disputePeriodDuration: i32,
  voucherValidDuration: i32,
  resolutionPeriodDuration: i32,
  exchangeToken: string,
  disputeResolverId: i32,
  disputeEscalationResponsePeriod: i32,
  disputeFeeAmount: i32,
  disputeBuyerEscalationDeposit: i32,
  priceType: i8,
  metadataUri: string,
  metadataHash: string,
  voided: boolean,
  collectionIndex: i32,
  agentId: i32,
  executedBy: string,
  royaltyInfo: RoyaltyInfo
): OfferCreated {
  const offerCreatedEvent = changetype<OfferCreated>(newMockEvent());
  offerCreatedEvent.parameters = [];

  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const offerParam = new ethereum.EventParam(
    "offer",
    ethereum.Value.fromTuple(
      createOfferStruct(
        offerId,
        sellerId,
        price,
        sellerDeposit,
        buyerCancelPenalty,
        quantityAvailable,
        exchangeToken,
        priceType,
        metadataUri,
        metadataHash,
        voided,
        collectionIndex,
        royaltyInfo
      )
    )
  );
  const offerDatesParams = new ethereum.EventParam(
    "offerDates",
    ethereum.Value.fromTuple(
      createOfferDatesStruct(
        validFromDate,
        validUntilDate,
        voucherRedeemableFromDate,
        voucherRedeemableUntilDate
      )
    )
  );
  const offerDurationsParams = new ethereum.EventParam(
    "offerDurations",
    ethereum.Value.fromTuple(
      createOfferDurationsStruct(
        disputePeriodDuration,
        voucherValidDuration,
        resolutionPeriodDuration
      )
    )
  );
  const offerFeesParams = new ethereum.EventParam(
    "offerFees",
    ethereum.Value.fromTuple(createOfferFeesStruct(protocolFee, agentFee))
  );
  const disputeResolutionTermsParams = new ethereum.EventParam(
    "disputeResolutionTerms",
    ethereum.Value.fromTuple(
      createDisputeResolutionTermsStruct(
        disputeResolverId,
        disputeEscalationResponsePeriod,
        disputeFeeAmount,
        disputeBuyerEscalationDeposit
      )
    )
  );
  const agentIdParam = new ethereum.EventParam(
    "agentId",
    ethereum.Value.fromI32(agentId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  offerCreatedEvent.parameters.push(offerIdParam);
  offerCreatedEvent.parameters.push(sellerIdParam);
  offerCreatedEvent.parameters.push(offerParam);
  offerCreatedEvent.parameters.push(offerDatesParams);
  offerCreatedEvent.parameters.push(offerDurationsParams);
  offerCreatedEvent.parameters.push(disputeResolutionTermsParams);
  offerCreatedEvent.parameters.push(offerFeesParams);
  offerCreatedEvent.parameters.push(agentIdParam);
  offerCreatedEvent.parameters.push(executedByParam);

  return offerCreatedEvent;
}

export function createOfferCreatedEventLegacy(
  offerId: i32,
  sellerId: i32,
  price: i32,
  sellerDeposit: i32,
  protocolFee: i32,
  agentFee: i32,
  buyerCancelPenalty: i32,
  quantityAvailable: i32,
  validFromDate: i32,
  validUntilDate: i32,
  voucherRedeemableFromDate: i32,
  voucherRedeemableUntilDate: i32,
  disputePeriodDuration: i32,
  voucherValidDuration: i32,
  resolutionPeriodDuration: i32,
  exchangeToken: string,
  disputeResolverId: i32,
  disputeEscalationResponsePeriod: i32,
  disputeFeeAmount: i32,
  disputeBuyerEscalationDeposit: i32,
  metadataUri: string,
  metadataHash: string,
  voided: boolean,
  agentId: i32,
  executedBy: string
): OfferCreatedLegacy {
  const offerCreatedEvent = changetype<OfferCreatedLegacy>(newMockEvent());
  offerCreatedEvent.parameters = [];

  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const offerParam = new ethereum.EventParam(
    "offer",
    ethereum.Value.fromTuple(
      createOfferStructLegacy(
        offerId,
        sellerId,
        price,
        sellerDeposit,
        buyerCancelPenalty,
        quantityAvailable,
        exchangeToken,
        metadataUri,
        metadataHash,
        voided
      )
    )
  );
  const offerDatesParams = new ethereum.EventParam(
    "offerDates",
    ethereum.Value.fromTuple(
      createOfferDatesStruct(
        validFromDate,
        validUntilDate,
        voucherRedeemableFromDate,
        voucherRedeemableUntilDate
      )
    )
  );
  const offerDurationsParams = new ethereum.EventParam(
    "offerDurations",
    ethereum.Value.fromTuple(
      createOfferDurationsStruct(
        disputePeriodDuration,
        voucherValidDuration,
        resolutionPeriodDuration
      )
    )
  );
  const offerFeesParams = new ethereum.EventParam(
    "offerFees",
    ethereum.Value.fromTuple(createOfferFeesStruct(protocolFee, agentFee))
  );
  const disputeResolutionTermsParams = new ethereum.EventParam(
    "disputeResolutionTerms",
    ethereum.Value.fromTuple(
      createDisputeResolutionTermsStruct(
        disputeResolverId,
        disputeEscalationResponsePeriod,
        disputeFeeAmount,
        disputeBuyerEscalationDeposit
      )
    )
  );
  const agentIdParam = new ethereum.EventParam(
    "agentId",
    ethereum.Value.fromI32(agentId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  offerCreatedEvent.parameters.push(offerIdParam);
  offerCreatedEvent.parameters.push(sellerIdParam);
  offerCreatedEvent.parameters.push(offerParam);
  offerCreatedEvent.parameters.push(offerDatesParams);
  offerCreatedEvent.parameters.push(offerDurationsParams);
  offerCreatedEvent.parameters.push(disputeResolutionTermsParams);
  offerCreatedEvent.parameters.push(offerFeesParams);
  offerCreatedEvent.parameters.push(agentIdParam);
  offerCreatedEvent.parameters.push(executedByParam);

  return offerCreatedEvent;
}

export function createOfferVoidedEvent(
  offerId: i32,
  sellerId: i32,
  executedBy: string
): OfferVoided {
  const offerVoidedEvent = changetype<OfferVoided>(newMockEvent());
  offerVoidedEvent.parameters = [];

  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  offerVoidedEvent.parameters.push(offerIdParam);
  offerVoidedEvent.parameters.push(sellerIdParam);
  offerVoidedEvent.parameters.push(executedByParam);

  return offerVoidedEvent;
}

export function mockBosonVoucherContractCalls(
  address: string,
  contractURI: string,
  royaltyPercentage: i32
): void {
  createMockedFunction(
    Address.fromString(address),
    "contractURI",
    "contractURI():(string)"
  ).returns([ethereum.Value.fromString(contractURI)]);

  createMockedFunction(
    Address.fromString(address),
    "getRoyaltyPercentage",
    "getRoyaltyPercentage():(uint256)"
  ).returns([ethereum.Value.fromI32(royaltyPercentage)]);
}

export function mockExchangeTokenContractCalls(
  address: string,
  decimals: i32,
  name: string,
  symbol: string
): void {
  createMockedFunction(
    Address.fromString(address),
    "decimals",
    "decimals():(uint8)"
  ).returns([ethereum.Value.fromI32(decimals)]);

  createMockedFunction(
    Address.fromString(address),
    "name",
    "name():(string)"
  ).returns([ethereum.Value.fromString(name)]);

  createMockedFunction(
    Address.fromString(address),
    "symbol",
    "symbol():(string)"
  ).returns([ethereum.Value.fromString(symbol)]);
}

export function createBuyerCommittedEvent(
  offerId: i32,
  buyerId: i32,
  exchangeId: i32
): BuyerCommitted {
  const buyerCommittedEvent = changetype<BuyerCommitted>(newMockEvent());
  buyerCommittedEvent.parameters = [];

  const voucherStruct = new BuyerCommittedVoucherStruct();
  voucherStruct.push(ethereum.Value.fromI32(0));
  voucherStruct.push(ethereum.Value.fromI32(0));
  voucherStruct.push(ethereum.Value.fromI32(0));
  voucherStruct.push(ethereum.Value.fromBoolean(false));

  const exchangeStruct = new BuyerCommittedExchangeStruct();
  exchangeStruct.push(ethereum.Value.fromI32(exchangeId));
  exchangeStruct.push(ethereum.Value.fromI32(offerId));
  exchangeStruct.push(ethereum.Value.fromI32(buyerId));
  exchangeStruct.push(ethereum.Value.fromI32(0));
  exchangeStruct.push(ethereum.Value.fromI32(0)); // COMMITTED

  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const buyerIdParam = new ethereum.EventParam(
    "buyerId",
    ethereum.Value.fromI32(buyerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const exchangeParam = new ethereum.EventParam(
    "exchange",
    ethereum.Value.fromTuple(exchangeStruct)
  );
  const voucherParam = new ethereum.EventParam(
    "voucher",
    ethereum.Value.fromTuple(voucherStruct)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.zero())
  );

  buyerCommittedEvent.parameters.push(offerIdParam);
  buyerCommittedEvent.parameters.push(buyerIdParam);
  buyerCommittedEvent.parameters.push(exchangeIdParam);
  buyerCommittedEvent.parameters.push(exchangeParam);
  buyerCommittedEvent.parameters.push(voucherParam);
  buyerCommittedEvent.parameters.push(executedByParam);

  return buyerCommittedEvent;
}

export function createVoucherExtendedEvent(
  offerId: i32,
  exchangeId: i32,
  validUntil: i32,
  executedBy: string
): VoucherExtended {
  const voucherExtendedEvent = changetype<VoucherExtended>(newMockEvent());
  voucherExtendedEvent.parameters = [];

  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const validUntilParam = new ethereum.EventParam(
    "validUntil",
    ethereum.Value.fromI32(validUntil)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  voucherExtendedEvent.parameters.push(offerIdParam);
  voucherExtendedEvent.parameters.push(exchangeIdParam);
  voucherExtendedEvent.parameters.push(validUntilParam);
  voucherExtendedEvent.parameters.push(executedByParam);

  return voucherExtendedEvent;
}

export function createSellerCreatedEventLegacy(
  sellerId: i32,
  assistant: string,
  admin: string,
  clerk: string,
  treasury: string,
  voucherCloneAddress: string,
  authTokenId: i32,
  authTokenType: i8,
  executedBy: string
): SellerCreatedLegacy {
  const sellerCreatedEvent = changetype<SellerCreatedLegacy>(newMockEvent());
  sellerCreatedEvent.parameters = [];

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const sellerParam = new ethereum.EventParam(
    "seller",
    ethereum.Value.fromTuple(
      createLegacySellerStruct(
        sellerId,
        assistant,
        admin,
        clerk,
        treasury,
        false
      )
    )
  );
  const voucherCloneAddressParam = new ethereum.EventParam(
    "voucherCloneAddress",
    ethereum.Value.fromAddress(Address.fromString(voucherCloneAddress))
  );
  const authTokenParam = new ethereum.EventParam(
    "authToken",
    ethereum.Value.fromTuple(createAuthToken(authTokenId, authTokenType))
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  sellerCreatedEvent.parameters.push(sellerIdParam);
  sellerCreatedEvent.parameters.push(sellerParam);
  sellerCreatedEvent.parameters.push(voucherCloneAddressParam);
  sellerCreatedEvent.parameters.push(authTokenParam);
  sellerCreatedEvent.parameters.push(executedByParam);

  return sellerCreatedEvent;
}

export function createSellerCreatedEvent(
  sellerId: i32,
  assistant: string,
  admin: string,
  clerk: string,
  treasury: string,
  voucherCloneAddress: string,
  authTokenId: i32,
  authTokenType: i8,
  executedBy: string,
  metadataUri: string
): SellerCreated {
  const sellerCreatedEvent = changetype<SellerCreated>(newMockEvent());
  sellerCreatedEvent.parameters = [];

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const sellerParam = new ethereum.EventParam(
    "seller",
    ethereum.Value.fromTuple(
      createSellerStruct(
        sellerId,
        assistant,
        admin,
        clerk,
        treasury,
        false,
        metadataUri
      )
    )
  );
  const voucherCloneAddressParam = new ethereum.EventParam(
    "voucherCloneAddress",
    ethereum.Value.fromAddress(Address.fromString(voucherCloneAddress))
  );
  const authTokenParam = new ethereum.EventParam(
    "authToken",
    ethereum.Value.fromTuple(createAuthToken(authTokenId, authTokenType))
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  sellerCreatedEvent.parameters.push(sellerIdParam);
  sellerCreatedEvent.parameters.push(sellerParam);
  sellerCreatedEvent.parameters.push(voucherCloneAddressParam);
  sellerCreatedEvent.parameters.push(authTokenParam);
  sellerCreatedEvent.parameters.push(executedByParam);

  return sellerCreatedEvent;
}

export function createSellerUpdatedEvent(
  sellerId: i32,
  assistant: string,
  admin: string,
  clerk: string,
  treasury: string,
  active: boolean,
  authTokenId: i32,
  authTokenType: i8,
  executedBy: string
): SellerUpdated {
  const sellerUpdatedEvent = changetype<SellerUpdated>(newMockEvent());
  sellerUpdatedEvent.parameters = [];

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const sellerParam = new ethereum.EventParam(
    "seller",
    ethereum.Value.fromTuple(
      createSellerStruct(
        sellerId,
        assistant,
        admin,
        clerk,
        treasury,
        active,
        ""
      )
    )
  );
  const authTokenParam = new ethereum.EventParam(
    "authToken",
    ethereum.Value.fromTuple(createAuthToken(authTokenId, authTokenType))
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  sellerUpdatedEvent.parameters.push(sellerIdParam);
  sellerUpdatedEvent.parameters.push(sellerParam);
  sellerUpdatedEvent.parameters.push(authTokenParam);
  sellerUpdatedEvent.parameters.push(executedByParam);

  return sellerUpdatedEvent;
}

export function createSellerUpdateAppliedEvent(
  sellerId: i32,
  assistant: string,
  admin: string,
  clerk: string,
  treasury: string,
  active: boolean,
  authTokenId: i32,
  authTokenType: i8,
  executedBy: string,
  metadataUri: string
): SellerUpdateApplied {
  const sellerUpdateAppliedEvent = changetype<SellerUpdateApplied>(
    newMockEvent()
  );
  sellerUpdateAppliedEvent.parameters = [];

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const sellerParam = new ethereum.EventParam(
    "seller",
    ethereum.Value.fromTuple(
      createSellerStruct(
        sellerId,
        assistant,
        admin,
        clerk,
        treasury,
        active,
        metadataUri
      )
    )
  );
  const pendingSellerParam = new ethereum.EventParam(
    "pendingSeller",
    ethereum.Value.fromTuple(
      createSellerStruct(
        sellerId,
        assistant,
        admin,
        clerk,
        treasury,
        active,
        metadataUri
      )
    )
  );
  const authTokenParam = new ethereum.EventParam(
    "authToken",
    ethereum.Value.fromTuple(createAuthToken(authTokenId, authTokenType))
  );
  const pendingAuthTokenParam = new ethereum.EventParam(
    "pendingAuthToken",
    ethereum.Value.fromTuple(createAuthToken(authTokenId, authTokenType))
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  sellerUpdateAppliedEvent.parameters.push(sellerIdParam);
  sellerUpdateAppliedEvent.parameters.push(sellerParam);
  sellerUpdateAppliedEvent.parameters.push(pendingSellerParam);
  sellerUpdateAppliedEvent.parameters.push(authTokenParam);
  sellerUpdateAppliedEvent.parameters.push(pendingAuthTokenParam);
  sellerUpdateAppliedEvent.parameters.push(executedByParam);

  return sellerUpdateAppliedEvent;
}

export function createBuyerCreatedEvent(
  buyerId: i32,
  wallet: string,
  executedBy: string
): BuyerCreated {
  const buyerCreatedEvent = changetype<BuyerCreated>(newMockEvent());
  buyerCreatedEvent.parameters = [];

  const buyerIdParam = new ethereum.EventParam(
    "buyerId",
    ethereum.Value.fromI32(buyerId)
  );
  const buyerParam = new ethereum.EventParam(
    "buyer",
    ethereum.Value.fromTuple(createBuyerStruct(buyerId, wallet, true))
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  buyerCreatedEvent.parameters.push(buyerIdParam);
  buyerCreatedEvent.parameters.push(buyerParam);
  buyerCreatedEvent.parameters.push(executedByParam);

  return buyerCreatedEvent;
}

export function createFundsDepositedEvent(
  sellerId: i32,
  depositedBy: string,
  tokenAddress: string,
  amount: i32
): FundsDeposited {
  const fundsDepositedEvent = changetype<FundsDeposited>(newMockEvent());
  fundsDepositedEvent.parameters = [];

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const depositedByParam = new ethereum.EventParam(
    "depositedBy",
    ethereum.Value.fromAddress(Address.fromString(depositedBy))
  );
  const tokenAddressParam = new ethereum.EventParam(
    "tokenAddress",
    ethereum.Value.fromAddress(Address.fromString(tokenAddress))
  );
  const amountParam = new ethereum.EventParam(
    "amount",
    ethereum.Value.fromI32(amount)
  );

  fundsDepositedEvent.parameters.push(sellerIdParam);
  fundsDepositedEvent.parameters.push(depositedByParam);
  fundsDepositedEvent.parameters.push(tokenAddressParam);
  fundsDepositedEvent.parameters.push(amountParam);

  return fundsDepositedEvent;
}

export function createFundsEncumberedEvent(
  entityId: i32,
  exchangeToken: string,
  amount: i32,
  executedBy: string
): FundsEncumbered {
  const fundsEncumberedEvent = changetype<FundsEncumbered>(newMockEvent());
  fundsEncumberedEvent.parameters = [];

  const entityIdParam = new ethereum.EventParam(
    "entityId",
    ethereum.Value.fromI32(entityId)
  );
  const exchangeTokenParam = new ethereum.EventParam(
    "exchangeToken",
    ethereum.Value.fromAddress(Address.fromString(exchangeToken))
  );
  const amountParam = new ethereum.EventParam(
    "amount",
    ethereum.Value.fromI32(amount)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  fundsEncumberedEvent.parameters.push(entityIdParam);
  fundsEncumberedEvent.parameters.push(exchangeTokenParam);
  fundsEncumberedEvent.parameters.push(amountParam);
  fundsEncumberedEvent.parameters.push(executedByParam);

  return fundsEncumberedEvent;
}

export function createFundsReleasedEvent(
  exchangeId: i32,
  entityId: i32,
  exchangeToken: string,
  amount: i32,
  executedBy: string
): FundsReleased {
  const fundsReleasedEvent = changetype<FundsReleased>(newMockEvent());
  fundsReleasedEvent.parameters = [];

  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const entityIdParam = new ethereum.EventParam(
    "entityId",
    ethereum.Value.fromI32(entityId)
  );
  const exchangeTokenParam = new ethereum.EventParam(
    "exchangeToken",
    ethereum.Value.fromAddress(Address.fromString(exchangeToken))
  );
  const amountParam = new ethereum.EventParam(
    "amount",
    ethereum.Value.fromI32(amount)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  fundsReleasedEvent.parameters.push(exchangeIdParam);
  fundsReleasedEvent.parameters.push(entityIdParam);
  fundsReleasedEvent.parameters.push(exchangeTokenParam);
  fundsReleasedEvent.parameters.push(amountParam);
  fundsReleasedEvent.parameters.push(executedByParam);

  return fundsReleasedEvent;
}

export function createFundsWithdrawnEvent(
  sellerId: i32,
  withdrawnTo: string,
  tokenAddress: string,
  amount: i32,
  executedBy: string
): FundsWithdrawn {
  const fundsWithdrawnEvent = changetype<FundsWithdrawn>(newMockEvent());
  fundsWithdrawnEvent.parameters = [];

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const withdrawnToParam = new ethereum.EventParam(
    "withdrawnTo",
    ethereum.Value.fromAddress(Address.fromString(withdrawnTo))
  );
  const tokenAddressParam = new ethereum.EventParam(
    "tokenAddress",
    ethereum.Value.fromAddress(Address.fromString(tokenAddress))
  );
  const amountParam = new ethereum.EventParam(
    "amount",
    ethereum.Value.fromI32(amount)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  fundsWithdrawnEvent.parameters.push(sellerIdParam);
  fundsWithdrawnEvent.parameters.push(withdrawnToParam);
  fundsWithdrawnEvent.parameters.push(tokenAddressParam);
  fundsWithdrawnEvent.parameters.push(amountParam);
  fundsWithdrawnEvent.parameters.push(executedByParam);

  return fundsWithdrawnEvent;
}

export function createOfferStruct(
  offerId: i32,
  sellerId: i32,
  price: i32,
  sellerDeposit: i32,
  buyerCancelPenalty: i32,
  quantityAvailable: i32,
  exchangeToken: string,
  priceType: i8,
  metadataUri: string,
  metadataHash: string,
  voided: boolean,
  collectionIndex: i32,
  royaltyInfo: RoyaltyInfo
): OfferCreatedOfferStruct {
  const tuple = new OfferCreatedOfferStruct();
  tuple.push(ethereum.Value.fromI32(offerId));
  tuple.push(ethereum.Value.fromI32(sellerId));
  tuple.push(ethereum.Value.fromI32(price));
  tuple.push(ethereum.Value.fromI32(sellerDeposit));
  tuple.push(ethereum.Value.fromI32(buyerCancelPenalty));
  tuple.push(ethereum.Value.fromI32(quantityAvailable));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(exchangeToken)));
  tuple.push(ethereum.Value.fromI32(priceType));
  tuple.push(ethereum.Value.fromString(metadataUri));
  tuple.push(ethereum.Value.fromString(metadataHash));
  tuple.push(ethereum.Value.fromBoolean(voided));
  tuple.push(ethereum.Value.fromI32(collectionIndex));
  tuple.push(
    ethereum.Value.fromTupleArray([createRoyaltyInfoStruct(royaltyInfo)])
  );
  return tuple;
}

export function createOfferStructLegacy(
  offerId: i32,
  sellerId: i32,
  price: i32,
  sellerDeposit: i32,
  buyerCancelPenalty: i32,
  quantityAvailable: i32,
  exchangeToken: string,
  metadataUri: string,
  metadataHash: string,
  voided: boolean
): OfferCreatedOfferStructLegacy {
  const tuple = new OfferCreatedOfferStructLegacy();
  tuple.push(ethereum.Value.fromI32(offerId));
  tuple.push(ethereum.Value.fromI32(sellerId));
  tuple.push(ethereum.Value.fromI32(price));
  tuple.push(ethereum.Value.fromI32(sellerDeposit));
  tuple.push(ethereum.Value.fromI32(buyerCancelPenalty));
  tuple.push(ethereum.Value.fromI32(quantityAvailable));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(exchangeToken)));
  tuple.push(ethereum.Value.fromString(metadataUri));
  tuple.push(ethereum.Value.fromString(metadataHash));
  tuple.push(ethereum.Value.fromBoolean(voided));
  return tuple;
}

export function createOfferDatesStruct(
  validFromDate: i32,
  validUntilDate: i32,
  voucherRedeemableFromDate: i32,
  voucherRedeemableUntilDate: i32
): OfferCreatedOfferDatesStruct {
  const tuple = new OfferCreatedOfferDatesStruct();
  tuple.push(ethereum.Value.fromI32(validFromDate));
  tuple.push(ethereum.Value.fromI32(validUntilDate));
  tuple.push(ethereum.Value.fromI32(voucherRedeemableFromDate));
  tuple.push(ethereum.Value.fromI32(voucherRedeemableUntilDate));
  return tuple;
}

export function createOfferDurationsStruct(
  disputePeriodDuration: i32,
  voucherValidDuration: i32,
  resolutionPeriodDuration: i32
): OfferCreatedOfferDurationsStruct {
  const tuple = new OfferCreatedOfferDurationsStruct();
  tuple.push(ethereum.Value.fromI32(disputePeriodDuration));
  tuple.push(ethereum.Value.fromI32(voucherValidDuration));
  tuple.push(ethereum.Value.fromI32(resolutionPeriodDuration));
  return tuple;
}

export function createOfferFeesStruct(
  protocolFee: i32,
  agentFee: i32
): OfferCreatedOfferFeesStruct {
  const tuple = new OfferCreatedOfferFeesStruct();
  tuple.push(ethereum.Value.fromI32(protocolFee));
  tuple.push(ethereum.Value.fromI32(agentFee));
  return tuple;
}

export function createRoyaltyInfoStruct(
  royaltyInfo: RoyaltyInfo
): OfferCreatedOfferRoyaltyInfoStruct {
  const tuple = new OfferCreatedOfferRoyaltyInfoStruct();
  const recipientAddresses: Address[] = [];
  for (let i = 0; i < royaltyInfo.recipients.length; i++) {
    recipientAddresses.push(Address.fromString(royaltyInfo.recipients[i]));
  }
  tuple.push(ethereum.Value.fromAddressArray(recipientAddresses));
  tuple.push(ethereum.Value.fromI32Array(royaltyInfo.bps));
  return tuple;
}

export function createRoyaltyRecipientInfoStruct(
  wallet: string,
  minRoyaltyPercentage: i32
): RoyaltyRecipientsChangedRoyaltyRecipientsStruct {
  const tuple = new RoyaltyRecipientsChangedRoyaltyRecipientsStruct();
  tuple.push(ethereum.Value.fromAddress(Address.fromString(wallet)));
  tuple.push(ethereum.Value.fromI32(minRoyaltyPercentage));
  return tuple;
}

export function createDisputeResolutionTermsStruct(
  disputeResolverId: i32,
  escalationResponsePeriod: i32,
  feeAmount: i32,
  buyerEscalationDeposit: i32
): OfferCreatedDisputeResolutionTermsStruct {
  const tuple = new OfferCreatedDisputeResolutionTermsStruct();
  tuple.push(ethereum.Value.fromI32(disputeResolverId));
  tuple.push(ethereum.Value.fromI32(escalationResponsePeriod));
  tuple.push(ethereum.Value.fromI32(feeAmount));
  tuple.push(ethereum.Value.fromI32(buyerEscalationDeposit));
  return tuple;
}

export function createLegacySellerStruct(
  sellerId: i32,
  assistant: string,
  admin: string,
  clerk: string,
  treasury: string,
  active: boolean
): SellerCreatedLegacySellerStruct {
  const tuple = new SellerCreatedLegacySellerStruct();
  tuple.push(ethereum.Value.fromI32(sellerId));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(assistant)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(admin)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(clerk)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(treasury)));
  tuple.push(ethereum.Value.fromBoolean(active));
  return tuple;
}

export function createSellerStruct(
  sellerId: i32,
  assistant: string,
  admin: string,
  clerk: string,
  treasury: string,
  active: boolean,
  metadataUri: string
): SellerCreatedSellerStruct {
  const tuple = new SellerCreatedSellerStruct();
  tuple.push(ethereum.Value.fromI32(sellerId));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(assistant)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(admin)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(clerk)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(treasury)));
  tuple.push(ethereum.Value.fromBoolean(active));
  tuple.push(ethereum.Value.fromString(metadataUri));
  return tuple;
}

export function createAuthToken(
  authTokenId: i32,
  authTokenType: i8
): SellerCreatedAuthTokenStruct {
  const tuple = new SellerCreatedAuthTokenStruct();
  tuple.push(ethereum.Value.fromI32(authTokenId));
  tuple.push(ethereum.Value.fromI32(authTokenType)); // not sure about fromI32 here...
  return tuple;
}

export function createBuyerStruct(
  buyerId: i32,
  wallet: string,
  active: boolean
): BuyerCreatedBuyerStruct {
  const tuple = new BuyerCreatedBuyerStruct();
  tuple.push(ethereum.Value.fromI32(buyerId));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(wallet)));
  tuple.push(ethereum.Value.fromBoolean(active));
  return tuple;
}

export function mockCreateProduct(
  sellerId: string,
  uuid: string,
  version: i32
): ProductV1Product {
  const productId = getProductId(sellerId, uuid, version.toString());
  const product = new ProductV1Product(productId);
  product.uuid = uuid;
  product.version = version;
  product.title = "";
  product.description = "";
  product.disputeResolverId = BigInt.zero();
  product.productionInformation_brandName = "brand";
  product.brand = "brand";
  product.details_offerCategory = "";
  product.offerCategory = "PHYSICAL";
  const media = new ProductV1Media("mediaId");
  media.url = "...";
  media.type = "IMAGE";
  product.visuals_images = [media.id];
  product.sellerId = BigInt.zero();
  product.minValidFromDate = BigInt.zero();
  product.maxValidFromDate = BigInt.zero();
  product.minValidUntilDate = BigInt.zero();
  product.maxValidUntilDate = BigInt.zero();

  product.save();
  return product;
}

export function createSeller(
  sellerId: i32,
  sellerAddress: string,
  sellerMetadataFilepath: string,
  voucherCloneAddress: string,
  sellerMetadataHash: string
): string {
  mockBosonVoucherContractCalls(voucherCloneAddress, "ipfs://", 0);
  mockIpfsFile(sellerMetadataHash, sellerMetadataFilepath);
  const sellerCreatedEvent = createSellerCreatedEvent(
    sellerId,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    sellerAddress,
    voucherCloneAddress,
    0,
    0,
    sellerAddress,
    "ipfs://" + sellerMetadataHash
  );

  handleSellerCreatedEvent(sellerCreatedEvent);
  return sellerId.toString();
}

export function createGroupStruct(
  groupId: i32,
  sellerId: i32,
  offerIds: i32[]
): GroupCreatedGroupStruct {
  const tuple = new GroupCreatedGroupStruct();
  tuple.push(ethereum.Value.fromI32(groupId));
  tuple.push(ethereum.Value.fromI32(sellerId));
  tuple.push(ethereum.Value.fromI32Array(offerIds));
  return tuple;
}

export function createConditionStruct(
  method: i8,
  tokenType: i8,
  tokenAddress: string,
  gating: i8,
  minTokenId: i32,
  threshold: i32,
  maxCommits: i32,
  maxTokenId: i32
): GroupCreatedConditionStruct {
  const tuple = new GroupCreatedConditionStruct();
  tuple.push(ethereum.Value.fromI32(method));
  tuple.push(ethereum.Value.fromI32(tokenType));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(tokenAddress)));
  tuple.push(ethereum.Value.fromI32(gating));
  tuple.push(ethereum.Value.fromI32(minTokenId));
  tuple.push(ethereum.Value.fromI32(threshold));
  tuple.push(ethereum.Value.fromI32(maxCommits));
  tuple.push(ethereum.Value.fromI32(maxTokenId));
  return tuple;
}

export function createGroupCreatedEvent(
  groupId: i32,
  sellerId: i32,
  offerIds: i32[],
  method: i8,
  tokenType: i8,
  tokenAddress: string,
  gating: i8,
  minTokenId: i32,
  threshold: i32,
  maxCommits: i32,
  maxTokenId: i32,
  executedBy: string
): GroupCreated {
  const groupCreatedEvent = changetype<GroupCreated>(newMockEvent());
  groupCreatedEvent.parameters = [];

  const groupIdParam = new ethereum.EventParam(
    "groupId",
    ethereum.Value.fromI32(groupId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const groupParam = new ethereum.EventParam(
    "group",
    ethereum.Value.fromTuple(createGroupStruct(groupId, sellerId, offerIds))
  );
  const conditionParam = new ethereum.EventParam(
    "condition",
    ethereum.Value.fromTuple(
      createConditionStruct(
        method,
        tokenType,
        tokenAddress,
        gating,
        minTokenId,
        threshold,
        maxCommits,
        maxTokenId
      )
    )
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  groupCreatedEvent.parameters.push(groupIdParam);
  groupCreatedEvent.parameters.push(sellerIdParam);
  groupCreatedEvent.parameters.push(groupParam);
  groupCreatedEvent.parameters.push(conditionParam);
  groupCreatedEvent.parameters.push(executedByParam);
  return groupCreatedEvent;
}

export function createGroupUpdatedEvent(
  groupId: i32,
  sellerId: i32,
  offerIds: i32[],
  method: i8,
  tokenType: i8,
  tokenAddress: string,
  gating: i8,
  minTokenId: i32,
  threshold: i32,
  maxCommits: i32,
  maxTokenId: i32,
  executedBy: string
): GroupUpdated {
  const groupUpdatedEvent = changetype<GroupUpdated>(newMockEvent());
  groupUpdatedEvent.parameters = [];

  const groupIdParam = new ethereum.EventParam(
    "groupId",
    ethereum.Value.fromI32(groupId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const groupParam = new ethereum.EventParam(
    "group",
    ethereum.Value.fromTuple(createGroupStruct(groupId, sellerId, offerIds))
  );
  const conditionParam = new ethereum.EventParam(
    "condition",
    ethereum.Value.fromTuple(
      createConditionStruct(
        method,
        tokenType,
        tokenAddress,
        gating,
        minTokenId,
        threshold,
        maxCommits,
        maxTokenId
      )
    )
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  groupUpdatedEvent.parameters.push(groupIdParam);
  groupUpdatedEvent.parameters.push(sellerIdParam);
  groupUpdatedEvent.parameters.push(groupParam);
  groupUpdatedEvent.parameters.push(conditionParam);
  groupUpdatedEvent.parameters.push(executedByParam);
  return groupUpdatedEvent;
}

export function mockOffer(offerId: string, sellerId: string): Offer {
  const metadataHash = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";
  mockIpfsFile(metadataHash, "tests/metadata/product-v1-full.json");
  const offer = new Offer(offerId);
  offer.createdAt = BigInt.fromI32(0);
  offer.price = BigInt.fromI32(100);
  offer.priceType = i8(0);
  offer.sellerDeposit = BigInt.fromI32(5);
  offer.protocolFee = BigInt.fromI32(1);
  offer.agentFee = BigInt.fromI32(0);
  offer.agentId = BigInt.fromI32(0);
  offer.buyerCancelPenalty = BigInt.fromI32(2);
  offer.quantityInitial = BigInt.fromI32(10);
  offer.quantityAvailable = BigInt.fromI32(10);
  offer.validFromDate = BigInt.fromI32(0);
  offer.validUntilDate = BigInt.fromI32(0);
  offer.voucherRedeemableFromDate = BigInt.fromI32(0);
  offer.voucherRedeemableUntilDate = BigInt.fromI32(0);
  offer.disputePeriodDuration = BigInt.fromI32(0);
  offer.voucherValidDuration = BigInt.fromI32(0);
  offer.resolutionPeriodDuration = BigInt.fromI32(0);
  offer.metadataUri = `ipfs://${metadataHash}`;
  offer.metadataHash = metadataHash;
  offer.voided = false;
  offer.collectionIndex = BigInt.fromI32(0);
  offer.collection = getOfferCollectionId(sellerId, "0");
  offer.disputeResolverId = BigInt.fromI32(5);
  offer.disputeResolver = "5";
  offer.disputeResolutionTerms = getDisputeResolutionTermsId("5", offerId);
  offer.sellerId = BigInt.fromString(sellerId);
  offer.seller = sellerId;
  offer.exchangeToken = "0xaaaaabbbbbcccccdddddeeeeefffff0000011111";
  offer.numberOfCommits = BigInt.fromI32(0);
  offer.numberOfRedemptions = BigInt.fromI32(0);
  offer.save();
  return offer;
}

export function mockSeller(sellerId: string): Seller {
  const seller = new Seller(sellerId);
  seller.sellerId = BigInt.fromString(sellerId);
  seller.assistant = Bytes.fromHexString(
    "0x0000000000111111111122222222223333333333"
  );
  seller.admin = Bytes.fromHexString(
    "0x0000000000111111111122222222223333333333"
  );
  seller.clerk = Bytes.fromHexString(
    "0x0000000000000000000000000000000000000000"
  );
  seller.treasury = Bytes.fromHexString(
    "0x0000000000111111111122222222223333333333"
  );
  seller.active = true;
  seller.voucherCloneAddress = Bytes.fromHexString(
    "0x4444444444111111111122222222223333333333"
  );
  seller.authTokenType = 0;
  seller.authTokenId = BigInt.fromI32(0);
  seller.metadataUri = "ipfs://sellerMetadataUri";
  seller.save();
  return seller;
}

export function createRoyaltyRecipientsChanged(
  sellerId: i32,
  recipients: string[],
  minRoyaltyPercentages: i32[],
  executedBy: string
): RoyaltyRecipientsChanged {
  const royaltyRecipientsChangedEvent = changetype<RoyaltyRecipientsChanged>(
    newMockEvent()
  );
  royaltyRecipientsChangedEvent.parameters = [];
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const royaltyRecipientStructs: ethereum.Tuple[] = [];
  for (let i = 0; i < recipients.length; i++) {
    const wallet = recipients[i];
    const minRoyaltyPercentage = minRoyaltyPercentages[i];
    royaltyRecipientStructs.push(
      createRoyaltyRecipientInfoStruct(wallet, minRoyaltyPercentage)
    );
  }
  const royaltyRecipientsParam = new ethereum.EventParam(
    "royaltyRecipients",
    ethereum.Value.fromTupleArray(royaltyRecipientStructs)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  royaltyRecipientsChangedEvent.parameters.push(sellerIdParam);
  royaltyRecipientsChangedEvent.parameters.push(royaltyRecipientsParam);
  royaltyRecipientsChangedEvent.parameters.push(executedByParam);

  return royaltyRecipientsChangedEvent;
}

export function mockExchange(
  exchangeId: string,
  offerId: string,
  sellerId: string,
  buyerId: string,
  disputeResolverId: string
): Exchange {
  const exchange = new Exchange(exchangeId);
  exchange.offer = offerId;
  exchange.buyer = buyerId;
  exchange.seller = sellerId;
  exchange.disputeResolver = disputeResolverId;
  exchange.disputed = false;
  exchange.state = "COMMITTED";
  exchange.committedDate = BigInt.zero();
  exchange.validUntilDate = BigInt.zero();
  exchange.expired = false;

  exchange.save();
  return exchange;
}

export function createOfferExtendedEvent(
  offerId: i32,
  sellerId: i32,
  validUntilDate: i32,
  executedBy: string
): OfferExtended {
  const offerExtendedEvent = changetype<OfferExtended>(newMockEvent());
  offerExtendedEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const validUntilDateParam = new ethereum.EventParam(
    "validUntilDate",
    ethereum.Value.fromI32(validUntilDate)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  offerExtendedEvent.parameters.push(offerIdParam);
  offerExtendedEvent.parameters.push(sellerIdParam);
  offerExtendedEvent.parameters.push(validUntilDateParam);
  offerExtendedEvent.parameters.push(executedByParam);

  return offerExtendedEvent;
}

export function createRangeReservedEvent(
  offerId: i32,
  sellerId: i32,
  startExchangeId: i32,
  endExchangeId: i32,
  owner: string,
  executedBy: string
): RangeReserved {
  const rangeReservedEvent = changetype<RangeReserved>(newMockEvent());
  rangeReservedEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const startExchangeIdParam = new ethereum.EventParam(
    "startExchangeId",
    ethereum.Value.fromI32(startExchangeId)
  );
  const endExchangeIdParam = new ethereum.EventParam(
    "endExchangeId",
    ethereum.Value.fromI32(endExchangeId)
  );
  const ownerParam = new ethereum.EventParam(
    "owner",
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  rangeReservedEvent.parameters.push(offerIdParam);
  rangeReservedEvent.parameters.push(sellerIdParam);
  rangeReservedEvent.parameters.push(startExchangeIdParam);
  rangeReservedEvent.parameters.push(endExchangeIdParam);
  rangeReservedEvent.parameters.push(ownerParam);
  rangeReservedEvent.parameters.push(executedByParam);

  return rangeReservedEvent;
}

export function createVoucherRevokedEvent(
  offerId: i32,
  exchangeId: i32,
  executedBy: string
): VoucherRevoked {
  const voucherRevokedEvent = changetype<VoucherRevoked>(newMockEvent());
  voucherRevokedEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  voucherRevokedEvent.parameters.push(offerIdParam);
  voucherRevokedEvent.parameters.push(exchangeIdParam);
  voucherRevokedEvent.parameters.push(executedByParam);
  return voucherRevokedEvent;
}

export function createVoucherCanceledEvent(
  offerId: i32,
  exchangeId: i32,
  executedBy: string
): VoucherCanceled {
  const voucherCanceledEvent = changetype<VoucherCanceled>(newMockEvent());
  voucherCanceledEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  voucherCanceledEvent.parameters.push(offerIdParam);
  voucherCanceledEvent.parameters.push(exchangeIdParam);
  voucherCanceledEvent.parameters.push(executedByParam);
  return voucherCanceledEvent;
}

export function createVoucherRedeemedEvent(
  offerId: i32,
  exchangeId: i32,
  executedBy: string
): VoucherRedeemed {
  const voucherRedeemedEvent = changetype<VoucherRedeemed>(newMockEvent());
  voucherRedeemedEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  voucherRedeemedEvent.parameters.push(offerIdParam);
  voucherRedeemedEvent.parameters.push(exchangeIdParam);
  voucherRedeemedEvent.parameters.push(executedByParam);
  return voucherRedeemedEvent;
}

export function createVoucherExpiredEvent(
  offerId: i32,
  exchangeId: i32,
  executedBy: string
): VoucherExpired {
  const voucherExpiredEvent = changetype<VoucherExpired>(newMockEvent());
  voucherExpiredEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  voucherExpiredEvent.parameters.push(offerIdParam);
  voucherExpiredEvent.parameters.push(exchangeIdParam);
  voucherExpiredEvent.parameters.push(executedByParam);
  return voucherExpiredEvent;
}

export function createVoucherTransferredEvent(
  offerId: i32,
  exchangeId: i32,
  newBuyerId: i32,
  executedBy: string
): VoucherTransferred {
  const voucherTransferredEvent = changetype<VoucherTransferred>(
    newMockEvent()
  );
  voucherTransferredEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const newBuyerIdParam = new ethereum.EventParam(
    "newBuyerId",
    ethereum.Value.fromI32(newBuyerId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  voucherTransferredEvent.parameters.push(offerIdParam);
  voucherTransferredEvent.parameters.push(exchangeIdParam);
  voucherTransferredEvent.parameters.push(newBuyerIdParam);
  voucherTransferredEvent.parameters.push(executedByParam);
  return voucherTransferredEvent;
}

export function createExchangeCompletedEvent(
  offerId: i32,
  buyerId: i32,
  exchangeId: i32,
  executedBy: string
): ExchangeCompleted {
  const exchangeCompletedEvent = changetype<ExchangeCompleted>(newMockEvent());
  exchangeCompletedEvent.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const buyerIdParam = new ethereum.EventParam(
    "buyerId",
    ethereum.Value.fromI32(buyerId)
  );
  const exchangeIdParam = new ethereum.EventParam(
    "exchangeId",
    ethereum.Value.fromI32(exchangeId)
  );
  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );
  exchangeCompletedEvent.parameters.push(offerIdParam);
  exchangeCompletedEvent.parameters.push(buyerIdParam);
  exchangeCompletedEvent.parameters.push(exchangeIdParam);
  exchangeCompletedEvent.parameters.push(executedByParam);
  return exchangeCompletedEvent;
}

export function createConditionalCommitAuthorizedEvent(
  offerId: i32,
  gating: i8,
  buyerAddress: string,
  tokenId: i32,
  commitCount: i32,
  maxCommits: i32
): ConditionalCommitAuthorized {
  const conditionalCommitAuthorized = changetype<ConditionalCommitAuthorized>(
    newMockEvent()
  );
  conditionalCommitAuthorized.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const gatingParam = new ethereum.EventParam(
    "gating",
    ethereum.Value.fromI32(gating)
  );
  const buyerAddressParam = new ethereum.EventParam(
    "buyerAddress",
    ethereum.Value.fromAddress(Address.fromString(buyerAddress))
  );
  const tokenIdParam = new ethereum.EventParam(
    "tokenId",
    ethereum.Value.fromI32(tokenId)
  );
  const commitCountParam = new ethereum.EventParam(
    "commitCount",
    ethereum.Value.fromI32(commitCount)
  );
  const maxCommitsParam = new ethereum.EventParam(
    "maxCommits",
    ethereum.Value.fromI32(maxCommits)
  );
  conditionalCommitAuthorized.parameters.push(offerIdParam);
  conditionalCommitAuthorized.parameters.push(gatingParam);
  conditionalCommitAuthorized.parameters.push(buyerAddressParam);
  conditionalCommitAuthorized.parameters.push(tokenIdParam);
  conditionalCommitAuthorized.parameters.push(commitCountParam);
  conditionalCommitAuthorized.parameters.push(maxCommitsParam);
  return conditionalCommitAuthorized;
}

export function createOfferRoyaltyInfoUpdatedEvent(
  offerId: i32,
  sellerId: i32,
  royaltyInfo: RoyaltyInfo,
  executedBy: string
): OfferRoyaltyInfoUpdated {
  const offerRoyaltyInfoUpdated = changetype<OfferRoyaltyInfoUpdated>(
    newMockEvent()
  );
  offerRoyaltyInfoUpdated.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );

  const offerRoyaltyInfoUpdatedRoyaltyInfoStruct =
    new OfferRoyaltyInfoUpdatedRoyaltyInfoStruct();
  const recipientAddresses: Address[] = [];
  for (let i = 0; i < royaltyInfo.recipients.length; i++) {
    recipientAddresses.push(Address.fromString(royaltyInfo.recipients[i]));
  }
  offerRoyaltyInfoUpdatedRoyaltyInfoStruct.push(
    ethereum.Value.fromAddressArray(recipientAddresses)
  );
  offerRoyaltyInfoUpdatedRoyaltyInfoStruct.push(
    ethereum.Value.fromI32Array(royaltyInfo.bps)
  );
  const royaltyInfoParam = new ethereum.EventParam(
    "royaltyInfo",
    ethereum.Value.fromTuple(offerRoyaltyInfoUpdatedRoyaltyInfoStruct)
  );

  const executedByParam = new ethereum.EventParam(
    "executedBy",
    ethereum.Value.fromAddress(Address.fromString(executedBy))
  );

  offerRoyaltyInfoUpdated.parameters.push(offerIdParam);
  offerRoyaltyInfoUpdated.parameters.push(sellerIdParam);
  offerRoyaltyInfoUpdated.parameters.push(royaltyInfoParam);
  offerRoyaltyInfoUpdated.parameters.push(executedByParam);

  return offerRoyaltyInfoUpdated;
}

export function createVouchersPreMinted(
  offerId: i32,
  startId: i32,
  endId: i32
): VouchersPreMinted {
  const vouchersPreMinted = changetype<VouchersPreMinted>(newMockEvent());
  vouchersPreMinted.parameters = [];
  const offerIdParam = new ethereum.EventParam(
    "offerId",
    ethereum.Value.fromI32(offerId)
  );
  const startIdParam = new ethereum.EventParam(
    "startId",
    ethereum.Value.fromI32(startId)
  );
  const endIdParam = new ethereum.EventParam(
    "endId",
    ethereum.Value.fromI32(endId)
  );

  vouchersPreMinted.parameters.push(offerIdParam);
  vouchersPreMinted.parameters.push(startIdParam);
  vouchersPreMinted.parameters.push(endIdParam);

  return vouchersPreMinted;
}

export function createContractURIChanged(
  contractAddress: Address,
  contractURI: string
): ContractURIChanged {
  const contractURIChanged = changetype<ContractURIChanged>(newMockEvent());
  contractURIChanged.parameters = [];
  contractURIChanged.address = contractAddress;
  const contractURIParam = new ethereum.EventParam(
    "contractURI",
    ethereum.Value.fromString(contractURI)
  );

  contractURIChanged.parameters.push(contractURIParam);

  return contractURIChanged;
}
