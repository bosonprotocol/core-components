[Core components docs](./README.md)

# Releases

The core components of the Boson Protocol use GitHub Actions to automatically release to different targets.

## Publishing npm packages

Most of the workspaces in `packages/*` are libraries that can be consumed by other JS apps. They are published to npm.

### Alpha packages

Every merge into the `main` branch will trigger an `alpha` release of changed packages using `lerna`. For details have a look at [`.github/workflows/publish-alpha.yaml`](../.github/workflows/publish-alpha.yaml.).

### Latest packages

A stable release can be triggered manually by running the workflow `publish-latest.yaml` via the GitHub UI. For details have a look at [`.github/workflows/publish-latest.yaml`](../.github/workflows/publish-latest.yaml.)

## Deploying subgraphs

Subgraphs are deployed also to different environments.

### Testing

Every merge into the `main` branch will trigger a deployment of the subgraph which listens to our `testing` environment. For details have a look at [`.github/workflows/deploy-testing-subgraph.yaml`](../.github/workflows/deploy-testing-subgraph.yaml.). Access this subgraph via:

- https://graph.bsn-development-potassium.bosonportal.io/subgraphs/name/boson/corecomponents

### Staging

If a stable release of the packages are triggered through the GitHub UI, then a deployment of the subgraph connected to the `staging` environment is also initiated. For details have a look at [`.github/workflows/deploy-staging-subgraph.yaml`](../.github/workflows/deploy-staging-subgraph.yaml.). Access this subgraph via:

- https://api.thegraph.com/subgraphs/name/bosonprotocol/mumbai

### Production

A `production` subgraph deployment to can be triggered through the GitHub UI by running the workflow `deploy-prod-subgraph.yaml`. For details have a look at [`.github/workflows/deploy-prod-subgraph.yaml`](../.github/workflows/deploy-prod-subgraph.yaml.). Access this subgraph via:

- TODO
