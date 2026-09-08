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
import { IpfsMetadataStorage } from "@bosonprotocol/ipfs-storage";
import { validateMetadata } from "@bosonprotocol/metadata";

const ipfsMetadataStorage = new IpfsMetadataStorage(validateMetadata, {
  url: "https://uploads.pinata.cloud/v3/files",
  headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
  // Pinata's upload endpoint is not an IPFS HTTP API, so reads go through a
  // gateway. Defaults to https://ipfs.io/ipfs when omitted.
  gatewayUrl: "https://my-gateway.mypinata.cloud/ipfs",
  // Dedicated *.mypinata.cloud gateways answer 403 without a gateway token,
  // and they do NOT accept the API JWT. Omit for a public gateway.
  gatewayToken: process.env.PINATA_GATEWAY_TOKEN
});
```
