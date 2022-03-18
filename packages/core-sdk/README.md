# `@bosonprotocol/core-sdk`

JS lib that facilitates interaction with the Boson Protocol contracts, subgraph and metadata storage.

## Install

The `core-sdk` is intended to be used in combination with implementations of the `Web3LibAdapter` and `MetadataStorage` interfaces.

If you, for example, want to use the `core-sdk` in combination with [`ethers`](https://docs.ethers.io/v5/) and `IPFS` as the metadata storage, then run

```bash
npm i @bosonprotocol/core-sdk @bosonprotocol/ethers-sdk @bosonprotocol/ipfs-storage ethers

# OR

yarn add @bosonprotocol/core-sdk @bosonprotocol/ethers-sdk @bosonprotocol/ipfs-storage ethers
```

We currently support the following

- `Web3LibAdapter` implementations:

  - `EthersAdapter` exported from [`@bosonprotocol/ethers-sdk`](/packages/ethers-sdk/README.md)
  - `EthConnectAdapter` exported from [`@bosonprotocol/eth-connect-sdk`](/packages/eth-connect-sdk/README.md)

- `MetadataStorage` implementations:
  - `IpfsMetadata` exported from [`@bosonprotocol/ipfs-storage`](/packages/ipfs-storage/README.md)

## Usage

> The following assumes the usage of the `core-sdk` with `ethers` and `IPFS` as the metadata storage.

- [Initialize sdk](#initialize)
- [Metadata](#metadata)
- [Offers](#offers)
- [Exchange token](#exchange-token)

### Initialize

#### Explicit

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

#### Default configuration

It is also possible to use the default configuration provided through the [`@bosonprotocol/common`](/packages/common/README.md) package.

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { ethers } from "ethers";

// injected web3 provider
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

// initialize via default config of chainId = 3
const coreSDK = CoreSDK.fromDefaultConfig({
  web3Lib: new EthersAdapter(web3Provider),
  chainId: 3
  // ...other args
});
```

### Metadata

For handling metadata through the `core-sdk`, make sure to pass an instance as a constructor argument

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";

const ipfsMetadata = new IpfsMetadata({ url: "https://ipfs.infura.io:5001" });
const coreSDK = CoreSDK.fromDefaultConfig({
  // ...other args
  metadataStorage: ipfsMetadata
});

// store metadata
const cid = await coreSDK.storeMetadata(offerMetadata);

// get metadata
await coreSDK.getMetadata(cid);
```

### Offers

> TODO

### Exchange token

> TODO
