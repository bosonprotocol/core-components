[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h2 align="center">Core Components of the Boson Protocol</h2>

<div align="center">

<a href="">![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)</a>
<a href="https://discord.com/invite/QSdtKRaap6">![](https://img.shields.io/badge/Chat%20on-Discord-%235766f2?style=flat-square)</a>
<a href="https://twitter.com/BosonProtocol">![](https://img.shields.io/twitter/follow/BosonProtocol?style=social)</a>

<a href="https://github.com/bosonprotocol/core-components/actions/workflows/ci.yaml">[![Build Status](https://github.com/bosonprotocol/core-components/actions/workflows/ci.yaml/badge.svg)](https://github.com/bosonprotocol/core-components/actions/workflows/ci.yaml)</a>
![](https://img.shields.io/badge/Coverage-18%25-F2C572.svg?prefix=$coverage$)

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

| Component | Release | Tests | Description |
| ---- | ---- | -------- | -------- |
| [`common`](/packages/common/README.md) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-34%25-red.svg?prefix=$common-summary$) | JS lib with common types, interfaces and utilities shared by the core components in this repository. |
| [`core-sdk`](/packages/core-sdk/README.md) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-0%25-red.svg?prefix=$core-sdk-summary$) | JS lib that facilitates interaction with the Boson Protocol [contracts](https://github.com/bosonprotocol/boson-protocol-contracts), [subgraph](/packages/subgraph/README.md) and [IPFS metadata storage](/packages/ipfs-storage/README.md) |
| [`eth-connect-sdk`](/packages/eth-connect-sdk/README.md) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-0%25-red.svg?prefix=$eth-connect-sdk-summary$) | JS lib that exports implementation of [`Web3LibAdapter`](/packages/eth-connect-sdk/src/eth-connect-adapter.ts) and contract abstractions targeting [eth-connect](https://github.com/decentraland/eth-connect). |
| [`ethers-sdk`](/packages/ethers-sdk/src/ethers-adapter.ts) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-0%25-red.svg?prefix=$ethers-sdk-summary$) | JS lib that exports implementation of [`Web3LibAdapter`](/packages/ethers-sdk/src/ethers-adapter.ts) and contract abstractions targeting [ethers](https://github.com/ethers-io/ethers.js). |
| [`ipfs-storage`](/packages/ipfs-storage/README.md) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-0%25-red.svg?prefix=$ipfs-storage-summary$) | JS lib that exports implementation of [`MetadataStorage`](/packages/ipfs-storage/src/ipfs.ts) for handling offer metadata on IPFS. |
| [`metadata`](/packages/metadata/README.md) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-83%25-green.svg?prefix=$metadata-summary$) | Lorem ipsum |
| [`subgraph`](/packages/subgraph/README.md) | ![](https://img.shields.io/badge/The%20Graph-Hosted-blueviolet?style=flat-square) | ![](https://img.shields.io/badge/Coverage-50%25-lightgrey.svg?prefix=$subgraph-summary$) | Schemas and mappings of the [Boson Protocol subgraph]() on [The Graph](https://thegraph.com/en/). |
| [`widgets-sdk`](/packages/widgets-sdk/README.md) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square) | ![](https://img.shields.io/badge/Coverage-50%25-lightgrey.svg?prefix=$widgets-sdk-summary$) | React-based lib for embedding [`widgets`](/packages/widgets/README.md) as iframes. |
| [`widgets`](/packages/widgets/README.md) | [![widgets](https://img.shields.io/badge/url-widgets-green)](https://widgets.bosonprotocol.io) |  ![](https://img.shields.io/badge/Coverage-50%25-lightgrey.svg?prefix=$widgets-summary$) |React-based widgets that implement the core user flows of the Boson Protocol. Can be embedded via an iframe and url https://widgets.bosonprotocol.io or using the [`widgets-sdk`](/packages/widgets-sdk/README.md). |
