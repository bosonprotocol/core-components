# Contracts update

This document provides a checklist for tasks that should be taken into consideration when updating the set of supported smart contracts in the `contracts` submodule.

1. Update submodule

```bash
# from root of monorepo
cd protocol-contracts
git checkout <BRANCH | COMMIT_HASH | TAG>

cd ..

git add .
git commit -m "chore: update protocol contracts submodule"
```

2. Export ABIs of updated contracts

```bash
# from root of monorepo
npm run export-abis
```

3. Deploy contracts to staging

```bash
# from root of monorepo
cd contracts
npm run deploy:ropsten
```

4. Update contract addresses in `@bosonprotocol/common` package

- for `testing` env the address of `protocolDiamond` should be taken from `contracts/protocol-contracts/addresses/*.json`
- for `staging` env the address of `protocolDiamond` should be taken from step 3.

5. Subgraph codegen and local deploy to make sure mappings and schemas are compatible

```bash
# from root of monorepo
npm run e2e:services

# in another terminal from root of monorepo
npm run deploy:local -w @bosonprotocol/subgraph
```

6. Core SDK codegen

```bash
# from root of monorepo
npm run codegen -w @bosonprotocol/core-sdk
```
