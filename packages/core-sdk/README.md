# `@bosonprotocol/core-sdk`

JS lib that facilitates interaction with the Boson Protocol contracts, subgraph and metadata storage.

## Get started

The `core-sdk` is intended to be used in combination with implementations of the `Web3LibAdapter` and `MetadataStorage` interfaces.

We currently support the following

- `Web3LibAdapter` implementations:

  - `EthersAdapter` exported from [`@bosonprotocol/ethers-sdk`](/packages/ethers-sdk/README.md)
  - `EthConnectAdapter` exported from [`@bosonprotocol/eth-connect-sdk`](/packages/eth-connect-sdk/README.md)

- `MetadataStorage` implementations:
  - `IpfsMetadata` exported from [`@bosonprotocol/ipfs-storage`](/packages/ipfs-storage/README.md)

Follow the respective guides to get started

- [Use with `ethers` and `IPFS`](/docs/guides/use-with-ethers-ipfs.md)
