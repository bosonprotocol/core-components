# `@bosonprotocol/eth-connect-sdk`

JS lib that exports `EthConnectAdapter` (implementation of `Web3LibAdapter`) and contract abstractions targeting [`eth-connect`](https://github.com/decentraland/eth-connect).

## Install

```bash
npm i @bosonprotocol/eth-connect-sdk eth-connect

# OR

yarn add @bosonprotocol/eth-connect-sdk eth-connect
```

## Usage

### `EthConnectAdapter`

This adapter is intended to be passed as an constructor argument to [`@bosonprotocol/core-sdk`](/packages/core-sdk/README.md).

```js
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { EthConnectAdapter } from "@bosonprotocol/eth-connect-sdk";
import { RequestManager } from "eth-connect";

// injected MetaMask provider
const requestManager = new RequestManager(web3.currentProvider);

const ethConnectAdapter = new EthConnectAdapter(requestManager);
const coreSDK = new CoreSDK({
  web3Lib: ethConnectAdapter
  // ...other args
});
```

### Contract abstractions

> TODO
