# `@bosonprotocol/ethers-sdk`

JS lib that exports `EthersAdapter` (implementation of `Web3LibAdapter`) and contract abstractions targeting [ethers](https://docs.ethers.io/v5/).

## Install

```bash
npm i @bosonprotocol/ethers-sdk ethers

# OR

yarn add @bosonprotocol/ethers-sdk ethers
```

## Usage

### `EthersAdapter`

This adapter is intended to be passed as an constructor argument to [`@bosonprotocol/core-sdk`](/packages/core-sdk/README.md).

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { ethers } from "ethers";

// injected web3 provider
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

const ethersAdapter = new EthersAdapter(web3Provider);
const coreSDK = new CoreSDK({
  web3Lib: ethersAdapter
  // ...other args
});
```

### Contract abstractions

We provide fully typed, auto-generated contract abstractions using [TypeChain](https://github.com/dethcrypto/TypeChain), which targets ethers.

```ts
import { contracts } from "@bosonprotocol/ethers-sdk";

const bosonOfferHandler = contracts.IBosonOfferHandler__factory.connect(
  contractAddress,
  ethersSignerOrProvider
);
```
