[Core components docs](./README.md)

# Releases

The core components of the Boson Protocol use GitHub Actions to automatically release to different targets.

## Publishing npm packages

Most of the workspaces in `packages/*` are libraries that can be consumed by other JS apps. They are published to npm.

### Alpha packages

Every merge into the `main` branch will trigger an `alpha` release of changed packages using `lerna`. For details have a look at [`.github/workflows/publish-alpha.yaml`](../.github/workflows/publish-alpha.yaml.).

### Latest packages

A stable release can be triggered manually by running the workflow `publish-latest.yaml` via the GitHub UI. For details have a look at [`.github/workflows/publish-latest.yaml`](../.github/workflows/publish-latest.yaml.)

## Deploying widgets

Widgets are hosted and primarily consumed through an iframe.

### Testing widgets

Every merge into the `main` branch will trigger a deployment of the `testing` widgets to IPFS via [fleek](https://fleek.co/).
For details have a look at [`.github/workflows/deploy-testing-widgets.yaml`](../.github/workflows/deploy-testing-widgets.yaml.).
These widgets can be accessed via:

- https://widgets-test.on.fleek.co

### Staging widgets

If a stable release of the packages are triggered through the GitHub UI, then a deployment of the `staging` widgets to IPFS via [fleek](https://fleek.co/) will also start.
For details have a look at [`.github/workflows/deploy-staging-widgets.yaml`](../.github/workflows/deploy-staging-widgets.yaml.).
These widgets can be accessed via:

- https://widgets-staging.on.fleek.co

### Production widgets

A `production` widgets deployment to IPFS/Cloudflare via [fleek](https://fleek.co/) can be triggered through the GitHub UI by running the workflow `deploy-prod-widgets.yaml`. For details have a look at [`.github/workflows/deploy-prod-widgets.yaml`](../.github/workflows/deploy-prod-widgets.yaml.). These widgets can be accessed via:

- https://widgets.on.fleek.co (TODO: replace with official one)

## Deploying subgraphs

Subgraphs are deployed also to different environments.

### Testing

Every merge into the `main` branch will trigger a deployment of the subgraph which listens to our `testing` environment. For details have a look at [`.github/workflows/deploy-testing-subgraph.yaml`](../.github/workflows/deploy-testing-subgraph.yaml.). Access this subgraph via:

- https://graph.bsn-development-potassium.bosonportal.io/subgraphs/name/boson/corecomponents

### Staging

If a stable release of the packages are triggered through the GitHub UI, then a deployment of the subgraph connected to the `staging` environment is also initiated. For details have a look at [`.github/workflows/deploy-staging-subgraph.yaml`](../.github/workflows/deploy-staging-subgraph.yaml.). Access this subgraph via:

- https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai

### Production widgets

A `production` subgraph deployment to can be triggered through the GitHub UI by running the workflow `deploy-prod-subgraph.yaml`. For details have a look at [`.github/workflows/deploy-prod-subgraph.yaml`](../.github/workflows/deploy-prod-subgraph.yaml.). Access this subgraph via:

- TODO
