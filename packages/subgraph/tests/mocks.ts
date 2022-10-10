import { VoucherExtended } from "./../generated/BosonExchangeHandler/IBosonExchangeHandler";
import { SellerCreatedAuthTokenStruct } from "./../generated/BosonAccountHandler/IBosonAccountHandler";
import { OfferCreatedOfferFeesStruct } from "./../generated/BosonOfferHandler/IBosonOfferHandler";
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
  SellerUpdated,
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
  createMockedFunction
} from "matchstick-as/assembly/index";
import { ethereum, Address } from "@graphprotocol/graph-ts";

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
  metadataUri: string,
  metadataHash: string,
  voided: boolean,
  agentId: i32,
  executedBy: string
): OfferCreated {
  const offerCreatedEvent = changetype<OfferCreated>(newMockEvent());
  offerCreatedEvent.parameters = new Array();

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
  offerVoidedEvent.parameters = new Array();

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
  buyerCommittedEvent.parameters = new Array();

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
  voucherExtendedEvent.parameters = new Array();

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

export function createSellerCreatedEvent(
  sellerId: i32,
  operator: string,
  admin: string,
  clerk: string,
  treasury: string,
  voucherCloneAddress: string,
  authTokenId: i32,
  authTokenType: i8,
  executedBy: string
): SellerCreated {
  const sellerCreatedEvent = changetype<SellerCreated>(newMockEvent());
  sellerCreatedEvent.parameters = new Array();

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const sellerParam = new ethereum.EventParam(
    "seller",
    ethereum.Value.fromTuple(
      createSellerStruct(sellerId, operator, admin, clerk, treasury, false)
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
  operator: string,
  admin: string,
  clerk: string,
  treasury: string,
  active: boolean,
  authTokenId: i32,
  authTokenType: i8,
  executedBy: string
): SellerUpdated {
  const sellerUpdatedEvent = changetype<SellerUpdated>(newMockEvent());
  sellerUpdatedEvent.parameters = new Array();

  const sellerIdParam = new ethereum.EventParam(
    "sellerId",
    ethereum.Value.fromI32(sellerId)
  );
  const sellerParam = new ethereum.EventParam(
    "seller",
    ethereum.Value.fromTuple(
      createSellerStruct(sellerId, operator, admin, clerk, treasury, active)
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

export function createBuyerCreatedEvent(
  buyerId: i32,
  wallet: string,
  executedBy: string
): BuyerCreated {
  const buyerCreatedEvent = changetype<BuyerCreated>(newMockEvent());
  buyerCreatedEvent.parameters = new Array();

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
  fundsDepositedEvent.parameters = new Array();

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
  fundsEncumberedEvent.parameters = new Array();

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
  fundsReleasedEvent.parameters = new Array();

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
  fundsWithdrawnEvent.parameters = new Array();

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
  metadataUri: string,
  metadataHash: string,
  voided: boolean
): OfferCreatedOfferStruct {
  const tuple = new OfferCreatedOfferStruct();
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

export function createSellerStruct(
  sellerId: i32,
  operator: string,
  admin: string,
  clerk: string,
  treasury: string,
  active: boolean
): SellerCreatedSellerStruct {
  const tuple = new SellerCreatedSellerStruct();
  tuple.push(ethereum.Value.fromI32(sellerId));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(operator)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(admin)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(clerk)));
  tuple.push(ethereum.Value.fromAddress(Address.fromString(treasury)));
  tuple.push(ethereum.Value.fromBoolean(active));
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
