# Synthesis: Buyer-Initiated Offers — `core-sdk-offers.test.ts`

## Overview

In a **buyer-initiated offer**, the buyer creates the offer on-chain; the seller is the one who "commits" to it (i.e. accepts the deal). This is the reverse of the standard flow.

Key constraint: `quantityAvailable` **must be 1** — buyer-initiated offers are always single-unit.

---

## Method Involved

`sellerCoreSDK.commitToBuyerOffer(offerId, sellerParams?)` — the seller-side equivalent of `commitToOffer`. Takes an optional `sellerParams` to customise collection, mutualizer, and royalty info at commit time.

The symmetric error guards are also tested:
- `commitToOffer()` (seller-offer method) called on a buyer-initiated offer → `"Offer with id X is not seller initiated"`
- `commitToBuyerOffer()` (buyer-offer method) called on a seller-initiated offer → `"Offer with id X is not buyer initiated"`

---

## Prerequisites

### 1. Dispute resolver with a non-zero fee — created once (`beforeAll`)
A dedicated dispute resolver is created via `createDisputeResolver()` with:
- A fee of `0.0123 ETH` on the native token (`AddressZero`)
- An open seller allow-list (`[]`)

This DR is shared across all tests in the suite.

### 2. Fresh buyer + seller SDKs — created per test (`beforeEach`)
`initSellerAndBuyerSDKs(seedWallet)` produces two independent funded wallets and `CoreSDK` instances.

### 3. Buyer-initiated offer already on-chain (`beforeEach`)
`createOffer(buyerCoreSDK, { creator: OfferCreator.Buyer, quantityAvailable: 1, disputeResolverId, exchangeToken })` creates the offer as the buyer. The resulting `buyerInitiatedOffer` has:
- `offer.buyer` set (buyer's account)
- `offer.seller` **not set** yet (seller is assigned at commit time)
- `offer.creator === OfferCreator.Buyer`

### 4. Seller account registered (`beforeEach`)
`createSeller(sellerCoreSDK, sellerWallet.address)` — mandatory before committing.

### 5. Both parties deposit funds (`beforeEach`)
- **Buyer** deposits the offer price into their buyer account (`buyerCoreSDK.depositFunds(buyerInitiatedOffer.buyerId, price, token)`)
- **Seller** deposits the DR fee amount (`sellerCoreSDK.depositFunds(seller.id, drFeeAmount, token)`)

Both deposits are moved to escrow when the seller commits.

---

## Test Cases

### Happy path — basic commit

**"Seller commits to the offer, no seller param"**

The seller calls `commitToBuyerOffer(offerId)` with no extra params.

Verifications:
- Before commit: buyer's available funds = offer price; seller's available funds = DR fee
- After commit:
  - `exchange.state === ExchangeState.COMMITTED`
  - `exchange.seller.id` === seller's id; `exchange.buyer.id` === buyer's id
  - Buyer's available funds drop to `"0"` (moved to escrow)
  - Seller's available funds drop to `"0"` (moved to escrow)
  - `offer.seller` is now assigned to the committing seller

---

### Happy path — optional `sellerParams`

Three tests cover the optional parameters the seller can pass at commit time:

| Test | `sellerParams` field | What is verified |
|---|---|---|
| "set offer collection" | `{ collectionIndex: 1 }` | `exchange.offer.collectionIndex === "1"` and collection's `externalId` matches |
| "set mutualizerAddress" | `{ mutualizerAddress }` | `exchange.mutualizerAddress` matches the mutualizer contract address |
| "set royaltyInfo" | `{ royaltyInfo: { recipients, bps } }` | `exchange.offer.royaltyInfos[0]` contains the expected recipient + bps |

For the mutualizer test, an agreement must be created and its premium paid before committing (`newAgreementToDRFeeMutualizer` + `payPremiumToDRFeeMutualizer`).

For the collection test, the collection must be created first (`sellerCoreSDK.createNewCollection({ collectionId, contractUri })`).

---

### Error cases

| Test | Scenario | Error message |
|---|---|---|
| "commitToOffer() fails on buyer initiated offer" | Wrong commit method used on a buyer-initiated offer | `"Offer with id X is not seller initiated"` |
| "commitToBuyerOffer() fails on seller initiated offer" | Wrong commit method used on a standard offer | `"Offer with id X is not buyer initiated"` |
| "Quantity must be 1 for buyer initiated offers" | `createOffer` with `OfferCreator.Buyer` and `quantityAvailable: 2` | `"Quantity must be 1 for buyer initiated offers"` |

---

## Fund Flow Summary

```
beforeEach:  buyer deposits price  →  buyer account (available)
             seller deposits drFee  →  seller account (available)

commitToBuyerOffer():
             buyer available  → 0  (moved to escrow)
             seller available → 0  (moved to escrow)
```

---

## Key Assertions Checklist (successful commit)

- `exchange.state === ExchangeState.COMMITTED`
- `exchange.offer.id` matches `buyerInitiatedOffer.id`
- `exchange.seller.id` matches the committing seller's id
- `exchange.seller.assistant` matches `sellerWallet.address` (lowercase)
- `exchange.buyer.id` matches `buyerInitiatedOffer.buyerId`
- `exchange.buyer.wallet` matches `buyerWallet.address` (lowercase)
- Buyer funds `availableAmount === "0"` after commit
- Seller funds `availableAmount === "0"` after commit
- `offer.seller` is populated after commit (was falsy before)

---

## Files

- Test file: `e2e/tests/core-sdk-offers.test.ts`
- Helpers: `e2e/tests/utils.ts`
  - `commitToBuyerOffer`
  - `commitToOffer`
  - `createOffer`
  - `createSeller`
  - `createDisputeResolver`
  - `initSellerAndBuyerSDKs`
