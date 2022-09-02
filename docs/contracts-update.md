# Contracts update

This document provides a checklist for tasks that should be taken into consideration when updating the set of supported smart contracts in the `contracts/protocol-contracts` submodule.

## Checklist

1. [Update contracts submodule](#1-update-contracts-submodule)
2. [Inspect diff](#2-inspect-diff)
3. [Adapt deploy script](#3-adapt-contracts-deploy-script)
4. [Export ABIs](#4-export-abis)
5. [Adapt subgraph](#5-adapt-subgraph)
6. [Adapt core-sdk](#6-adapt-core-sdk)
7. [Update contract addresses](#7-update-contract-addresses)
8. [Run sdk e2e tests](#8-run-e2e-tests)
9. [Adapt UI components](#9-adapt-ui-components)

### 1. Update contracts submodule

First, we need to update the set of contracts in [`protocol-contracts`](../contracts/protocol-contract) submodule:

```bash
# from root of monorepo
cd contracts/protocol-contracts

git checkout <BRANCH | COMMIT_HASH | TAG> # to update to a specific branch/commit/tag
# OR
git pull # to pull latest on main

cd ..

git add .
git commit -m "chore: update protocol contracts submodule"
```

### 2. Inspect diff

Inspect diff to get overview of changes, for example through GitHub:

```
https://github.com/bosonprotocol/boson-protocol-contracts/compare/<PREVIOUS_COMMIT_HASH>...<NEW_COMMIT_HASHJ>
```

### 3. Adapt contracts deploy script

For our e2e setup contracts deployment, we use a [customized deploy script](../contracts/scripts/deploy.js) that slightly differs from the one of the [`protocol-contracts`](../contracts/protocol-contracts/scripts/deploy-suite.js) submodule.
This script might need to be adapted based on the changes of the submodule script.

Additionally, we need to change the image tag in our e2e docker-compose file.

```diff
  hardhat-node:
    build: ../contracts
-    image: hardhat-node:<OLD_COMMIT_HASH>
+    image: hardhat-node:<NEW_COMMIT_HASH>
    ports:
      - "8545:8545"
```

### 4. Export ABIs

Based on the new set of contracts, we can now export ABIs to the `@bosonprotocol/common` package:

```bash
# from root of monorepo
npm run export-abis
```

This will compile the contracts, generate the respective ABIs and add them to the `./packages/common` workspace.
The supported ABIs can be configured in the [`hardhat.config.js`](../contracts/hardhat.config.js) in the `./contracts` folder.

### 5. Adapt subgraph

In the next step, we need to adapt the subgraph to the new set of contracts.

First, run in the `./packages/subgraph` workspace:

```bash
# in ./packages/subgraph
npm run manifest:local
```

This will auto-generate some AssemblyScript bindings based on the new ABIs and throw if there are incompatibilities in the manifest file.

Next, you can run the subgraph unit tests to find more breaking changes:

```bash
# in ./packages/subgraph
npm run test
```

Depending on the changes, you might also need to adapt some entity schema in the `schema.graphql` file or even change some handlers.

### 6. Adapt core-sdk

Based on the new ABIs, we also need to generate code for the Typechain bindings in the `@bosonprotocol/ethers-sdk` package and for the GraphQL typed helpers in the `@bosonprotocol/core-sdk` package.
Some helper functions for encoding/decoding contract method arguments and events might also need adaptation.

#### 6.1. Typechain bindings

First in the `./packages/ethers-sdk` workspace run:

```bash
# in ./packages/ethers-sdk
npm run typechain
```

This will recreate the Typechain bindings inside the [`./packages/ethers-sdk`](../packages/ethers-sdk/src/contracts/) folder.
The diff of these files also give a good entrypoint to determine which contract method or event signatures might have changed.

#### 6.2. Contract methods

Depending on the contract changes, you might also need to adapt some encoding/decoding functionality in the core-sdk.
Most of this functionality can be found inside the [`./packages/core-sdk`](../packages/core-sdk/) workspace under `src/<MODULE>/handler.ts` or `src/<MODULE>/interface.ts`.

#### 6.3. Subgraph bindings

Now, we need to create and adapt the typed subgraph GraphQL helpers in the core-sdk.
First, make sure to run the e2e services and deploy the subgraph.

```bash
# from root of monorepo
npm run e2e:services

# in another terminal from root of monorepo
npm run subgraph:deploy:local
```

If everything was successful, run

```bash
# form root of monorepo
npm run codegen -w @bosonprotocol/core-sdk
```

This will pull the GraphQL schemas from the deployed subgraph and generate the helpers.
It will also error if some types changed in the respective `queries.graphql` files.

### 7. Update contract addresses

Update contract addresses in `@bosonprotocol/common` package based on the respective files in [`contracts/protocol-contracts/addresses/*.json`](../contracts/protocol-contracts/addresses/) and from the local e2e deployment.

### 8. Run e2e tests

At this stage, it might be a good time to run the e2e tests.
Make sure the services are running in a terminal:

```bash
# from root of monorepo
npm run e2e:services
```

To run the tests:

```bash
# from root of monorepo
npm run e2e:test
```

### 9. Adapt UI components

After making sure that the non-ui SDKs are working, we need to adapt all UI related SDKs.

To see possible errors, run

```bash
# from root of monorepo
npm run build
```
