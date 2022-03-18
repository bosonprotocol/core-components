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

This project requires the following versions of node.js and npm:

- node.js >= 16.14.0
- npm@8.5.3

It is also beneficial to have a rough understanding of the [monorepo tools](./monorepo-tools.md) that we use in this project.

## Local setup

```bash
# checkout repo
git checkout https://github.com/bosonprotocol/core-components.git

# install deps
cd core-components
npm install
```

### Local widgets and example parent app

In the root of this monorepo run

```bash
# only needed first time running dev env
npm run build

# run dev environment
npm run dev
```

This will build every package and start dev servers for the [widgets]() and the [example parent app]():

- widgets -> http://localhost:3000
- example parent app -> http://localhost:4000

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
