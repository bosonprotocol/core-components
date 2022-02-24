# core-components

Core components monorepo of the Boson Protocol.

## Local development

### Prerequisites

- Node.js >=16.14.0
- yarn >=3.2.0

### Monorepo tools

- [yarn workspaces](https://yarnpkg.com/features/workspaces)
- [lerna](https://lerna.js.org/)
- [turborepo](https://turborepo.org/)

### Get started

1. Checkout this repository

```bash
git checkout https://github.com/bosonprotocol/core-components.git
```

2. Install dependencies

```bash
cd core-components
yarn install
```

### Run tests

In the root of this monorepo run

```bash
# Run tests of all packages in parallel
yarn test

# Run tests of all packages serially
yarn test --concurrency=1

# Run tests of single package with all dependent packages
yarn test --scope="@bosonprotocol/contract-sdk"

# Run test of single package without dependent packages
yarn test --scope="@bosonprotocol/contracts-sdk" --no-deps
```
