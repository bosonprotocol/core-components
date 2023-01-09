[Core components docs](./README.md)

# Local development

> The following is targeting developers who want to set up this repository locally to contribute, test or just play around.

## Contents

- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Linting](#linting)
- [Testing](#testing)
- [Building](#building)

## Prerequisites

- Node.js 16.X
- npm 8.X

Installing the correct versions of node and npm can also be done by installing [`volta`](https://volta.sh/). Volta will automatically get those versions from the root package.json file.

It is also beneficial to have a rough understanding of the [monorepo tools](./monorepo-tools.md) that we use in this project.

## Local setup

```bash
# checkout repo
git clone --recursive https://github.com/bosonprotocol/core-components.git

# install deps
cd core-components
npm ci
```

### Local e2e services

Requires:

- Docker compose >= v2
- Docker engine >= v20

If you want to run a local e2e setup with a deployed subgraph and contracts, run in the root of this monorepo

```bash
npm run build
npm run e2e:services
```

This will start a dockerized IPFS node, Graph node, PostgresDB and hardhat node and deploy all required contracts and subgraph.
For details have a look at the [`e2e/docker-compose.yml`](../e2e/docker-compose.yml) file.

## Linting

In the root of this monorepo run

```bash
# lint all
npm run lint

# lint all serially
npm run lint -- --concurrency=1

# lint single package with all dependent packages
npm run lint -- --scope="@bosonprotocol/core-sdk"

# lint single package without dependent packages
npm run lint -- --scope="@bosonprotocol/core-sdk" --no-deps
```

## Testing

### Unit tests

In the root of this monorepo run

```bash
# test all packages in parallel
npm run test

# test all packages serially
npm run test -- --concurrency=1

# test single package with all dependent packages
npm run test -- --scope="@bosonprotocol/core-sdk"

# test single package without dependent packages
npm run test -- --scope="@bosonprotocol/core-sdk" --no-deps
```

### e2e tests

In the root of this monorepo run

```bash
# starts all e2e services, deploys contracts and subgraph, and runs e2e tests
npm run e2e:suite

# OR

# only runs e2e tests. useful if you have the e2e services already running
npm run e2e:test
```

## Building

In the root of this monorepo run

```bash
# build all
npm run build

# build all serially
npm run build -- --concurrency=1

# build single package with all dependent packages
npm run build -- --scope="@bosonprotocol/core-sdk"

# build single package without dependent packages
npm run build -- --scope="@bosonprotocol/core-sdk" --no-deps
```
