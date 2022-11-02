[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h2 align="center">Core Components of the Boson Protocol</h2>

<div align="center">

<a href="">![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)</a>
<a href="https://discord.com/invite/QSdtKRaap6">![](https://img.shields.io/badge/Chat%20on-Discord-%235766f2?style=flat-square)</a>
<a href="https://twitter.com/BosonProtocol">![](https://img.shields.io/twitter/follow/BosonProtocol?style=social)</a>

<a href="https://github.com/bosonprotocol/core-components/actions/workflows/ci.yaml">[![Build Status](https://github.com/bosonprotocol/core-components/actions/workflows/ci.yaml/badge.svg)](https://github.com/bosonprotocol/core-components/actions/workflows/ci.yaml)</a>
[![codecov](https://codecov.io/gh/bosonprotocol/core-components/branch/main/graph/badge.svg?token=FLAIl8Zov2)](https://codecov.io/gh/bosonprotocol/core-components)

</div align="center">

<div align="center">

🛠️ **Tools for building on top of the [Boson Protocol](https://bosonprotocol.io).**

</div>

## Getting started

- [How tos & guides]()
- [API docs](docs/README.md)
- [Local development](docs/local-development.md)

## Components

The core components can be found in the [`packages`](/packages) folder of this monorepo.

| Component                                                  | Release                                                                                         | Description                                                                                                                                                                                                                                |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`common`](/packages/common/README.md)                     | ![](https://img.shields.io/npm/v/@bosonprotocol/common?style=flat-square&color=02c987)          | JS lib with common types, interfaces and utilities shared by the core components in this repository.                                                                                                                                       |
| [`core-sdk`](/packages/core-sdk/README.md)                 | ![](https://img.shields.io/npm/v/@bosonprotocol/core-sdk?style=flat-square&color=02c987)        | JS lib that facilitates interaction with the Boson Protocol [contracts](https://github.com/bosonprotocol/boson-protocol-contracts), [subgraph](/packages/subgraph/README.md) and [IPFS metadata storage](/packages/ipfs-storage/README.md) |
| [`eth-connect-sdk`](/packages/eth-connect-sdk/README.md)   | ![](https://img.shields.io/npm/v/@bosonprotocol/eth-connect-sdk?style=flat-square&color=02c987) | JS lib that exports implementation of [`Web3LibAdapter`](/packages/eth-connect-sdk/src/eth-connect-adapter.ts) and contract abstractions targeting [eth-connect](https://github.com/decentraland/eth-connect).                             |
| [`ethers-sdk`](/packages/ethers-sdk/src/ethers-adapter.ts) | ![](https://img.shields.io/npm/v/@bosonprotocol/ethers-sdk?style=flat-square&color=02c987)      | JS lib that exports implementation of [`Web3LibAdapter`](/packages/ethers-sdk/src/ethers-adapter.ts) and contract abstractions targeting [ethers](https://github.com/ethers-io/ethers.js).                                                 |
| [`ipfs-storage`](/packages/ipfs-storage/README.md)         | ![](https://img.shields.io/npm/v/@bosonprotocol/ipfs-storage?style=flat-square&color=02c987)    | JS lib that exports implementation of [`MetadataStorage`](/packages/ipfs-storage/src/ipfs.ts) for handling offer metadata on IPFS.                                                                                                         |
| [`metadata`](/packages/metadata/README.md)                 | ![](https://img.shields.io/npm/v/@bosonprotocol/metadata?style=flat-square&color=02c987)        | Package which contains supported metadata types and tools.                                                                                                                                                                                 |
| [`react-kit`](/packages/react-kit/README.md)               | ![](https://img.shields.io/npm/v/@bosonprotocol/react-kit?style=flat-square&color=02c987)       | React toolkit with smart components and hooks.                                                                                                                                                                                             |
| [`subgraph`](/packages/subgraph/README.md)                 | ![](https://img.shields.io/badge/The%20Graph-Hosted-blueviolet?style=flat-square)               | Schemas and mappings of the [Boson Protocol subgraph](https://api.thegraph.com/subgraphs/name/bosonprotocol/polygon) on [The Graph](https://thegraph.com/en/).                                                                             |
