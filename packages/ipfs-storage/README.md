# `@bosonprotocol/ipfs-storage`

`Metadata` interface implementation for IPFS.

## Usage

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { IpfsStorage } from "@bosonprotocol/ipfs-storage";

const coreSDK = CoreSDK.fromDefaultConfig({
  // other args
  metadataStorage: new IpfsStorage({
    url: "YOUR_IPFS_URL"
  })
  theGraphStorage: IpfsStorage.fromTheGraphIpfsUrl()
});
```
