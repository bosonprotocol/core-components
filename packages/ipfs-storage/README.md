# `@bosonprotocol/ipfs-storage`

`MetadataStorage` interface implementation for IPFS.

## Install

```bash
npm i @bosonprotocol/ipfs-storage

# OR

yarn add @bosonprotocol/ipfs-storage
```

## Usage

Use as a standalone instance to handle metadata or pass as an constructor argument to [`@bosonprotocol/core-sdk`](/packages/core-sdk/README.md).

```js
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";

const ipfsMetadata = new IpfsMetadata({ url: "https://ipfs.infura.io:5001" });
```
