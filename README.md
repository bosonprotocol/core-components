[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h2 align="center">Core Components of the Boson Protocol</h2>

<center>

![](https://img.shields.io/badge/license-Apache--2.0-brightgreen?style=flat-square)

</center>

Tools for building on top of the [Boson Protocol](https://bosonprotocol.io).

## Getting started

- [API docs]()
- [How tos & guides]()
- [Local development](docs/local-development.md)

## Components

The core components can be found in the [`/packages`](https://github.com/bosonprotocol/core-components/tree/main/packages) folder of this monorepo.

| Component                                                                                          | Release                                                                                        | Description                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`common`](https://github.com/bosonprotocol/core-components/tree/main/packages/common)             | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square)                             | JS lib with common types, interfaces and utilities shared by the core components in this repository.                                                                                                                                                             |
| [`core-sdk`](https://github.com/bosonprotocol/core-components/tree/main/packages/core-sdk)         | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square)                             | JS lib that facilitates interaction with the Boson Protocol [contracts](), [subgraph]() and [IPFS metadata storage]()                                                                                                                                            |
| [`eth-connect-sdk`](https://github.com/bosonprotocol/core-components/tree/main/packages/core-sdk)  | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square)                             | JS lib that exports implementation of [`Web3LibAdapter`]() and contract abstractions targeting [`eth-connect`](https://github.com/decentraland/eth-connect).                                                                                                     |
| [`ethers-sdk`](https://github.com/bosonprotocol/core-components/tree/main/packages/ethers-sdk)     | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square)                             | JS lib that exports implementation of [`Web3LibAdapter`]() and contract abstractions targeting [`ethers`](https://github.com/ethers-io/ethers.js).                                                                                                               |
| [`ipfs-storage`](https://github.com/bosonprotocol/core-components/tree/main/packages/ipfs-storage) | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square)                             | JS lib that exports implementation of [`MetadataStorage`]() for handling offer metadata on IPFS.                                                                                                                                                                 |
| [`subgraph`](https://github.com/bosonprotocol/core-components/tree/main/packages/subgraph)         | ![](https://img.shields.io/badge/The%20Graph-Hosted-blueviolet?style=flat-square)              | Schemas and mappings of the [Boson Protocol subgraph]() on [The Graph](https://thegraph.com/en/).                                                                                                                                                                |
| [`widgets-sdk`](https://github.com/bosonprotocol/core-components/tree/main/packages/core-sdk)      | ![](https://img.shields.io/badge/npm-0.0.0-blue?style=flat-square)                             | React-based lib for embedding [widgets](https://github.com/bosonprotocol/core-components/tree/main/packages/widgets) as iframes.                                                                                                                                 |
| [`widgets`](https://github.com/bosonprotocol/core-components/tree/main/packages/core-sdk)          | [![widgets](https://img.shields.io/badge/url-widgets-green)](https://widgets.bosonprotocol.io) | React-based widgets that implement the core user flows of the Boson Protocol. Can be embedded via an iframe and url https://widgets.bosonprotocol.io or using the [`widgets-sdk`](https://github.com/bosonprotocol/core-components/tree/main/packages/core-sdk). |
