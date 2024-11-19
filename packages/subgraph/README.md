# `@bosonprotocol/subgraph`

Official [subgraph](https://api.thegraph.com/subgraphs/name/bosonprotocol/polygon) of the Boson Protocol.

| Env          | Network   | Endpoint                                                                                     |
| ------------ | --------- | -------------------------------------------------------------------------------------------- |
| `production` | `polygon` | [`https://api.thegraph.com/subgraphs/name/bosonprotocol/polygon`](https://api.thegraph.com/subgraphs/name/bosonprotocol/polygon)                                                                                        |
| `testing`*    | `amoy` | [`https://api.thegraph.com/subgraphs/name/bosonprotocol/amoy-testing`](https://api.thegraph.com/subgraphs/name/bosonprotocol/amoy-testing) |
| `staging`*    | `amoy`  | [`https://api.thegraph.com/subgraphs/name/bosonprotocol/amoy-staging`](https://api.thegraph.com/subgraphs/name/bosonprotocol/amoy-staging)                              |


\* The `testing` and `staging` subgraphs are used for development purposes.
## Local development
If you haven't already, run in the root of this monorepo
```bash
npm ci
```

### Unit tests

We use [Matchstick](https://github.com/LimeChain/matchstick/blob/main/README.md) for unit testing the subgraph.

Either run in the root of this monorepo
```bash
npm run test -w @bosonprotocol/subgraph
```

or in the `/packages/subgraph` folder
```bash
npm run test
```
