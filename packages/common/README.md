# `@bosonprotocol/common`

JS lib with common types, interfaces and utilities shared by the core components of the Boson Protocol.

## Install

```bash
npm install @bosonprotocol/common

# OR

yarn add @bosonprotocol/common
```

## Usage

### ABIs

Useful ABIs can be imported.

```js
import { abis } from "@bosonprotocol/common";

const { ProtocolDiamondABI } = abis;
```

### Default configs

We provide default configurations for multiple environments that can be used for easier interaction.

```js
import { getDefaultConfig } from "@bosonprotocol/common";

const defaultConfigOnRopsten = getDefaultConfig("staging");
// {
//   ...otherConfigParameters,
//   subgraphUrl: "https://api.thegraph.com/subgraphs/name/bosonprotocol/ccropsten",
//   contracts: {
//     protocolDiamond: "0x5E3f5127e320aD0C38a21970E327eefEf12561E5"
//   }
// }
```

### Interfaces and types

Interfaces and types can also be imported. This might be useful for implementing custom a `Web3LibAdapter` or `MetadataStorage`.

```ts
import { Web3LibAdapter, MetadataStorage } from "@bosonprotocol/common";

class CustomWeb3LibAdapter implements Web3LibAdapter {
  // implementation
}

class CustomMetadataStorage implements MetadataStorage {
  // implementation
}
```

#### `Web3LibAdapter`

The [core-sdk](/packages/core-sdk/README.md) has the following features:

- web3 lib agnostic
- lightweight
- consists of composable building blocks
- leverages existing tools, such as [TypeChain](https://github.com/dethcrypto/TypeChain)

To achieve these, we use an adapter pattern with [`Web3LibAdapter`](./src/types/web3-lib-adapter.ts) being the interface.

An example implementation is the [`EthersAdapter`](/packages/ethers-sdk/src/ethers-adapter.ts) targeting the [ethers](https://docs.ethers.io/) library.
