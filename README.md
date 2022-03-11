# core-components

Core components monorepo of the Boson Protocol.

## Local development

### Prerequisites

- Node.js >=16.14.0
- npm@8.5.3

### Monorepo tools

- [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
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
npm ci
```
3. Run dev environment 

```bash
# "build" command is only needed first time running dev env 
npm run build && npm run dev
```

### Run tests

In the root of this monorepo run

```bash
# Run tests of all packages in parallel
npm run test

# Run tests of all packages serially
npm run test --concurrency=1

# Run tests of single package with all dependent packages
npm run test --scope="@bosonprotocol/contract-sdk"

# Run test of single package without dependent packages
npm run test --scope="@bosonprotocol/contracts-sdk" --no-deps
```
