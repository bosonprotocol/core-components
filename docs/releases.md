[Core components docs](./README.md)

# Releases

The core components of the Boson Protocol have different release targets.

## Publishing npm packages

Libraries which can be consumed by other JS apps are published to npm.
See `.github/workflows/publish-release.yaml` for details.

## Deploying widgets

Widgets are primarily consumed through an iframe.
Have a look into `.github/workflows/deploy-to-surge.yaml` to see the workflow for deploying the `next` version of the widgets and example parent app to:

- https://boson-widgets-test.surge.sh
- https://boson-parent-test.surge.sh

The `stable` version of the widgets are deployed to IPFS via [fleek](https://fleek.co/). See `.github/workflows/deploy-widgets-ipfs.yaml` for details. The url is:

- https://billowing-sound-6347.on.fleek.co (TODO: replace with official one)

## Deploying subgraphs

> TODO
