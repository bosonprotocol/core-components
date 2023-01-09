# Usage with `ethers` and `IPFS`

If you want to use the `core-sdk` in combination with `ethers` and `IPFS` as the metadata storage, then follow this guide.

## Install

```bash
npm i @bosonprotocol/core-sdk @bosonprotocol/ethers-sdk @bosonprotocol/ipfs-storage ethers
```

## Initialize

### Explicit

The `core-sdk` can be initialized by explicitly passing in the required arguments

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { ethers } from "ethers";

// injected web3 provider
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

// initialize explicitly
const coreSDK = new CoreSDK({
  web3Lib: new EthersAdapter(web3Provider),
  subgraphUrl: "https://api.thegraph.com/subgraphs/name/bosonprotocol/cc",
  protocolDiamond: "0x5E3f5127e320aD0C38a21970E327eefEf12561E5",
  chainId: 137,
  // optional
  metadataStorage: new IpfsMetadata({
    url: "https://ipfs.infura.io:5001"
  }),
  // optional
  theGraphStorage: new IpfsMetadata({
    url: "https://api.thegraph.com/ipfs/api/v0"
  })
});
```

### Default configuration

It is also possible to use the default configuration provided through the [`@bosonprotocol/common`](/packages/common/README.md) package.
Take a look at [`configs.ts`](/packages/common/src/configs.ts) to see the available default configurations.

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { ethers } from "ethers";

// injected web3 provider
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

// initialize via default config of "testing" environment
const coreSDK = CoreSDK.fromDefaultConfig({
  web3Lib: new EthersAdapter(web3Provider),
  envName: "testing"
  // ...other optional args
});
```

## Create an offer

After initializing an instance of the `CoreSDK` as described above, you can create an offer.

### 1. Upload offer metadata to IPFS

To create an offer, first upload the offer metadata to `IPFS`

```ts
const cid = await coreSDK.storeMetadata(offerMetadata);
```

### 2. Create seller account

If this is the first offer, the connected signer creates, then you first need to create a seller account by calling

```ts
const txResponse = await coresSDK.createSeller({
  operator: "...",
  admin: "...",
  clerk: "...",
  treasury: "...",
  contractUri: "...",
  royaltyPercentage: "...",
  authTokenId: "...",
  authTokenType: "..."
});
const receipt = await txResponse.wait();
const createdSellerId = coreSDK.getCreatedSellerIdFromLogs(receipt.logs);
```

### 3. Create offer

Now create an offer by calling

```ts
const txResponse = await coresSDK.createOffer({
  price: "...",
  sellerDeposit: "...",
  agentId: "...",
  buyerCancelPenalty: "...",
  quantityAvailable: "...",
  validFromDateInMS: "...",
  validUntilDateInMS: "...",
  voucherRedeemableFromDateInMS: "...",
  voucherRedeemableUntilDateInMS: "...",
  disputePeriodDurationInMS: "...",
  resolutionPeriodDurationInMS: "...",
  exchangeToken: "...",
  disputeResolverId: "...",
  metadataUri: `ipfs://${cid}`, // from step 1.
  metadataHash: cid // from step 1.
});
const receipt = await txResponse.wait();
const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(receipt.logs);
```

## Commit to an offer

After creating an offer, anyone can view and commit to that offer.

### 1. Get offer data

To retrieve all relevant data of a given offer id, you can query the subgraph

```ts
const offer = await coreSDK.getOfferById(createdOfferId);
```

The returned object contains all on-chain and off-chain data that are indexed by the subgraph.

### 2. Commit to offer

To commit to a given offer id, just call

```ts
const txResponse = await coreSDK.commitToOffer(createdOfferId);
const receipt = await coreSDK.wait();
const createdExchangeId = coreSDK.getCommittedExchangeIdFromLogs(receipt.logs);
```

If a buyer commits to an offer, an exchange gets created.
This exchange can further be redeemed, revoked, canceled, expired or completed.
