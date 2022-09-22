# Usage with `react`, `ethers` and `IPFS`

We provide an opinionated way to interact with the protocol, that requires `react`, `ethers` and `IPFS`.

## Install

In your existing react app, run

```bash
npm i @bosonprotocol/react-kit ethers
```

## Initialize

The most convenient way to initialize the `core-sdk` in a react environment, is to use the `useCoreSdk` hook

```ts
// read-only
const readOnlyCoreSdk = useCoreSdk({
  envName: "testing"
});

// with write capabilities
const writeCoreSdk = useCoreSdk({
  envName: "testing",
  web3Provider: provider // ethers provider / signer
});
```
