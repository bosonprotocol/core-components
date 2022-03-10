# `@bosonprotocol/ipfs-storage`

`Metadata` interface implementation for IPFS.

## Usage

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsStorage } from "@bosonprotocol/ipfs-storage";

const coreSDK = await CoreSDK.fromDefaultConfig({
  web3Lib: new EthersAdapter({ signer }),
  metadataStorage: new IpfsStorage({
    url: "YOUR_IPFS_URL"
  })
  theGraphStorage: IpfsStorage.fromTheGraphIpfsUrl()
});
```
