# Synthesis: `createOfferAndCommit` in core-sdk.test.ts

## What the method does

`createOfferAndCommit` (helper in `e2e/tests/utils.ts:660`) atomically:
1. Has the **offer creator** sign the offer (`signFullOffer`)
2. Has the **committer** broadcast a single blockchain transaction that both *creates* the offer and *commits* to it
3. Waits for the tx receipt, extracts `offerId` and `exchangeId` from logs
4. Waits for the graph node to index the transaction
5. Returns `{ offer, exchange }` fetched from the subgraph

Signature:
```ts
createOfferAndCommit(
  committerCoreSDK: CoreSDK,   // the party who sends the tx and commits
  offerCreatorCoreSDK: CoreSDK, // the party who signs the offer
  fullOfferArgsUnsigned: Omit<FullOfferArgs, "signature">
): Promise<{ offer, exchange }>
```

The underlying SDK method `CoreSDK.createOfferAndCommit()` also accepts `{ returnTxInfo: true }` to return raw tx data instead of broadcasting.

---

## Two Main Use-Cases

### 1. Seller-Initiated Offers (`describe("seller-initiated offers")`)
- **Offer creator** = seller (`sellerCoreSDK`)
- **Committer** = buyer (`buyerCoreSDK`)
- The seller pre-signs the offer; the buyer calls the combined tx
- `quantityInitial` > 1 → multiple buyers can commit sequentially
- After first commit: `quantityAvailable = quantityInitial - 1`

### 2. Buyer-Initiated Offers (`describe("buyer-initiated offers")`)
- **Offer creator** = buyer (`buyerCoreSDK`)
- **Committer** = seller (`sellerCoreSDK`)
- The buyer pre-signs the offer; the seller calls the combined tx
- `quantityAvailable` is always **1** → offer is sold out immediately after one commit
- A second buyer attempting to commit gets: `"Offer with id X is sold out"`

---

## Prerequisites

### 1. Funded wallets for both parties
`initSellerAndBuyerSDKs` (`utils.ts:263`) creates two fresh wallets (seller + buyer), each funded with ETH from a seed wallet. Both parties must have enough native ETH to pay for gas (and for the commit price in native-ETH offers).

### 2. Seller account registered on-chain — `createSeller` is mandatory
`createSeller` (`utils.ts:954`) must be called before any `createOfferAndCommit`. It:
- Stores seller metadata on IPFS
- Calls `coreSDK.createSeller()` on-chain (registering `assistant`, `admin`, `treasury` addresses)
- Returns the `sellerId` that is embedded in `fullOfferArgsUnsigned`

Without a registered seller, there is no `sellerId` to reference and the offer cannot be created.

### 3. Dispute resolver must exist and be active
`checkDisputeResolver` (`core-sdk.test.ts:2215`) asserts that:
- Dispute resolver #1 exists on-chain
- `dr.active === true`
- The seller is either on its allow-list or the allow-list is open (length = 0)

This is a protocol-level requirement: every offer must reference a valid, active dispute resolver that accepts the seller.

### 4. ERC20 tokens minted and approved (ERC20 offers only)
For ERC20-token offers, `ensureMintedAndAllowedTokens` must be called for both wallets before committing.

### 5. `fullOfferArgsUnsigned` correctly built
`buildFullOfferArgs` must receive the correct `committer`/`offerCreator` addresses, `sellerId`, `creator` enum (`OfferCreator.Seller` or `OfferCreator.Buyer`), and `quantityAvailable` (> 1 for seller-initiated, = 1 for buyer-initiated).

### Summary table

| Prerequisite | Seller-initiated | Buyer-initiated |
|---|---|---|
| Both wallets funded with ETH | ✅ | ✅ |
| `createSeller` called → `sellerId` obtained | ✅ | ✅ |
| Dispute resolver active & accepts seller | ✅ | ✅ |
| ERC20 minted + approved (ERC20 tests only) | ✅ | ✅ |
| `fullOfferArgsUnsigned` built with correct roles | ✅ | ✅ |
| `quantityAvailable` > 1 | ✅ | ❌ (= 1) |

---

## Test Scenarios Covered

### Happy paths
| Test | Committer | Creator | Token |
|---|---|---|---|
| Buyer commits to native offer | buyer | seller | ETH |
| Buyer commits to ERC20 offer | buyer | seller | ERC20 |
| Seller commits to native offer | seller | buyer | ETH |
| Seller commits to ERC20 offer | seller | buyer | ERC20 |
| Another buyer commits to same seller offer | buyer #2 | seller | ETH |

### Error / void paths
| Test | Who voids | When | Error |
|---|---|---|---|
| `voidOffer` after first commit | seller (or buyer) | after commit | `offer.voided = true`, next commit fails |
| `voidNonListedOffer` before first commit | seller (or buyer) | before commit | `"The offer has been voided"` |
| `voidNonListedOfferBatch` (3 offers) | seller (or buyer) | before commit | `"The offer has been voided"` |
| Buyer-initiated, second commit | n/a | after first commit | `"Offer with id X is sold out"` |

### Utility / inspection
| Test | Purpose |
|---|---|
| `returnTxInfo: true` | Returns `{ data, to, value }` without broadcasting |

---

## Key Assertions (successful path)
- `offer` is truthy and `offer.voided` is falsy
- `offer.seller.id` matches the seller's id
- `offer.quantityAvailable = quantityInitial - 1` (seller-initiated) or `0` (buyer-initiated)
- `exchange.state === ExchangeState.COMMITTED`
- `exchange.buyer.wallet` matches the buyer's address

---

## Files
- Helper definition: `e2e/tests/utils.ts:660`
- Test file: `e2e/tests/core-sdk.test.ts` (seller-initiated ~L245–430, buyer-initiated ~L534–680)
